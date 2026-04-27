from db import conn
from sqlalchemy import text

def test_edit_user_success(client):
    """
    Test Case - Successful profile update
    """

    # First register a user to edit
    payload = {
        "firstname": "Edit",
        "lastname": "User",
        "email": "edituser_test@example.com",
        "password": "SecurePass123!"
    }
    client.post("/api/register", json=payload)

    # Login to create session
    client.post("/api/login", json={
        "email": "edituser_test@example.com",
        "password": "SecurePass123!"
    })

    # Edit user data
    update_payload = {
        "firstname": "Updated",
        "lastname": "Name",
        "email": "updated_test@example.com"
    }

    response = client.put("/api/edit-user", json=update_payload)

    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "User updated successfully"
    assert data["user"]["email"] == "updated_test@example.com"

    # Teardown
    conn.execute(
        text('DELETE FROM "Users" WHERE email = :email'),
        {"email": "updated_test@example.com"}
    )
    conn.commit()


def test_edit_user_not_authenticated(client):
    """
    Test Case - User not logged in should fail
    """
    payload = {
        "firstname": "Test",
        "lastname": "User",
        "email": "test@example.com"
    }

    response = client.put("/api/edit-user", json=payload)

    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "User not authenticated"


def test_edit_user_missing_fields(client):
    """
    Test Case - Missing input fields should fail validation
    """

    # Register + login user
    payload = {
        "firstname": "Missing",
        "lastname": "Fields",
        "email": "missingfields_test@example.com",
        "password": "SecurePass123!"
    }
    client.post("/api/register", json=payload)
    client.post("/api/login", json={
        "email": "missingfields_test@example.com",
        "password": "SecurePass123!"
    })

    # Missing lastname
    update_payload = {
        "firstname": "NewName",
        "email": "newemail@example.com"
    }

    response = client.put("/api/edit-user", json=update_payload)

    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

    # Teardown
    conn.execute(
        text('DELETE FROM "Users" WHERE email = :email'),
        {"email": "missingfields_test@example.com"}
    )
    conn.commit()


def test_edit_user_duplicate_email(client):
    """
    Test Case - Email already exists for another user
    """

    # Create first user
    client.post("/api/register", json={
        "firstname": "User1",
        "lastname": "Test",
        "email": "user1_test@example.com",
        "password": "SecurePass123!"
    })

    # Create second user
    client.post("/api/register", json={
        "firstname": "User2",
        "lastname": "Test",
        "email": "user2_test@example.com",
        "password": "SecurePass123!"
    })

    # Login as user2
    client.post("/api/login", json={
        "email": "user2_test@example.com",
        "password": "SecurePass123!"
    })

    # Try updating user2 email to user1's email
    response = client.put("/api/edit-user", json={
        "firstname": "User2",
        "lastname": "Test",
        "email": "user1_test@example.com"
    })

    assert response.status_code == 409
    data = response.get_json()
    assert data["error"] == "Email already in use"

    # Teardown
    conn.execute(text('DELETE FROM "Users" WHERE email = :email'),
                 {"email": "user1_test@example.com"})
    conn.execute(text('DELETE FROM "Users" WHERE email = :email'),
                 {"email": "user2_test@example.com"})
    conn.commit()