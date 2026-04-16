"""Application extensions registration"""

from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from flask_cors import CORS

jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address)
cache = Cache()
cors = CORS()

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
