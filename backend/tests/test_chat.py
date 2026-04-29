"""Tests for chat functionality."""

import pytest
from unittest.mock import MagicMock
from flask_jwt_extended import create_access_token

from app.services.chat_service import ChatService
from app.models.chat_model import ConversationModel, MessageModel
from app.models.profile_model import ProfileModel
from app.services.notifications_service import NotificationsService
from app.services.block_service import BlockService
from app.utils.app_error import ForbiddenError, BadRequestError

def test_send_message_success(app, monkeypatch):
    """Test sending a message successfully when users are matched."""
    # Mocks
    monkeypatch.setattr(MessageModel, "is_match", lambda s, r: True)
    monkeypatch.setattr(BlockService, "is_blocked", lambda u1, u2: False)
    
    mock_conv = MagicMock(spec=ConversationModel)
    mock_conv.id = 1
    monkeypatch.setattr(ConversationModel, "get_or_create", lambda s, r: mock_conv)
    
    mock_msg = MagicMock(spec=MessageModel)
    mock_msg.id = 100
    monkeypatch.setattr(MessageModel, "create", lambda c, s, ct: mock_msg)
    
    monkeypatch.setattr(ProfileModel, "get_my_profile_by_user_id", lambda u: MagicMock(username="sender"))
    monkeypatch.setattr(NotificationsService, "send_notification", lambda **kwargs: None)

    with app.app_context():
        message = ChatService.send_message(sender_id=1, receiver_id=2, content="Hello!")
        assert message == mock_msg

def test_send_message_no_match(app, monkeypatch):
    """Test sending a message fails when users are not matched."""
    monkeypatch.setattr(MessageModel, "is_match", lambda s, r: False)
    monkeypatch.setattr(BlockService, "is_blocked", lambda u1, u2: False)

    with app.app_context():
        with pytest.raises(ForbiddenError) as excinfo:
            ChatService.send_message(sender_id=1, receiver_id=2, content="Hello!")
        assert "mutual match" in str(excinfo.value)

def test_send_empty_message(app, monkeypatch):
    """Test sending an empty message fails."""
    with app.app_context():
        with pytest.raises(BadRequestError) as excinfo:
            ChatService.send_message(sender_id=1, receiver_id=2, content="   ")
        assert "content cannot be empty" in str(excinfo.value)

def test_get_conversations_api(client, app, monkeypatch):
    """Test GET /api/v1/chat/conversations."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    mock_conv = MagicMock(spec=ConversationModel)
    mock_conv.to_dict.return_value = {"id": 1, "user1_id": 1, "user2_id": 2}
    monkeypatch.setattr(ChatService, "get_user_conversations", lambda u: [mock_conv])
    monkeypatch.setattr(BlockService, "get_blocked_users_ids", lambda u: [])

    response = client.get(
        '/api/v1/chat/conversations',
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert len(data["data"]) == 1
    assert data["data"][0]["id"] == 1

def test_get_messages_api(client, app, monkeypatch):
    """Test GET /api/v1/chat/conversations/:id/messages."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    mock_msg = MagicMock(spec=MessageModel)
    mock_msg.to_dict.return_value = {"id": 100, "content": "Hi"}
    monkeypatch.setattr(ChatService, "get_conversation_messages", lambda u, c, l, o: [mock_msg])

    response = client.get(
        '/api/v1/chat/conversations/1/messages',
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert len(data["data"]) == 1
    assert data["data"][0]["content"] == "Hi"

def test_send_message_api(client, app, monkeypatch):
    """Test POST /api/v1/chat/messages."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    mock_msg = MagicMock(spec=MessageModel)
    mock_msg.to_dict.return_value = {"id": 100, "content": "Hello"}
    monkeypatch.setattr(ChatService, "send_message", lambda s, r, c: mock_msg)

    response = client.post(
        '/api/v1/chat/messages',
        headers={"Authorization": f"Bearer {access_token}"},
        json={"receiver_id": 2, "content": "Hello"}
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert data["data"]["content"] == "Hello"

def test_mark_read_api(client, app, monkeypatch):
    """Test PATCH /api/v1/chat/messages/read."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    called = {"status": False}
    def fake_mark_as_read(u, c):
        called["status"] = True

    monkeypatch.setattr(ChatService, "mark_as_read", fake_mark_as_read)

    response = client.patch(
        '/api/v1/chat/messages/read',
        headers={"Authorization": f"Bearer {access_token}"},
        json={"conversation_id": 1}
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert called["status"] is True
