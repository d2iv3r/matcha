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
                "author": "efarhat",
                "version": "1.0.0",
                "endpoints": {
                    "health": "/api/health",
                    "auth": {
                        "signup": "/api/auth/signup",
                        "verify_email": "/api/auth/verify-email",
                        "login": "/api/auth/login",
                        "logout": "/api/auth/logout",
                        "request_password_reset": "/api/auth/request-password-reset",
                        "confirm_password_reset": "/api/auth/confirm-password-reset",
                        "oauth2/42/login": "/api/auth/oauth2/42/login",
                        "oauth2/42/callback": "/api/auth/oauth2/42/callback"
                    },
                    "accounts": {
                        "complete_profile": "/api/v1/accounts/complete-profile",
                        "my_profile": "/api/v1/accounts/profile",
                        "update_profile": "/api/v1/accounts/profile",
                        "update_security": "/api/v1/accounts/security",
                        "update_profile_media": "/api/v1/accounts/profile/media",
                        "update_location": "/api/v1/accounts/profile/location",
                        "profile_by_username": "/api/v1/accounts/profile/<username>",
                        "search_profiles": "/api/v1/accounts/profiles/search",
                        "suggested_profiles_list": "/api/v1/accounts/profiles",
                    },
                    "profile": {
                        "profile_views": "/api/v1/profile/viewers",
                        "profile_like_a_user": "/api/v1/profile/<username>/like",
                        "profile_unlike_a_user": "/api/v1/profile/<username>/unlike",
                        "profile_likes": "/api/v1/profile/likes",
                        "profile_matches": "/api/v1/profile/matches",
                        "profile_block_a_user": "/api/v1/profile/<username>/block",
                        "profile_unblock_a_user": "/api/v1/profile/<username>/unblock",
                        "profile_blocked": "/api/v1/profile/blocked"
                    },
                    "chat": {
                        "get_conversations": "/api/v1/chat/conversations",
                        "get_messages": "/api/v1/chat/conversations/<int:conversation_id>/messages",
                        "send_message": "/api/v1/chat/messages",
                        "mark_read": "/api/v1/chat/messages/read",
                        "get_unread_count": "/api/v1/chat/unread-count"
                    },
                    "notifications": {
                        "get_notifications": "/api/v1/notifications",
                        "mark_notification_read": "/api/v1/notifications/<int:notification_id>/read",
                        "mark_all_read": "/api/v1/notifications/read-all"
                    },
                    "docs": {
                        "swagger_ui": "/api/docs",
                    }
                },
            }
        ),
        200,
    )