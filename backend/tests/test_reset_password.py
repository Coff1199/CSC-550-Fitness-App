from db import conn
from sqlalchemy import text


def test_reset_password_success(client):
    """
    Test Case - Successful password reset
    """

    # Register user
    client.post("/api/register", json={
        "firstname": "Reset",
        "lastname": "User",
        "email": "reset_test@example.com",
        "password": "OldPass123!"
    })

    # Login (creates session)
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

    # Logout + login with new password to verify
    client.post("/api/logout")

    login_check = client.post("/api/login", json={
        "email": "reset_test@example.com",
        "password": "NewPass123!"
    })

    assert login_check.status_code == 200


def test_reset_password_wrong_current_password(client):
    """
    Test Case - Wrong current password should fail
    """

    client.post("/api/register", json={
        "firstname": "Wrong",
        "lastname": "Pass",
        "email": "wrongpass_test@example.com",
        "password": "CorrectPass123!"
    })

    client.post("/api/login", json={
        "email": "wrongpass_test@example.com",
        "password": "CorrectPass123!"
    })

    response = client.put("/api/reset-password", json={
        "currentPassword": "WrongPass123!",
        "newPassword": "NewPass123!"
    })

    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] in [
        "Current password is incorrect",
        "Invalid email or password"
    ]


def test_reset_password_not_authenticated(client):
    """
    Test Case - No session (not logged in)
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
    Test Case - Missing fields validation
    """

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

    response = client.put("/api/reset-password", json={
        "currentPassword": "TestPass123!"
    })

    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data


def test_reset_password_wrong_session_flow(client):
    """
    Test Case - session cleared should block reset
    """

    client.post("/api/register", json={
        "firstname": "Session",
        "lastname": "Test",
        "email": "session_test@example.com",
        "password": "TestPass123!"
    })

    client.post("/api/login", json={
        "email": "session_test@example.com",
        "password": "TestPass123!"
    })

    # logout removes session
    client.post("/api/logout")

    response = client.put("/api/reset-password", json={
        "currentPassword": "TestPass123!",
        "newPassword": "NewPass123!"
    })

    assert response.status_code == 401
    data = response.get_json()
    assert data["error"] == "User not authenticated"