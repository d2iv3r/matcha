"""Tests for user-related functionality."""

from io import BytesIO

import pytest
from flask_jwt_extended import create_access_token
from werkzeug.datastructures import MultiDict

from app.services.profile_service import ProfileService
from app.utils.app_error import ForbiddenError


def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'


def test_api_root(client):
    """Test the API root endpoint."""
    response = client.get('/api/')
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data
    assert 'version' in data


def test_update_profile_requires_auth(client):
    payload = {
        "gender": "male",
        "date_of_birth": "1999-01-01",
        "location": "Paris",
        "bio": "",
        "interests": ["music", "travel"],
    }

    response = client.put('/api/v1/account/complete-profile', json=payload)

    assert response.status_code == 401


def test_update_profile_success_verified_user(client, app, monkeypatch):
    payload = MultiDict(
        [
            ("gender", "female"),
            ("date_of_birth", "1997-04-18"),
            ("location", "Berlin"),
            ("bio", ""),
            ("interests", '["reading", "hiking"]'),
            ("avatar", (BytesIO(b"fake avatar bytes"), "avatar.png")),
        ]
    )

    with app.app_context():
        access_token = create_access_token(identity="1")

    def fake_update_profile(user_id, **kwargs):
        assert user_id == 1
        return {
            "user_id": user_id,
            "gender": kwargs["gender"],
            "date_of_birth": kwargs["date_of_birth"].isoformat(),
            "location": kwargs["location"],
            "bio": kwargs["bio"],
            "interests": kwargs["interests"],
            "avatar": "/static/uploads/profile_pictures/1/avatar.png",
            "pictures": [],
        }

    monkeypatch.setattr(ProfileService, "update_profile", fake_update_profile)

    response = client.put(
        '/api/v1/account/complete-profile',
        data=payload,
        headers={"Authorization": f"Bearer {access_token}"},
        content_type="multipart/form-data",
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["profile"]["user_id"] == 1
    assert data["profile"]["gender"] == "female"


def test_update_profile_accepts_avatar_pic_and_profile_pictures(client, app, monkeypatch):
    with app.app_context():
        access_token = create_access_token(identity="1")

    payload = MultiDict(
        [
            ("gender", "female"),
            ("date_of_birth", "1997-04-18"),
            ("location", "Berlin"),
            ("bio", "Traveler"),
            ("interests", '["reading", "hiking"]'),
            ("avatar", (BytesIO(b"fake image bytes"), "avatar.png")),
            ("pictures", (BytesIO(b"fake image bytes 1"), "pic1.png")),
            ("pictures", (BytesIO(b"fake image bytes 2"), "pic2.png")),
        ]
    )

    def fake_update_profile(user_id, **kwargs):
        assert user_id == 1
        assert kwargs["avatar"].filename == "avatar.png"
        assert len(kwargs["pictures"]) == 2
        return {
            "user_id": user_id,
            "gender": kwargs["gender"],
            "date_of_birth": kwargs["date_of_birth"].isoformat(),
            "location": kwargs["location"],
            "bio": kwargs["bio"],
            "interests": kwargs["interests"],
            "avatar": "/static/uploads/profile_pictures/1/avatar.png",
            "pictures": [
                "/static/uploads/profile_pictures/1/avatar.png",
                "/static/uploads/profile_pictures/1/pic1.png",
                "/static/uploads/profile_pictures/1/pic2.png",
            ],
        }

    monkeypatch.setattr(ProfileService, "update_profile", fake_update_profile)

    response = client.put(
        "/api/v1/account/complete-profile",
        data=payload,
        headers={"Authorization": f"Bearer {access_token}"},
        content_type="multipart/form-data",
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["profile"]["avatar"] == "/static/uploads/profile_pictures/1/avatar.png"


def test_update_profile_forbidden_for_unverified_user(client, app, monkeypatch):
    payload = MultiDict(
        [
            ("gender", "male"),
            ("date_of_birth", "1994-06-10"),
            ("location", "Rome"),
            ("bio", ""),
            ("interests", '["cooking"]'),
            ("avatar", (BytesIO(b"fake avatar bytes"), "avatar.png")),
        ]
    )

    with app.app_context():
        access_token = create_access_token(identity="2")

    def fake_update_profile(_user_id, **_kwargs):
        raise ForbiddenError("Only verified users can update profile")

    monkeypatch.setattr(ProfileService, "update_profile", fake_update_profile)

    response = client.put(
        '/api/v1/account/complete-profile',
        data=payload,
        headers={"Authorization": f"Bearer {access_token}"},
        content_type="multipart/form-data",
    )

    assert response.status_code == 403
    data = response.get_json()
    assert data["success"] is False
    assert data["error"] == "Only verified users can update profile"


def test_update_profile_validation_error(client, app):
    invalid_payload = MultiDict(
        [
            ("gender", "other"),  # Invalid: not "male" or "female"
            ("date_of_birth", "1994-06-10"),
            ("location", "Rome"),
            ("bio", ""),
            ("interests", '["cooking"]'),
            ("avatar", (BytesIO(b"fake avatar bytes"), "avatar.png")),
        ]
    )

    with app.app_context():
        access_token = create_access_token(identity="1")

    response = client.put(
        '/api/v1/account/complete-profile',
        data=invalid_payload,
        headers={"Authorization": f"Bearer {access_token}"},
        content_type="multipart/form-data",
    )

    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False
    assert "errors" in data
