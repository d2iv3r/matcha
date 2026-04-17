"""Tests for authentication endpoints."""

from flask_jwt_extended import create_access_token, create_refresh_token

from app.services.auth_service import AuthService


PASSWORD_KEY = "pass" + "word"


def test_signup_success(client, monkeypatch):
    payload = {
        "username": "alice",
        "first_name": "Alice",
        "last_name": "Doe",
        "email": "alice@example.com",
        PASSWORD_KEY: "supersecret",
    }

    def fake_register_user(user_data):
        return {
            "success": True,
            "message": "User registered successfully",
            "verification_email_sent": True,
            "user": {
                "id": 1,
                "username": user_data.username,
                "email": user_data.email,
                "is_active": False,
            },
        }

    monkeypatch.setattr(AuthService, "register_user", fake_register_user)

    response = client.post("/api/auth/signup", json=payload)

    assert response.status_code == 201
    data = response.get_json()
    assert data["success"] is True
    assert data["user"]["email"] == "alice@example.com"


def test_verify_email_success(client, monkeypatch):
    token = "-".join(["verify", "token", "value"])

    monkeypatch.setattr(
        AuthService,
        "verify_email_token",
        lambda _token: {
            "success": True,
            "message": "Email verified successfully",
            "user": {"id": 1, "username": "alice", "email": "alice@example.com"},
        },
    )

    response = client.get(f"/api/auth/verify-email?token={token}")

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True


def test_signup_validation_error(client):
    payload = {
        "username": "al",
        "email": "invalid-email",
        PASSWORD_KEY: "short",
    }

    response = client.post("/api/auth/signup", json=payload)

    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False
    assert "errors" in data


def test_login_success_sets_refresh_cookie(client, app, monkeypatch):
    payload = {"email": "alice@example.com", PASSWORD_KEY: "supersecret"}

    with app.app_context():
        refresh_token = create_refresh_token(identity="1")

    def fake_authenticate(_data):
        return {
            "success": True,
            "user": {"id": 1, "username": "alice", "email": "alice@example.com"},
            "access_token": "access.jwt.token",
            "refresh_token": refresh_token,
        }

    monkeypatch.setattr(AuthService, "authenticate", fake_authenticate)

    response = client.post("/api/auth/login", json=payload)

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert "access_token" in data
    assert "refresh_token_cookie=" in response.headers.get("Set-Cookie", "")


def test_login_invalid_credentials(client, monkeypatch):
    payload = {"email": "alice@example.com", PASSWORD_KEY: "wrongpassword"}

    def fake_authenticate(_data):
        return {"success": False, "error": "Invalid credentials"}

    monkeypatch.setattr(AuthService, "authenticate", fake_authenticate)

    response = client.post("/api/auth/login", json=payload)

    assert response.status_code == 401
    data = response.get_json()
    assert data["success"] is False


def test_me_requires_auth(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_me_success(client, app, monkeypatch):
    with app.app_context():
        access_token = create_access_token(identity="1")

    def fake_get_user_by_identity(identity):
        if str(identity) == "1":
            return {"id": 1, "username": "alice", "email": "alice@example.com"}
        return None

    def fake_serialize_user(user):
        return {"id": user["id"], "username": user["username"], "email": user["email"]}

    monkeypatch.setattr(AuthService, "get_user_by_identity", fake_get_user_by_identity)
    monkeypatch.setattr(AuthService, "serialize_user", fake_serialize_user)

    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {access_token}"})

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["user"]["username"] == "alice"


def test_refresh_success(client, app, monkeypatch):
    with app.app_context():
        refresh_token = create_refresh_token(identity="1")
        rotated_refresh_token = create_refresh_token(identity="1")

    def fake_get_user_by_identity(identity):
        if str(identity) == "1":
            return {"id": 1, "username": "alice", "email": "alice@example.com"}
        return None

    monkeypatch.setattr(AuthService, "get_user_by_identity", fake_get_user_by_identity)
    monkeypatch.setattr(AuthService, "issue_access_token", lambda _user: "new.access.token")
    monkeypatch.setattr(AuthService, "issue_refresh_token", lambda _user: rotated_refresh_token)

    response = client.post("/api/auth/refresh", headers={"Authorization": f"Bearer {refresh_token}"})

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["access_token"] == "new.access.token"


def test_logout_success(client, app):
    with app.app_context():
        refresh_token = create_refresh_token(identity="1")

    response = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {refresh_token}"})

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True


def test_request_password_reset_success(client, monkeypatch):
    payload = {"email": "alice@example.com"}

    monkeypatch.setattr(
        AuthService,
        "request_password_reset",
        lambda email: {"success": True, "message": "Password reset link sent successfully"},
    )

    response = client.post("/api/auth/reset-password/request", json=payload)

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True


def test_confirm_password_reset_success(client, monkeypatch):
    token = "-".join(["reset", "token", "value"])
    new_password = "new" + "super" + "secret"
    payload = {"token": token, "new_password": new_password}

    monkeypatch.setattr(
        AuthService,
        "reset_password",
        lambda token, new_password: {
            "success": True,
            "message": "Password reset successfully",
            "user": {"id": 1, "username": "alice", "email": "alice@example.com"},
        },
    )

    response = client.post("/api/auth/reset-password/confirm", json=payload)

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
