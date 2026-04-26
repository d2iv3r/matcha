"""Socket.IO event handler registration.

Includes JWT handshake validation for websocket connections.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, Optional

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
        logger.info("[Realtime] Connect attempt sid=%s", request.sid)
        token = _get_token_from_request(auth)
        print(f"token ==> {token}")
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
        print(f"REALTIME: User connected: {user_id}")
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

        logger.info("[Realtime] Connected sid=%s user_id=%s room=user_%s", request.sid, user_id, user_id)

    @socketio_instance.on("send_message")
    def _handle_send_message(data: Dict[str, Any]):
        if not data:
            return {"error": "Missing data"}
        sender_id = session.get("user_id")
        if not sender_id:
            return {"error": "Unauthorized"}
        print(f"data ==> {data}")
        receiver_id = data.get("receiver_id")
        content = data.get("content")
        print(f"content ==> {content}")
        print(f"receiver_id ==> {receiver_id}")
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

    @socketio_instance.on("disconnect")
    def _disconnect():
        user_id = session.get("user_id")
        if user_id is not None:
            leave_room(f"user_{user_id}")
            # Automatically leaves all rooms on disconnect, but we can be explicit if needed
        logger.info("[Realtime] Disconnected sid=%s user_id=%s", request.sid, user_id)
        session.pop("user_id", None)
        session.pop("jwt_claims", None)
