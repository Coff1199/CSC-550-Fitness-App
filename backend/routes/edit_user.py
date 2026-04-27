from flask import Blueprint, request, jsonify, session
from db import SessionLocal
from db import conn
from sqlalchemy import text

# Create auth blueprint
edit_user_bp = Blueprint("edit-user", __name__)

@edit_user_bp.route('/api/edit-user', methods=["PUT"])
def edit_user():
    """
    Edit an existing user's profile information
    
    Request body:
        {
            "firstname": "John",
            "lastname": "Doe",
            "email": "john@example.com"
        }
    
    Returns:
        200: User updated successfully
        400: Missing or invalid fields
        401: User not authenticated
        409: Email already in use
        500: Server error
    """
    try:
        # Check if user is logged in
        if 'user_id' not in session:
            return jsonify({'error': 'User not authenticated'}), 401

        data = request.get_json()

        # Validate required fields
        if not all([data.get('firstname'), data.get('lastname'), data.get('email')]):
            return jsonify({'error': 'All fields are required'}), 400

        firstname = data['firstname'].strip()
        lastname = data['lastname'].strip()
        email = data['email'].strip().lower()
        user_id = session['user_id']

        # Basic email format check
        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Invalid email format'}), 400

        # Check if email already exists for another user
        check_query = text('SELECT id FROM "Users" WHERE email = :email AND id != :id;')
        existing = conn.execute(check_query, {"email": email, "id": user_id}).fetchone()
        if existing:
            return jsonify({'error': 'Email already in use'}), 409

        # Update user info
        update_query = text(
            'UPDATE "Users" SET firstname = :firstname, lastname = :lastname, email = :email '
            'WHERE id = :id;'
        )
        conn.execute(update_query, {
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "id": user_id
        })
        conn.commit()

        # Update session info
        session['user_name'] = f"{firstname} {lastname}"
        session['user_email'] = email

        return jsonify({
            'message': 'User updated successfully',
            'user': {
                'id': user_id,
                'name': session['user_name'],
                'email': email
            }
        }), 200

    except Exception as e:
        print(f"Edit user error: {str(e)}")
        return jsonify({'error': 'Server error occurred'}), 500