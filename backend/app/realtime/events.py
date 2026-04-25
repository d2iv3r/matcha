"""Socket.IO event handler registration.

Includes JWT handshake validation for websocket connections.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, Optional

from flask import current_app, request, session
from flask_jwt_extended import decode_token
from flask_socketio import ConnectionRefusedError


logger = logging.getLogger(__name__)


def _get_token_from_request(auth_payload: Optional[Dict[str, Any]]) -> str | None:
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
            logger.info("[Realtime] Connection rejected: missing token")
            raise ConnectionRefusedError("Authentication required")

        try:
            decoded = _verify_jwt_token(token)
        except Exception as exc:
            logger.info("[Realtime] Connection rejected: invalid token (%s)", exc)
            raise ConnectionRefusedError("Invalid token") from exc

        session["user_id"] = decoded.get("sub")
        session["jwt_claims"] = decoded

    @socketio_instance.on("disconnect")
    def _disconnect():
        session.pop("user_id", None)
        session.pop("jwt_claims", None)
