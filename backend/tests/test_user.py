"""Tests for user-related functionality."""

import pytest
from flask_jwt_extended import create_access_token

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
        "age": 25,
        "date_of_birth": "1999-01-01",
        "location": "Paris",
        "interests": ["music", "travel"],
        "avatar_url": "https://example.com/avatar.jpg",
    }

    response = client.put('/api/v1/account/complete-profile', json=payload)

    assert response.status_code == 401


def test_update_profile_success_verified_user(client, app, monkeypatch):
    payload = {
        "gender": "female",
        "age": 27,
        "date_of_birth": "1997-04-18",
        "location": "Berlin",
        "interests": ["reading", "hiking"],
        "avatar_url": "https://example.com/avatar.jpg",
    }

    with app.app_context():
        access_token = create_access_token(identity="1")

    def fake_update_profile(user_id, **kwargs):
        assert user_id == 1
        return {
            "user_id": user_id,
            "gender": kwargs["gender"],
            "age": kwargs["age"],
            "date_of_birth": kwargs["date_of_birth"].isoformat(),
            "location": kwargs["location"],
            "interests": kwargs["interests"],
            "avatar_url": kwargs["avatar_url"],
        }

    monkeypatch.setattr(ProfileService, "update_profile", fake_update_profile)

    response = client.put(
        '/api/v1/account/complete-profile',
        json=payload,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["profile"]["user_id"] == 1
    assert data["profile"]["gender"] == "female"


def test_update_profile_forbidden_for_unverified_user(client, app, monkeypatch):
    payload = {
        "gender": "male",
        "age": 30,
        "date_of_birth": "1994-06-10",
        "location": "Rome",
        "interests": ["cooking"],
        "avatar_url": "https://example.com/avatar.jpg",
    }

    with app.app_context():
        access_token = create_access_token(identity="2")

    def fake_update_profile(_user_id, **_kwargs):
        raise ForbiddenError("Only verified users can update profile")

    monkeypatch.setattr(ProfileService, "update_profile", fake_update_profile)

    response = client.put(
        '/api/v1/account/complete-profile',
        json=payload,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 403
    data = response.get_json()
    assert data["success"] is False
    assert data["error"] == "Only verified users can update profile"


def test_update_profile_validation_error(client, app):
    invalid_payload = {
        "gender": "other",
        "age": 30,
        "date_of_birth": "1994-06-10",
        "location": "Rome",
        "interests": ["cooking"],
        "avatar_url": "https://example.com/avatar.jpg",
    }

    with app.app_context():
        access_token = create_access_token(identity="1")

    response = client.put(
        '/api/v1/account/complete-profile',
        json=invalid_payload,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False
    assert "errors" in data
