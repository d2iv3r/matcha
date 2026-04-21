"""Tests for user-related functionality."""

from io import BytesIO

import pytest
from flask_jwt_extended import create_access_token
from werkzeug.datastructures import MultiDict

from app.services.profile_service import ProfileService
from app.services.profile_views_service import ProfileViewsService
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

    response = client.put('/api/v1/accounts/complete-profile', json=payload)

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
        '/api/v1/accounts/complete-profile',
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
        "/api/v1/accounts/complete-profile",
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
        '/api/v1/accounts/complete-profile',
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
        '/api/v1/accounts/complete-profile',
        data=invalid_payload,
        headers={"Authorization": f"Bearer {access_token}"},
        content_type="multipart/form-data",
    )

    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False
    assert "errors" in data


def test_get_profiles_list_requires_auth(client):
    response = client.get('/api/v1/accounts/profiles')
    assert response.status_code == 401


def test_get_profiles_list_success(client, app, monkeypatch):
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        ProfileService,
        "get_profiles_list",
        lambda limit, offset: [
            {
                "user_id": 2,
                "username": "alice",
                "first_name": "Alice",
                "last_name": "Doe",
                "gender": "female",
                "age": 28,
                "date_of_birth": "1997-04-18",
                "location": "Berlin",
                "interests": ["reading", "hiking"],
                "avatar": "https://example.com/a.jpg",
                "pictures": [],
            }
        ],
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.is_mutual_like",
        lambda viewer_id, profile_user_id: False,
    )

    response = client.get(
        '/api/v1/accounts/profiles?limit=10&offset=0',
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["count"] == 1
    assert data["profiles"][0]["username"] == "alice"
    assert data["profiles"][0]["is_match"] is False


def test_get_profiles_list_includes_is_match(client, app, monkeypatch):
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        ProfileService,
        "get_profiles_list",
        lambda limit, offset: [
            {
                "user_id": 2,
                "username": "alice",
                "age": 28,
                "location": "Berlin",
                "rating": "Popular",
            },
            {
                "user_id": 1,
                "username": "me",
                "age": 29,
                "location": "Paris",
                "rating": "Elite",
            },
        ],
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.is_mutual_like",
        lambda viewer_id, profile_user_id: profile_user_id == 2,
    )

    response = client.get(
        "/api/v1/accounts/profiles?limit=10&offset=0",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["count"] == 2
    assert data["profiles"][0]["username"] == "alice"
    assert data["profiles"][0]["is_match"] is True
    assert data["profiles"][1]["username"] == "me"
    assert data["profiles"][1]["is_match"] is False


def test_openapi_includes_profiles_endpoint(client):
    response = client.get('/api/openapi.json')

    assert response.status_code == 200
    data = response.get_json()
    assert "/api/v1/accounts/profiles" in data["paths"]
    assert "get" in data["paths"]["/api/v1/accounts/profiles"]


def test_get_profiles_list_parses_non_json_text(monkeypatch):
    monkeypatch.setattr(
        "app.services.profile_service.ProfileModel.get_profiles_list",
        lambda limit, offset: [
            {
                "username": "zsanchez",
                "first_name": "Z",
                "last_name": "S",
                "gender": "male",
                "age": 30,
                "date_of_birth": None,
                "location": "Paris",
                "interests": "['music', 'travel']",
                "avatar": "https://example.com/avatar.jpg",
                "pictures": "{pic1.jpg,pic2.jpg}",
            }
        ],
    )

    payload = ProfileService.get_profiles_list(limit=20, offset=0)

    assert len(payload) == 1
    assert payload[0]["interests"] == ["music", "travel"]
    assert payload[0]["pictures"] == ["pic1.jpg", "pic2.jpg"]


def test_record_profile_view_success(app, monkeypatch):
    """Test recording a profile view."""
    with app.app_context():
        monkeypatch.setattr(
            "app.models.profile_views_model.ProfileViewsModel.record_view",
            lambda profile_user_id, viewer_user_id: True,
        )

        ProfileViewsService.record_profile_view(profile_user_id=2, viewer_user_id=1)


def test_get_profile_view_count(app, monkeypatch):
    """Test getting profile view count."""
    with app.app_context():
        monkeypatch.setattr(
            "app.models.profile_views_model.ProfileViewsModel.get_views_count",
            lambda user_id: 5,
        )

        count = ProfileViewsService.get_profile_view_count(user_id=2)
        assert count == 5


def test_get_profile_by_user_id_records_view(client, app, monkeypatch):
    """Test that getting another user's profile records a view."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    view_recorded = {"called": False}

    def fake_record_view(profile_user_id, viewer_user_id):
        view_recorded["called"] = True
        view_recorded["profile_user_id"] = profile_user_id
        view_recorded["viewer_user_id"] = viewer_user_id

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileViewsService.record_profile_view",
        fake_record_view,
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileService.get_profile_by_user_id",
        lambda user_id: {"user": {"id": user_id}, "profile": None},
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.is_mutual_like",
        lambda viewer_id, profile_user_id: False,
    )

    monkeypatch.setattr(
        ProfileService,
        "get_user_by_username",
        lambda username: {"id": 2, "username": username},
        raising=False,
    )

    response = client.get(
        "/api/v1/accounts/profile/alice",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    assert view_recorded["called"] is True
    assert view_recorded["profile_user_id"] == 2
    assert view_recorded["viewer_user_id"] == 1


def test_get_profile_by_username_returns_is_match_flag(client, app, monkeypatch):
    """Test that profile by username returns mutual-like match status."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        ProfileService,
        "get_user_by_username",
        lambda username: {"id": 2, "username": username},
        raising=False,
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileService.get_profile_by_user_id",
        lambda user_id: {
            "user": {
                "id": user_id,
                "username": "alice",
                "first_name": "Alice",
                "last_name": "Doe",
            },
            "profile": {
                "age": 25,
                "location": "Paris",
                "rating": "Popular",
                "bio": "hello",
                "interests": ["music"],
                "avatar": "https://example.com/a.jpg",
                "pictures": ["https://example.com/p1.jpg"],
            },
        },
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.is_mutual_like",
        lambda viewer_id, profile_user_id: True,
    )

    response = client.get(
        "/api/v1/accounts/profile/alice",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["is_match"] is True


def test_get_own_profile_includes_view_statistics(client, app, monkeypatch):
    """Test that own profile includes view statistics."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileService.get_profile_by_user_id",
        lambda user_id: {"user": {"id": user_id}, "profile": None},
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileViewsService.get_profile_view_count",
        lambda user_id: 10,
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileViewsService.get_profile_viewers",
        lambda user_id, limit: [
            {
                "viewer_id": 2,
                "viewer_username": "alice",
                "viewer_first_name": "Alice",
                "viewer_last_name": "Doe",
                "viewer_avatar": "https://example.com/a.jpg",
                "viewed_at": "2026-04-19T10:00:00",
            }
        ],
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.get_profile_like_count",
        lambda user_id: 5,
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.get_profile_likers",
        lambda user_id, limit: [
            {
                "liker_username": "bob",
                "age": 25,
                "location": "Paris",
                "avatar": "https://example.com/b.jpg",
            }
        ],
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.get_profile_like_count",
        lambda user_id: 5,
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.get_profile_likers",
        lambda user_id, limit: [
            {
                "liker_username": "bob",
                "age": 25,
                "location": "Paris",
                "avatar": "https://example.com/b.jpg",
            }
        ],
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.get_profile_like_count",
        lambda user_id: 5,
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.get_profile_likers",
        lambda user_id, limit: [
            {
                "liker_username": "bob",
                "age": 25,
                "location": "Paris",
                "avatar": "https://example.com/b.jpg",
            }
        ],
    )

    response = client.get(
        "/api/v1/accounts/profile",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert "profile_views" in data
    assert data["profile_views"]["total_views"] == 10
    assert len(data["profile_views"]["recent_viewers"]) == 1

    assert "profile_likes" in data
    assert data["profile_likes"]["total_likes"] == 5
    assert len(data["profile_likes"]["recent_likers"]) == 1

    assert "profile_likes" in data
    assert data["profile_likes"]["total_likes"] == 5
    assert len(data["profile_likes"]["recent_likers"]) == 1

    assert "profile_likes" in data
    assert data["profile_likes"]["total_likes"] == 5
    assert len(data["profile_likes"]["recent_likers"]) == 1


def test_record_profile_viewer_success(client, app, monkeypatch):
    """Test recording a profile view via ProfileViewsController."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        "app.controllers.profile_views_controller.ProfileViewsService.record_profile_view",
        lambda profile_user_id, viewer_user_id: None,
    )

    monkeypatch.setattr(
        ProfileService,
        "get_user_by_username",
        lambda username: {"id": 2, "username": username},
        raising=False,
    )

    response = client.post(
        "/api/v1/profile/alice/view",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert "Profile view recorded" in data["message"]


def test_record_profile_viewer_self_view(client, app, monkeypatch):
    """Test that self-views are rejected."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        ProfileService,
        "get_user_by_username",
        lambda username: {"id": 1, "username": username},
        raising=False,
    )

    response = client.post(
        "/api/v1/profile/me/view",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 400
    data = response.get_json()
    assert data["success"] is False
    assert "self-view" in data["error"].lower()


def test_get_profile_viewers_success(client, app, monkeypatch):
    """Test retrieving profile viewers."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        "app.controllers.profile_views_controller.ProfileViewsService.get_profile_viewers",
        lambda user_id, limit: [
            {
                "viewer_id": 2,
                "viewer_username": "alice",
                "viewer_avatar": "https://example.com/a.jpg",
                "viewed_at": "2026-04-19T10:00:00",
            },
            {
                "viewer_id": 3,
                "viewer_username": "bob",
                "viewer_avatar": "https://example.com/b.jpg",
                "viewed_at": "2026-04-19T09:00:00",
            },
        ],
    )

    response = client.get(
        "/api/v1/profile/viewers?profile_user_id=1",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["count"] == 2
    assert len(data["viewers"]) == 2


def test_get_profile_viewers_ignores_profile_user_id_query_param(client, app, monkeypatch):
    """Test that viewers endpoint uses JWT identity and ignores query profile_user_id."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        "app.controllers.profile_views_controller.ProfileViewsService.get_profile_viewers",
        lambda user_id, limit: [],
    )

    response = client.get(
        "/api/v1/profile/viewers?profile_user_id=2",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["count"] == 0


def test_get_view_count_success(client, app, monkeypatch):
    """Test retrieving view count for own profile."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        "app.controllers.profile_views_controller.ProfileViewsService.get_profile_view_count",
        lambda user_id: 42,
    )

    response = client.get(
        "/api/v1/profile/views-count?profile_user_id=1",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["view_count"] == 42


def test_get_view_count_ignores_profile_user_id_query_param(client, app, monkeypatch):
    """Test that view count endpoint uses JWT identity and ignores query profile_user_id."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserService.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        "app.controllers.profile_views_controller.ProfileViewsService.get_profile_view_count",
        lambda user_id: 42,
    )

    response = client.get(
        "/api/v1/profile/views-count?profile_user_id=2",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["view_count"] == 42
