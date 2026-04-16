"""API routes for general endpoints."""

from flask import Blueprint, jsonify

api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.route("/health", methods=["GET"])
def health_check():
    return (
        jsonify({"status": "healthy", "message": "API is running", "version": "1.0.0"}),
        200,
    )


@api_bp.route("/", methods=["GET"])
def api_root():
    return (
        jsonify(
            {
                "message": "Welcome to Matcha API",
                "version": "1.0.0",
                "endpoints": {
                    "health": "/api/health",
                    "auth": {
                        "register": "/api/auth/register",
                        "signup": "/api/auth/signup",
                        "login": "/api/auth/login",
                        "refresh": "/api/auth/refresh",
                        "logout": "/api/auth/logout",
                        "me": "/api/auth/me",
                    },
                    "users": {
                        "list": "/api/v1/users/",
                        "detail": "/api/v1/users/<id>",
                        "profile": "/api/v1/users/profile/<username>",
                    },
                },
            }
        ),
        200,
    )