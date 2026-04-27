from db import conn
from sqlalchemy import text


def test_reset_password_success(client):
    """
    Test Case - Successful password reset
    """

    # Register user
    payload = {
        "firstname": "Reset",
        "lastname": "User",
        "email": "reset_test@example.com",
        "password": "OldPass123!"
    }
    client.post("/api/register", json=payload)

    # Login user
    client.post("/api/login", json={
        "email": "reset_test@example.com",
        "password": "OldPass123!"
    })

    # Reset password
    response = client.put("/api/reset-password", json={
        "currentPassword": "OldPass123!",
        "newPassword": "NewPass123!"
    })

    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Password updated successfully"

    # Teardown
    conn.execute(
        text('DELETE FROM "Users" WHERE email = :email'),
        {"email": "reset_test@example.com"}
    )
    conn.commit()


def test_reset_password_wrong_current_password(client):
    """
    Test Case - Wrong current password should fail
    """

    # Register user
    client.post("/api/register", json={
        "firstname": "Wrong",
        "lastname": "Pass",
        "email": "wrongpass_test@example.com",
        "password": "CorrectPass123!"
    })

    # Login user
    client.post("/api/login", json={
        "email": "wrongpass_test@example.com",
        "password": "CorrectPass123!"
    })

    # Try wrong current password
    response = client.put("/api/reset-password", json={
        "currentPassword": "WrongPass123!",
        "newPassword": "NewPass123!"
    })

    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "Current password is incorrect"

    # Teardown
    conn.execute(
        text('DELETE FROM "Users" WHERE email = :email'),
        {"email": "wrongpass_test@example.com"}
    )
    conn.commit()


def test_reset_password_not_authenticated(client):
    """
    Test Case - User not logged in
    """

    response = client.put("/api/reset-password", json={
        "currentPassword": "Anything123!",
        "newPassword": "NewPass123!"
    })

    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "User not authenticated"


def test_reset_password_missing_fields(client):
    """
    Test Case - Missing input fields should fail
    """

    # Register + login
    client.post("/api/register", json={
        "firstname": "Missing",
        "lastname": "Fields",
        "email": "missing_reset@example.com",
        "password": "TestPass123!"
    })

    client.post("/api/login", json={
        "email": "missing_reset@example.com",
        "password": "TestPass123!"
    })

    # Missing newPassword
    response = client.put("/api/reset-password", json={
        "currentPassword": "TestPass123!"
    })

    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data

    # Teardown
    conn.execute(
        text('DELETE FROM "Users" WHERE email = :email'),
        {"email": "missing_reset@example.com"}
    )
    conn.commit()


def test_reset_password_user_not_found(client):
    """
    Test Case - Edge case where user is deleted after login
    """

    # Register + login
    client.post("/api/register", json={
        "firstname": "Ghost",
        "lastname": "User",
        "email": "ghost_reset@example.com",
        "password": "TestPass123!"
    })

    client.post("/api/login", json={
        "email": "ghost_reset@example.com",
        "password": "TestPass123!"
    })

    # Delete user manually
    conn.execute(
        text('DELETE FROM "Users" WHERE email = :email'),
        {"email": "ghost_reset@example.com"}
    )
    conn.commit()

    # Try reset password
    response = client.put("/api/reset-password", json={
        "currentPassword": "TestPass123!",
        "newPassword": "NewPass123!"
    })

    assert response.status_code == 404
    data = response.get_json()
    assert data["error"] == "User not found"