"""Socket.IO event handler registration.

Includes JWT handshake validation for websocket connections.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, Optional
from datetime import datetime, timezone

from flask import current_app, request, session
from flask_jwt_extended import decode_token
from flask_socketio import ConnectionRefusedError, join_room, leave_room


logger = logging.getLogger(__name__)


def _get_token_from_request(auth_payload: Optional[Dict[str, Any]]) -> str | None:
    """Extract JWT token from auth payload, headers, or cookies."""
    # 1. Try auth payload (Socket.IO client common practice)
    if auth_payload and isinstance(auth_payload, dict):
        token = auth_payload.get("token") or auth_payload.get("jwt")
        if token:
            # Handle "Bearer <token>" format
            if token.startswith("Bearer "):
                return token.split(" ")[1]
            return token

    # 2. Try Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]

    # 3. Try cookies
    cookie_name = current_app.config.get("JWT_ACCESS_COOKIE_NAME", "access_token_cookie")
    return request.cookies.get(cookie_name)


def _verify_jwt_token(token: str) -> Dict[str, Any]:
    decoded = decode_token(token)
    identity = decoded.get("sub")
    if identity is None:
        raise ConnectionRefusedError("Missing token identity")
    return decoded


def register_event_handlers(socketio_instance) -> None:
    """Register Socket.IO events and namespaces."""

    @socketio_instance.on("connect")
    def _connect(auth: Optional[Dict[str, Any]] = None):
        token = _get_token_from_request(auth)
        if not token:
            logger.info("[Realtime] Connection rejected sid=%s reason=missing_token", request.sid)
            raise ConnectionRefusedError("Authentication required")

        try:
            decoded = _verify_jwt_token(token)
        except Exception as exc:
            logger.info("[Realtime] Connection rejected sid=%s reason=invalid_token error=%s", request.sid, exc)
            raise ConnectionRefusedError("Invalid token") from exc

        user_id = decoded.get("sub")
        session["user_id"] = user_id
        session["jwt_claims"] = decoded
        join_room(f"user_{user_id}")
        
        # Join conversation rooms
        from app.services.chat_service import ChatService
        try:
            conversations = ChatService.get_user_conversations(int(user_id))
            for conv in conversations:
                join_room(f"conversation_{conv.id}")
                logger.debug("[Realtime] User %s joined room conversation_%s", user_id, conv.id)
        except Exception as exc:
            logger.error("[Realtime] Error joining conversation rooms for user %s: %s", user_id, exc)

        from app.models.user_model import UserModel
        try:
            UserModel.update_status(int(user_id), True)
        except Exception as exc:
            logger.error("[Realtime] Error updating online status for user %s: %s", user_id, exc)

        # Broadcast status to matches
        from app.services.profile_likes_service import ProfileLikesService
        try:
            matches = ProfileLikesService.get_matches(int(user_id), limit=100)
            for m in matches:
                other_id = m.get("liker_id")
                if other_id:
                    socketio_instance.emit("user_status", {
                        "user_id": int(user_id),
                        "is_online": True,
                        "last_connection": datetime.now(timezone.utc).isoformat()
                    }, room=f"user_{other_id}")
        except Exception as exc:
            logger.error("[Realtime] Error broadcasting online status for user %s: %s", user_id, exc)

        logger.info("[Realtime] Connected sid=%s user_id=%s room=user_%s", request.sid, user_id, user_id)

    @socketio_instance.on("send_message")
    def _handle_send_message(data: Dict[str, Any]):
        if not data:
            return {"error": "Missing data"}
        sender_id = session.get("user_id")
        if not sender_id:
            return {"error": "Unauthorized"}
        receiver_id = data.get("receiver_id")
        content = data.get("content")
        if not receiver_id or not content:
            return {"error": "Missing receiver_id or content"}
            
        from app.services.chat_service import ChatService
        try:
            message = ChatService.send_message(int(sender_id), int(receiver_id), content)
            payload = message.to_dict()
            
            # 1. Emit to receiver's personal room for global indicator
            socketio_instance.emit("new_message", payload, room=f"user_{receiver_id}")
            
            # 2. Emit to conversation room for active chat window
            socketio_instance.emit("new_message", payload, room=f"conversation_{payload['conversation_id']}")
            
            return {"status": "ok", "message": payload}
        except Exception as exc:
            logger.error("[Realtime] Error sending message: %s", exc)
            return {"error": str(exc)}

    @socketio_instance.on("mark_read")
    def _handle_mark_read(data: Dict[str, Any]):
        if not data:
            return {"error": "Missing data"}
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}
        
        conversation_id = data.get("conversation_id")
        if not conversation_id:
            return {"error": "Missing conversation_id"}
            
        from app.services.chat_service import ChatService
        try:
            ChatService.mark_as_read(int(user_id), int(conversation_id))
            
            # Emit messages_read event to both reader and sender
            # Reader (current user) to sync other tabs
            socketio_instance.emit("messages_read", {
                "conversation_id": conversation_id,
                "reader_id": user_id
            }, room=f"user_{user_id}")
            
            # We also need to notify the OTHER user in the conversation
            from app.models.chat_model import ConversationModel
            conv = ConversationModel.get_by_id(conversation_id)
            if conv:
                other_id = conv.user2_id if conv.user1_id == int(user_id) else conv.user1_id
                socketio_instance.emit("messages_read", {
                    "conversation_id": conversation_id,
                    "reader_id": user_id
                }, room=f"user_{other_id}")
            
            return {"status": "ok"}
        except Exception as exc:
            logger.error("[Realtime] Error marking as read: %s", exc)
            return {"error": str(exc)}

    @socketio_instance.on("disconnect")
    def _disconnect():
        user_id = session.get("user_id")
        if user_id is not None:
            leave_room(f"user_{user_id}")
            from app.models.user_model import UserModel
            try:
                UserModel.update_status(int(user_id), False)
            except Exception as exc:
                logger.error("[Realtime] Error updating offline status for user %s: %s", user_id, exc)
            
            # Broadcast status to matches
            from app.services.profile_likes_service import ProfileLikesService
            try:
                matches = ProfileLikesService.get_matches(int(user_id), limit=100)
                for m in matches:
                    other_id = m.get("liker_id")
                    if other_id:
                        socketio_instance.emit("user_status", {
                            "user_id": int(user_id),
                            "is_online": False,
                            "last_connection": datetime.now(timezone.utc).isoformat()
                        }, room=f"user_{other_id}")
            except Exception as exc:
                logger.error("[Realtime] Error broadcasting offline status for user %s: %s", user_id, exc)
            
        logger.info("[Realtime] Disconnected sid=%s user_id=%s", request.sid, user_id)
        session.pop("user_id", None)
        session.pop("jwt_claims", None)
