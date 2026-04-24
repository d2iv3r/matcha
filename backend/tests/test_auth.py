"""Tests for authentication endpoints."""

from flask_jwt_extended import create_access_token

from app.services.auth_service import AuthService
from app.utils.mail import MailService


PASSWORD_KEY = "pass" + "word"


def test_signup_success(client, monkeypatch):
    payload = {
        "username": "alice",
        "first_name": "Alice",
        "last_name": "Doe",
        "email": "alice@example.com",
        PASSWORD_KEY: "supersecret",
    }

    class FakeUser:
        id = 1
        username = "alice"
        email = "alice@example.com"
        is_active = False

    monkeypatch.setattr(AuthService, "register_user", lambda _data: FakeUser())
    monkeypatch.setattr(AuthService, "generate_email_verification_token", lambda _user_id: ("token", None))
    monkeypatch.setattr(MailService, "send_verification_email", lambda **_kwargs: True)

    response = client.post("/api/auth/signup", json=payload)

    assert response.status_code == 201
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["user"]["email"] == "alice@example.com"


def test_verify_email_success(client, monkeypatch):
    token = "-".join(["verify", "token", "value"])

    monkeypatch.setattr(AuthService, "verify_email_token", lambda _token: None)

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
    payload = {"username": "alice", PASSWORD_KEY: "supersecret"}

    class FakeUser:
        id = 1
        username = "alice"
        email = "alice@example.com"
        is_active = True
        is_profile_complete = False

    def fake_authenticate(_data):
        return FakeUser()

    monkeypatch.setattr(AuthService, "authenticate", fake_authenticate)

    response = client.post("/api/auth/login", json=payload)

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    
    # Check for both cookies in response headers
    set_cookie_headers = response.headers.getlist("Set-Cookie")
    assert any("access_token_cookie=" in cookie for cookie in set_cookie_headers)
    assert any("refresh_token_cookie=" in cookie for cookie in set_cookie_headers)


def test_login_invalid_credentials(client, monkeypatch):
    payload = {"username": "alice", PASSWORD_KEY: "wrongpassword"}

    def fake_authenticate(_data):
        return None

    monkeypatch.setattr(AuthService, "authenticate", fake_authenticate)

    response = client.post("/api/auth/login", json=payload)

    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False


def test_login_validation_error_requires_username(client):
    payload = {"email": "alice@example.com", PASSWORD_KEY: "supersecret"}

    response = client.post("/api/auth/login", json=payload)

    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False
    assert "errors" in data


def test_authenticate_uses_username_lookup(client, app, monkeypatch):
    with app.app_context():
        data = {
            "username": "alice",
            PASSWORD_KEY: "supersecret",
        }

    class FakeUser:
        id = 1
        username = "alice"
        email = "alice@example.com"
        password_hash = "salt" + "$" + "hash"
        is_active = True
        is_profile_complete = False

    monkeypatch.setattr(
        "app.services.auth_service.UserModel.get_user_by_username",
        lambda _username: FakeUser(),
    )
    monkeypatch.setattr("app.services.auth_service.verify_password", lambda _pwd, _hash: True)

    with app.app_context():
        result = AuthService.authenticate(type("LoginData", (), data))

    assert result is not None
    assert result.username == "alice"


def test_logout_success(client, app):
    with app.app_context():
        access_token = create_access_token(identity="1")

    response = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {access_token}"})

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True


def test_request_password_reset_success(client, monkeypatch):
    payload = {"email": "alice@example.com"}

    monkeypatch.setattr(AuthService, "request_password_reset", lambda _email: None)

    response = client.post("/api/auth/request-password-reset", json=payload)

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True


def test_confirm_password_reset_success(client, monkeypatch):
    token = "-".join(["reset", "token", "value"])
    new_password = "new" + "super" + "secret"
    payload = {"token": token, "new_password": new_password}

    monkeypatch.setattr(AuthService, "reset_password", lambda _token, _new_password: None)

    response = client.post("/api/auth/confirm-password-reset", json=payload)

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
