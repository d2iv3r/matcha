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
        logger.info("[Realtime] Connected sid=%s user_id=%s room=user_%s", request.sid, user_id, user_id)

    @socketio_instance.on("disconnect")
    def _disconnect():
        user_id = session.get("user_id")
        if user_id is not None:
            leave_room(f"user_{user_id}")
        logger.info("[Realtime] Disconnected sid=%s user_id=%s", request.sid, user_id)
        session.pop("user_id", None)
        session.pop("jwt_claims", None)
