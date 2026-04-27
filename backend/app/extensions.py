"""Application extensions registration"""

from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from flask_cors import CORS
from flask_socketio import SocketIO
from authlib.integrations.flask_client import OAuth

jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address)
cache = Cache()
cors = CORS()
socketio = SocketIO(logger=True, engineio_logger=True)
oauth = OAuth()

def register_extensions(app:Flask) -> None:
    """Initialize Flask extensions with proper configuration."""

    jwt.init_app(app)

    limiter.init_app(app)

    cache.init_app(app)

    cors.init_app(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', app.config.get('FRONTEND_URL', '*')),
            "supports_credentials": True,
        }
    })

    socketio.init_app(
        app,
        cors_allowed_origins=app.config.get("SOCKETIO_CORS_ORIGINS"),
        async_mode=app.config.get("SOCKETIO_ASYNC_MODE"),
        ping_interval=app.config.get("SOCKETIO_PING_INTERVAL"),
        ping_timeout=app.config.get("SOCKETIO_PING_TIMEOUT"),
        max_http_buffer_size=app.config.get("SOCKETIO_MAX_HTTP_BUFFER_SIZE"),
    )

    oauth.init_app(app)
    oauth.register(
        name="intra42",
        client_id=app.config.get("INTRA42_CLIENT_ID"),
        client_secret=app.config.get("INTRA42_CLIENT_SECRET"),
        access_token_url=app.config.get("INTRA42_ACCESS_TOKEN_URL"),
        authorize_url=app.config.get("INTRA42_AUTHORIZE_URL"),
        api_base_url="https://api.intra.42.fr/",
        client_kwargs={
            "scope": "public",
        },
    )

    @jwt.unauthorized_loader
    def handle_missing_jwt(reason: str):
        return jsonify({"success": False, "error": "Authentication required", "details": reason}), 401

    @jwt.invalid_token_loader
    def handle_invalid_jwt(reason: str):
        return jsonify({"success": False, "error": "Invalid token", "details": reason}), 401

    @jwt.expired_token_loader
    def handle_expired_jwt(_jwt_header, _jwt_payload):
        return jsonify({"success": False, "error": "Token has expired"}), 401

    @jwt.revoked_token_loader
    def handle_revoked_jwt(_jwt_header, _jwt_payload):
        return jsonify({"success": False, "error": "Token has been revoked"}), 401
