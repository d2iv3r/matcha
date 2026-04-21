"""Authentication routes."""

from flask import Blueprint

from app.controllers.auth_controller import AuthController
from flask_jwt_extended import jwt_required


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


auth_bp.add_url_rule("/signup", view_func=AuthController.register_user, methods=["POST"])
auth_bp.add_url_rule("/verify-email", view_func=AuthController.verify_email, methods=["GET"])
auth_bp.add_url_rule("/login", view_func=AuthController.login, methods=["POST"])
# auth_bp.add_url_rule("/logout", view_func=AuthController.logout, methods=["POST"])
auth_bp.add_url_rule("/logout", view_func=jwt_required()(AuthController.logout), methods=["POST"])
auth_bp.add_url_rule("/request-password-reset", view_func=AuthController.request_password_reset, methods=["POST"])
auth_bp.add_url_rule("/confirm-password-reset", view_func=AuthController.reset_password, methods=["POST"])

# auth_bp.add_url_rule("/refresh", view_func=AuthController.refresh, methods=["POST"])
# auth_bp.add_url_rule("/me", view_func=AuthController.me, methods=["GET"])