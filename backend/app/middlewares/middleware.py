"""Application middleware."""

from flask import Flask, jsonify, g, request, make_response
from flask_jwt_extended import decode_token, create_access_token
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def _store_request_payload() -> None:
    g.json_payload = request.get_json(silent=True) if request.method in {"POST", "PUT", "PATCH", "DELETE"} else None


def _validate_and_refresh_token() -> None:
    """
    Validate the access token from cookies and auto-refresh if expired.
    Stores validated user info in g.current_user.
    """
    # Skip token validation for auth endpoints and public routes
    public_routes = [
        '/api/auth/register',
        '/api/auth/login',
        '/api/auth/refresh',
        '/api/auth/verify-email',
        '/api/auth/request-password-reset',
        '/api/auth/reset-password',
    ]
    
    if request.path in public_routes or request.method == 'OPTIONS':
        return

    from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, decode_token
    
    try:
        # 1. Try to verify the existing token
        try:
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
            if user_id:
                # Update last connection time and set online status
                from app.models.user_model import UserModel
                UserModel.update_status(int(user_id), True)
                return
        except Exception:
            # Token is likely expired or invalid
            pass

        # 2. If we reach here, we don't have a valid access token. Try to refresh.
        refresh_token = request.cookies.get('refresh_token_cookie')

        if refresh_token:
            try:
                # Decode refresh token to get user identity
                decoded_refresh = decode_token(refresh_token)
                user_id = decoded_refresh.get('sub')
                
                if user_id:
                    from app.services.auth_service import AuthService
                    user = AuthService.get_user_by_identity(user_id)
                    
                    if user:
                        # Create new access token
                        new_access_token = AuthService.issue_access_token(user)
                        
                        # Store for after_request to set the cookie
                        g.new_access_token = new_access_token
                        g.refresh_access_token = True
                        
                        # 3. CRITICAL: Inject the new token into the request environment
                        # so that subsequent @jwt_required decorators see it.
                        request.environ['HTTP_AUTHORIZATION'] = f'Bearer {new_access_token}'
                        
                        # 4. Re-verify the request with the new token
                        verify_jwt_in_request()
                        
                        logger.debug(f"Automatically refreshed token for user {user_id}")
            except Exception as refresh_error:
                logger.debug(f"Auto-refresh failed: {refresh_error}")
    except Exception as e:
        logger.debug(f"Token validation error: {e}")


def register_middleware(app: Flask) -> None:
    """Register request lifecycle middleware and error handlers."""

    @app.before_request
    def before_request():
        _store_request_payload()
        _validate_and_refresh_token()

    @app.after_request
    def after_request(response):
        origin = request.headers.get("Origin")
        frontend_origin = app.config.get("FRONTEND_URL")

        if origin and origin == frontend_origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Vary"] = "Origin"

        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-CSRF-TOKEN"
        response.headers["Access-Control-Max-Age"] = "3600"
        
        # If we refreshed the access token, set it in the response cookies
        if getattr(g, 'refresh_access_token', False) and getattr(g, 'new_access_token', None):
            response.set_cookie(
                key="access_token_cookie",
                value=g.new_access_token,
                httponly=True,
                secure=request.environ.get("wsgi.url_scheme") == "https",
                samesite="Lax",
                path="/"
            )
        
        return response

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request", "message": str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"error": "Unauthorized", "message": "Authentication required"}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"error": "Forbidden", "message": "Access denied"}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found", "message": "Resource not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(415)
    def unsupported_media_type(error):
        return jsonify(
            {
                "error": "Unsupported media type",
                "message": "Send JSON with Content-Type: application/json",
            }
        ), 415

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    @app.route("/", defaults={"path": ""}, methods=["OPTIONS"])
    @app.route("/<path:path>", methods=["OPTIONS"])
    def options_handler(path):
        return "", 204