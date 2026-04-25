"""Tests for user-related functionality."""

from io import BytesIO

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
        "city": "Paris",
        "country": "France",
        "ip_address": "192.168.1.10",
        "latitude": 48.8566,
        "longitude": 2.3522,
        "bio": "",
        "interests": ["music", "travel"],
    }

    response = client.post('/api/v1/accounts/complete-profile', json=payload)

    assert response.status_code == 401


def test_update_profile_success_verified_user(client, app, monkeypatch):
    payload = MultiDict(
        [
            ("gender", "female"),
            ("date_of_birth", "1997-04-18"),
            ("city", "Berlin"),
            ("country", "Germany"),
            ("ip_address", "192.168.1.10"),
            ("latitude", "52.52"),
            ("longitude", "13.405"),
            ("bio", ""),
            ("interests", '["reading", "hiking"]'),
            ("avatar", (BytesIO(b"fake avatar bytes"), "avatar.png")),
        ]
    )

    with app.app_context():
        access_token = create_access_token(identity="1")

    def fake_update_profile(profile_data):
        assert profile_data["user_id"] == 1
        class FakeProfile:
            def to_dict(self_inner):
                return {
                    "user_id": profile_data["user_id"],
                    "gender": profile_data["gender"],
                    "date_of_birth": profile_data["date_of_birth"].isoformat(),
                    "city": profile_data["city"],
                    "country": profile_data["country"],
                    "ip_address": profile_data["ip_address"],
                    "latitude": profile_data["latitude"],
                    "longitude": profile_data["longitude"],
                    "bio": profile_data["bio"],
                    "interests": profile_data["interests"],
                    "avatar": "/static/uploads/profile_pictures/1/avatar.png",
                    "pictures": [],
                }

        return FakeProfile()

    monkeypatch.setattr(ProfileService, "complete_profile", fake_update_profile)
    monkeypatch.setattr(
        "app.schemas.profile_schemas.save_image",
        lambda *_args, **_kwargs: "/static/uploads/profile_pictures/1/avatar.png",
    )

    response = client.post(
        '/api/v1/accounts/complete-profile',
        data=payload,
        headers={"Authorization": f"Bearer {access_token}"},
        content_type="multipart/form-data",
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["profile"]["user_id"] == 1
    assert data["data"]["profile"]["gender"] == "female"


def test_update_profile_accepts_avatar_pic_and_profile_pictures(client, app, monkeypatch):
    with app.app_context():
        access_token = create_access_token(identity="1")

    payload = MultiDict(
        [
            ("gender", "female"),
            ("date_of_birth", "1997-04-18"),
            ("city", "Berlin"),
            ("country", "Germany"),
            ("ip_address", "192.168.1.10"),
            ("latitude", "52.52"),
            ("longitude", "13.405"),
            ("bio", "Traveler"),
            ("interests", '["reading", "hiking"]'),
            ("avatar", (BytesIO(b"fake image bytes"), "avatar.png")),
            ("pictures", (BytesIO(b"fake image bytes 1"), "pic1.png")),
            ("pictures", (BytesIO(b"fake image bytes 2"), "pic2.png")),
        ]
    )

    def fake_update_profile(profile_data):
        assert profile_data["user_id"] == 1
        assert profile_data["avatar"]
        assert len(profile_data["pictures"]) == 2
        class FakeProfile:
            def to_dict(self_inner):
                return {
                    "user_id": profile_data["user_id"],
                    "gender": profile_data["gender"],
                    "date_of_birth": profile_data["date_of_birth"].isoformat(),
                    "city": profile_data["city"],
                    "country": profile_data["country"],
                    "ip_address": profile_data["ip_address"],
                    "latitude": profile_data["latitude"],
                    "longitude": profile_data["longitude"],
                    "bio": profile_data["bio"],
                    "interests": profile_data["interests"],
                    "avatar": "/static/uploads/profile_pictures/1/avatar.png",
                    "pictures": [
                        "/static/uploads/profile_pictures/1/avatar.png",
                        "/static/uploads/profile_pictures/1/pic1.png",
                        "/static/uploads/profile_pictures/1/pic2.png",
                    ],
                }

        return FakeProfile()

    monkeypatch.setattr(ProfileService, "complete_profile", fake_update_profile)
    monkeypatch.setattr(
        "app.schemas.profile_schemas.save_image",
        lambda *_args, **_kwargs: "/static/uploads/profile_pictures/1/avatar.png",
    )

    response = client.post(
        "/api/v1/accounts/complete-profile",
        data=payload,
        headers={"Authorization": f"Bearer {access_token}"},
        content_type="multipart/form-data",
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["profile"]["avatar"] == "/static/uploads/profile_pictures/1/avatar.png"


def test_update_profile_forbidden_for_unverified_user(client, app, monkeypatch):
    payload = MultiDict(
        [
            ("gender", "male"),
            ("date_of_birth", "1994-06-10"),
            ("city", "Rome"),
            ("country", "Italy"),
            ("ip_address", "192.168.1.10"),
            ("latitude", "41.9028"),
            ("longitude", "12.4964"),
            ("bio", ""),
            ("interests", '["cooking"]'),
            ("avatar", (BytesIO(b"fake avatar bytes"), "avatar.png")),
        ]
    )

    with app.app_context():
        access_token = create_access_token(identity="2")

    def fake_update_profile(_profile_data):
        raise ForbiddenError("Only verified users can update profile")

    monkeypatch.setattr(ProfileService, "complete_profile", fake_update_profile)
    monkeypatch.setattr(
        "app.schemas.profile_schemas.save_image",
        lambda *_args, **_kwargs: "/static/uploads/profile_pictures/1/avatar.png",
    )

    response = client.post(
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
            ("city", "Rome"),
            ("country", "Italy"),
            ("ip_address", "192.168.1.10"),
            ("latitude", "41.9028"),
            ("longitude", "12.4964"),
            ("bio", ""),
            ("interests", '["cooking"]'),
            ("avatar", (BytesIO(b"fake avatar bytes"), "avatar.png")),
        ]
    )

    with app.app_context():
        access_token = create_access_token(identity="1")

    response = client.post(
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
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    class FakeProfile:
        def __init__(self, user_id, username):
            self.user_id = user_id
            self.username = username

        def to_dict(self):
            return {
                "user_id": self.user_id,
                "username": self.username,
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

    monkeypatch.setattr(
        ProfileService,
        "get_profiles_list",
        lambda user_id, limit, offset: [FakeProfile(2, "alice")],
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.is_mutual_like",
        lambda viewer_id, profile_user_id: False,
    )
    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.has_liked_profile",
        lambda profile_user_id, viewer_id: False,
    )

    response = client.get(
        '/api/v1/accounts/profiles?limit=10&offset=0',
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["data"]["count"] == 1
    assert data["data"]["profiles"][0]["username"] == "alice"
    assert data["data"]["profiles"][0]["is_match"] is False


def test_get_profiles_list_includes_is_match(client, app, monkeypatch):
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    class FakeProfile:
        def __init__(self, user_id, username, rating):
            self.user_id = user_id
            self.username = username
            self.rating = rating

        def to_dict(self):
            return {
                "user_id": self.user_id,
                "username": self.username,
                "age": 28,
                "location": "Berlin",
                "rating": self.rating,
            }

    monkeypatch.setattr(
        ProfileService,
        "get_profiles_list",
        lambda user_id, limit, offset: [
            FakeProfile(2, "alice", "Popular"),
            FakeProfile(1, "me", "Elite"),
        ],
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.is_mutual_like",
        lambda viewer_id, profile_user_id: profile_user_id == 2,
    )
    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.has_liked_profile",
        lambda profile_user_id, viewer_id: False,
    )

    response = client.get(
        "/api/v1/accounts/profiles?limit=10&offset=0",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["data"]["count"] == 2
    assert data["data"]["profiles"][0]["username"] == "alice"
    assert data["data"]["profiles"][0]["is_match"] is True
    assert data["data"]["profiles"][1]["username"] == "me"
    assert data["data"]["profiles"][1]["is_match"] is False


def test_openapi_includes_profiles_endpoint(client):
    response = client.get('/api/openapi.json')

    assert response.status_code == 200
    data = response.get_json()
    assert "/api/v1/accounts/profiles" in data["paths"]
    assert "get" in data["paths"]["/api/v1/accounts/profiles"]


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
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileViewsService.record_profile_view",
        fake_record_view,
    )

    class FakeProfile:
        def __init__(self, user_id, username):
            self.user_id = user_id
            self.username = username

        def to_dict(self):
            return {"user_id": self.user_id, "username": self.username}

    monkeypatch.setattr(
        ProfileService,
        "get_profile_by_username",
        lambda username: FakeProfile(2, username),
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.is_mutual_like",
        lambda viewer_id, profile_user_id: False,
    )
    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.has_liked_profile",
        lambda profile_user_id, viewer_id: False,
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
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    class FakeProfile:
        def __init__(self, user_id, username):
            self.user_id = user_id
            self.username = username

        def to_dict(self):
            return {
                "user_id": self.user_id,
                "username": "alice",
                "first_name": "Alice",
                "last_name": "Doe",
                "age": 25,
                "location": "Paris",
                "rating": "Popular",
                "bio": "hello",
                "interests": ["music"],
                "avatar": "https://example.com/a.jpg",
                "pictures": ["https://example.com/p1.jpg"],
            }

    monkeypatch.setattr(
        ProfileService,
        "get_profile_by_username",
        lambda username: FakeProfile(2, username),
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.is_mutual_like",
        lambda viewer_id, profile_user_id: True,
    )
    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.has_liked_profile",
        lambda profile_user_id, viewer_id: False,
    )
    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.has_liked_profile",
        lambda profile_user_id, viewer_id: False,
    )

    response = client.get(
        "/api/v1/accounts/profile/alice",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["data"]["is_match"] is True


def test_get_own_profile_returns_profile(client, app, monkeypatch):
    """Test that own profile returns profile data."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    class FakeProfile:
        def to_dict(self):
            return {"user_id": 1, "username": "me"}

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileService.get_my_profile_by_user_id",
        lambda user_id: FakeProfile(),
    )
    monkeypatch.setattr(
        "app.schemas.accounts_requests_schemas.save_image",
        lambda *_args, **_kwargs: "new_avatar.png",
    )

    response = client.get(
        "/api/v1/accounts/profile",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert "profile" in data["data"]
    assert data["data"]["profile"]["user_id"] == 1


def test_get_profile_viewers_success(client, app, monkeypatch):
    """Test retrieving profile viewers."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
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
    monkeypatch.setattr(
        "app.controllers.profile_views_controller.ProfileLikesService.is_mutual_like",
        lambda profile_user_id, viewer_id: False,
    )
    monkeypatch.setattr(
        "app.controllers.profile_views_controller.ProfileLikesService.has_liked_profile",
        lambda viewer_id, profile_user_id: False,
    )

    response = client.get(
        "/api/v1/profile/viewers?profile_user_id=1",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["count"] == 2
    assert len(data["data"]["viewers"]) == 2


def test_get_profile_viewers_ignores_profile_user_id_query_param(client, app, monkeypatch):
    """Test that viewers endpoint uses JWT identity and ignores query profile_user_id."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        "app.controllers.profile_views_controller.ProfileViewsService.get_profile_viewers",
        lambda user_id, limit: [],
    )
    monkeypatch.setattr(
        "app.controllers.profile_views_controller.ProfileLikesService.is_mutual_like",
        lambda profile_user_id, viewer_id: False,
    )
    monkeypatch.setattr(
        "app.controllers.profile_views_controller.ProfileLikesService.has_liked_profile",
        lambda viewer_id, profile_user_id: False,
    )

    response = client.get(
        "/api/v1/profile/viewers?profile_user_id=2",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["count"] == 0


def test_update_my_profile_success(client, app, monkeypatch):
    """Test updating user profile fields successfully."""
    payload = {
        "first_name": "New",
        "last_name": "Name",
        "gender": "male",
        "bio": "New bio",
        "interests": ["coding", "music"]
    }

    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    def fake_update_account_fields(user_id, **kwargs):
        assert user_id == 1
        assert kwargs["first_name"] == "New"
        assert kwargs["last_name"] == "Name"

    monkeypatch.setattr(
        "app.controllers.profile_controller.UserService.update_account_fields",
        fake_update_account_fields,
    )

    def fake_update_profile_fields(user_id, data):
        assert user_id == 1
        assert data["gender"] == "male"
        assert data["bio"] == "New bio"

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileService.update_profile_fields",
        fake_update_profile_fields,
    )

    response = client.patch(
        '/api/v1/accounts/profile',
        json=payload,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"] == {}


def test_update_profile_media_success(client, app, monkeypatch):
    """Test updating profile media successfully."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    payload = MultiDict(
        [
            ("avatar", (BytesIO(b"fake image bytes"), "avatar.png")),
            ("pictures", (BytesIO(b"fake image bytes 1"), "pic1.png")),
        ]
    )

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    def fake_update_profile_fields(user_id, data):
        assert user_id == 1
        assert "avatar" in data
        assert "pictures" in data

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileService.update_profile_fields",
        fake_update_profile_fields,
    )

    response = client.patch(
        '/api/v1/accounts/profile/media',
        data=payload,
        headers={"Authorization": f"Bearer {access_token}"},
        content_type="multipart/form-data",
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"] == {}


def test_search_profiles_success(client, app, monkeypatch):
    """Test advanced search for profiles."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    def fake_search_profiles(user_id, filters):
        assert user_id == 1
        assert filters["first_name"] == "Alice"
        assert filters["min_age"] == 20
        assert filters["max_age"] == 30
        assert filters["city"] == "Paris"
        return [
            type("FakeProfile", (), {
                "user_id": 2,
                "first_name": "Alice",
                "to_dict": lambda self: {"user_id": 2, "first_name": "Alice"}
            })()
        ]

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileService.search_profiles",
        fake_search_profiles,
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.is_mutual_like",
        lambda viewer_id, profile_user_id: False,
    )

    monkeypatch.setattr(
        "app.controllers.profile_controller.ProfileLikesService.has_liked_profile",
        lambda profile_user_id, viewer_id: False,
    )

    response = client.get(
        "/api/v1/accounts/profiles/search?first_name=Alice&min_age=20&max_age=30&city=Paris",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    if response.status_code != 200:
        print(f"FAILED WITH 500: {response.data}")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["count"] == 1
    assert data["data"]["profiles"][0]["first_name"] == "Alice"
