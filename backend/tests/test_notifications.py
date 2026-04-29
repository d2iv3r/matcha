"""Tests for notification-related functionality."""

from unittest.mock import MagicMock

from flask_jwt_extended import create_access_token
from app.extensions import socketio

from app.models.notification_model import NotificationModel
from app.models.profile_model import ProfileModel
from app.services.notifications_service import NotificationsService
from app.services.profile_likes_service import ProfileLikesService
from app.services.profile_views_service import ProfileViewsService
from app.services.chat_service import ChatService
from app.services.block_service import BlockService


def test_get_notifications_requires_auth(client):
    response = client.get('/api/v1/notifications/')
    assert response.status_code == 401


def test_get_notifications_success(client, app, monkeypatch):
    with app.app_context():
        access_token = create_access_token(identity="1")

    class FakeNotification:
        def to_dict(self):
            return {
                "id": 100,
                "user_id": 1,
                "actor_id": 2,
                "type": "LIKE",
                "message": "User liked you",
                "data": None,
                "entity_id": 2,
                "is_read": False,
                "created_at": "2026-04-26T10:00:00"
            }

    monkeypatch.setattr(
        NotificationsService,
        "get_user_notifications",
        lambda user_id, limit, offset: [FakeNotification()],
    )

    response = client.get(
        '/api/v1/notifications/?limit=10&offset=0',
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["count"] == 1
    assert data["data"]["notifications"][0]["type"] == "LIKE"


def test_mark_notification_read_success(client, app, monkeypatch):
    with app.app_context():
        access_token = create_access_token(identity="1")

    class FakeNotification:
        def to_dict(self):
            return {
                "id": 100,
                "user_id": 1,
                "actor_id": 2,
                "type": "LIKE",
                "message": "User liked you",
                "data": None,
                "entity_id": 2,
                "is_read": True,
                "created_at": "2026-04-26T10:00:00"
            }

    def fake_mark_read(user_id, notification_id):
        assert user_id == 1
        assert notification_id == 100
        return FakeNotification()

    monkeypatch.setattr(NotificationsService, "mark_notification_read", fake_mark_read)

    response = client.patch(
        '/api/v1/notifications/100/read',
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["notification"]["is_read"] is True


def test_mark_notification_read_not_found(client, app, monkeypatch):
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(NotificationsService, "mark_notification_read", lambda u, n: None)

    response = client.patch(
        '/api/v1/notifications/999/read',
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 404
    data = response.get_json()
    assert data["success"] is False
    assert "not found" in data["error"].lower()


def test_mark_all_read_success(client, app, monkeypatch):
    with app.app_context():
        access_token = create_access_token(identity="1")

    mark_all_called = {"called": False}

    def fake_mark_all_read(user_id):
        print(f"DEBUG: fake_mark_all_read called with user_id={user_id} (type={type(user_id)})")
        assert user_id == 1
        mark_all_called["called"] = True

    monkeypatch.setattr("app.controllers.notifications_controller.NotificationsService.mark_all_read", staticmethod(fake_mark_all_read))

    response = client.patch(
        '/api/v1/notifications/read-all',
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert mark_all_called["called"] is True


def test_notifications_service_send_notification(app, monkeypatch):
    class FakeNotification:
        def to_dict(self):
            return {"id": 1, "type": "VIEW"}

    def fake_create(**kwargs):
        assert kwargs["user_id"] == 1
        assert kwargs["notification_type"] == "VIEW"
        return FakeNotification()

    monkeypatch.setattr(NotificationModel, "create", fake_create)

    background_task_called = {"called": False}

    def fake_start_background_task(func, *args, **kwargs):
        background_task_called["called"] = True
        assert args[0] == "notification"
        assert args[1] == {"id": 1, "type": "VIEW"}
        assert kwargs["room"] == "user_1"

    monkeypatch.setattr(BlockService, "is_blocked", lambda u1, u2: False)

    with app.app_context():
        notification = NotificationsService.send_notification(
            user_id=1,
            notification_type="VIEW",
            actor_id=2,
            entity_id=2
        )

        assert notification is not None
        assert background_task_called["called"] is True


def test_profile_view_triggers_notification(app, monkeypatch):
    monkeypatch.setattr("app.services.profile_views_service.ProfileViewsModel.record_view", lambda p, v: None)
    
    mock_profile = MagicMock(spec=ProfileModel)
    mock_profile.username = "viewer_user"
    mock_profile.avatar = "viewer_avatar.jpg"
    monkeypatch.setattr(ProfileModel, "get_my_profile_by_user_id", lambda user_id: mock_profile)

    notify_called = {"called": False}

    def fake_send_notification(**kwargs):
        notify_called["called"] = True
        assert kwargs["user_id"] == 1
        assert kwargs["notification_type"] == "VIEW"
        assert kwargs["actor_id"] == 2
        assert kwargs["message"] == "viewer_user viewed your profile"
        assert kwargs["data"]["username"] == "viewer_user"
        assert kwargs["data"]["avatar"] == "viewer_avatar.jpg"
        assert kwargs["entity_id"] == 2

    monkeypatch.setattr(NotificationsService, "send_notification", fake_send_notification)

    ProfileViewsService.record_profile_view(profile_user_id=1, viewer_user_id=2)
    assert notify_called["called"] is True


def test_profile_like_triggers_like_notification(app, monkeypatch):
    monkeypatch.setattr("app.services.profile_likes_service.ProfileLikesModel.record_like", lambda p, l: None)
    monkeypatch.setattr(ProfileLikesService, "has_liked_profile", lambda l, p: False)
    
    mock_profile = MagicMock(spec=ProfileModel)
    mock_profile.username = "liker_user"
    mock_profile.avatar = "liker_avatar.jpg"
    monkeypatch.setattr(ProfileModel, "get_my_profile_by_user_id", lambda user_id: mock_profile)

    notify_called = {"called": False}

    def fake_send_notification(**kwargs):
        notify_called["called"] = True
        assert kwargs["user_id"] == 1
        assert kwargs["notification_type"] == "LIKE"
        assert kwargs["actor_id"] == 2
        assert kwargs["message"] == "liker_user liked your profile"

    monkeypatch.setattr(NotificationsService, "send_notification", fake_send_notification)

    ProfileLikesService.record_profile_like(profile_user_id=1, liker_user_id=2)
    assert notify_called["called"] is True


def test_profile_like_triggers_match_notification(app, monkeypatch):
    monkeypatch.setattr("app.services.profile_likes_service.ProfileLikesModel.record_like", lambda p, l: None)
    monkeypatch.setattr(ProfileLikesService, "has_liked_profile", lambda l, p: True)
    
    def fake_get_profile(user_id):
        mock = MagicMock(spec=ProfileModel)
        mock.username = f"user_{user_id}"
        mock.avatar = f"avatar_{user_id}.jpg"
        return mock
    monkeypatch.setattr(ProfileModel, "get_my_profile_by_user_id", fake_get_profile)

    notify_calls = []

    def fake_send_notification(**kwargs):
        notify_calls.append(kwargs)

    monkeypatch.setattr(NotificationsService, "send_notification", fake_send_notification)

    ProfileLikesService.record_profile_like(profile_user_id=1, liker_user_id=2)
    assert len(notify_calls) == 2
    assert notify_calls[0]["notification_type"] == "MATCH"
    assert notify_calls[0]["message"] == "You matched with user_2!"
    assert notify_calls[1]["notification_type"] == "MATCH"
    assert notify_calls[1]["message"] == "You matched with user_1!"


def test_profile_unlike_triggers_notification(app, monkeypatch):
    monkeypatch.setattr("app.services.profile_likes_service.ProfileLikesModel.remove_like", lambda p, l: None)
    
    mock_profile = MagicMock(spec=ProfileModel)
    mock_profile.username = "unliker_user"
    mock_profile.avatar = "unliker_avatar.jpg"
    monkeypatch.setattr(ProfileModel, "get_my_profile_by_user_id", lambda user_id: mock_profile)

    notify_called = {"called": False}

    def fake_send_notification(**kwargs):
        notify_called["called"] = True
        assert kwargs["user_id"] == 1
        assert kwargs["notification_type"] == "UNLIKE"
        assert kwargs["message"] == "unliker_user unliked your profile"

    monkeypatch.setattr(NotificationsService, "send_notification", fake_send_notification)

    ProfileLikesService.remove_profile_like(profile_user_id=1, liker_user_id=2)
    assert notify_called["called"] is True


def test_chat_message_triggers_notification(app, monkeypatch):
    mock_profile = MagicMock(spec=ProfileModel)
    mock_profile.username = "sender_user"
    mock_profile.avatar = "sender_avatar.jpg"
    monkeypatch.setattr(ProfileModel, "get_my_profile_by_user_id", lambda user_id: mock_profile)

    notify_called = {"called": False}

    def fake_send_notification(**kwargs):
        notify_called["called"] = True
        assert kwargs["user_id"] == 1
        assert kwargs["notification_type"] == "MESSAGE"
        assert kwargs["actor_id"] == 2
        assert kwargs["message"] == "New message from sender_user"
        assert kwargs["data"]["sender_username"] == "sender_user"
        assert kwargs["data"]["content"] == "Hello"

    monkeypatch.setattr(NotificationsService, "send_notification", fake_send_notification)
    monkeypatch.setattr("app.services.chat_service.MessageModel.is_match", lambda s, r: True)
    monkeypatch.setattr("app.services.chat_service.ConversationModel.get_or_create", lambda s, r: MagicMock(id=5))
    monkeypatch.setattr("app.services.chat_service.MessageModel.create", lambda c, s, ct: MagicMock(id=10, to_dict=lambda: {}))
    monkeypatch.setattr(BlockService, "is_blocked", lambda u1, u2: False)

    with app.app_context():
        ChatService.send_message(sender_id=2, receiver_id=1, content="Hello")
    assert notify_called["called"] is True
