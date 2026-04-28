"""Tests for blocking functionality."""

import pytest
from flask_jwt_extended import create_access_token
from app.services.block_service import BlockService
from app.services.profile_service import ProfileService
from app.services.chat_service import ChatService
from app.utils.app_error import ForbiddenError

def test_block_user_success(client, app, monkeypatch):
    """Test blocking a user successfully."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    def fake_block_user(blocker_id, username):
        assert blocker_id == 1
        assert username == "alice"
        return {"id": 1, "blocker_id": 1, "blocked_id": 2}

    monkeypatch.setattr(BlockService, "block_user_by_username", fake_block_user)

    response = client.post(
        "/api/v1/profile/alice/block",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "User blocked successfully"

def test_block_self_fails(client, app, monkeypatch):
    """Test that a user cannot block themselves."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    def fake_block_user(blocker_id, username):
        raise ValueError("You cannot block yourself")

    monkeypatch.setattr(BlockService, "block_user_by_username", fake_block_user)

    response = client.post(
        "/api/v1/profile/me/block",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "You cannot block yourself"

def test_unblock_user_success(client, app, monkeypatch):
    """Test unblocking a user successfully."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    def fake_unblock_user(blocker_id, username):
        assert blocker_id == 1
        assert username == "alice"
        return 1

    monkeypatch.setattr(BlockService, "unblock_user_by_username", fake_unblock_user)

    response = client.post(
        "/api/v1/profile/alice/unblock",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "User unblocked successfully"

def test_get_blocked_users_success(client, app, monkeypatch):
    """Test retrieving list of blocked users."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    monkeypatch.setattr(
        BlockService,
        "get_my_blocked_users",
        lambda user_id: [{"id": 2, "username": "alice"}],
    )

    response = client.get(
        "/api/v1/profile/blocks",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert len(data["data"]) == 1
    assert data["data"][0]["username"] == "alice"

def test_get_blocked_profile_fails(client, app, monkeypatch):
    """Test that viewing a blocked profile returns 403."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    def fake_get_profile(username, requester_id):
        raise ForbiddenError("You have blocked this user or been blocked by them")

    monkeypatch.setattr(ProfileService, "get_profile_by_username", fake_get_profile)

    response = client.get(
        "/api/v1/accounts/profile/alice",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 403
    data = response.get_json()
    assert data["error"] == "You have blocked this user or been blocked by them"

def test_send_message_to_blocked_user_fails(client, app, monkeypatch):
    """Test that sending a message to a blocked user returns 403."""
    with app.app_context():
        access_token = create_access_token(identity="1")

    monkeypatch.setattr(
        "app.middlewares.profile_guard.UserModel.get_user_by_id",
        lambda _user_id: {"id": 1, "is_profile_complete": True},
    )

    def fake_send_message(sender_id, receiver_id, content):
        raise ForbiddenError("You cannot message a blocked user or a user who has blocked you")

    monkeypatch.setattr(ChatService, "send_message", fake_send_message)

    payload = {"receiver_id": 2, "content": "Hello"}
    response = client.post(
        "/api/v1/chat/messages",
        json=payload,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    assert response.status_code == 403
    data = response.get_json()
    assert data["error"] == "You cannot message a blocked user or a user who has blocked you"
