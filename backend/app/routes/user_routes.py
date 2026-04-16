"""User routes."""

from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.controllers.users_controller import UsersController
from app.middlewares.profile_guard import profile_completion_required


users_bp = Blueprint("users", __name__, url_prefix="/api/v1/users")
USER_ID_PATH = "/<int:user_id>"


users_bp.add_url_rule("/", view_func=jwt_required()(profile_completion_required(UsersController.list_users)), methods=["GET"])
users_bp.add_url_rule(USER_ID_PATH, view_func=jwt_required()(profile_completion_required(UsersController.get_user)), methods=["GET"])
users_bp.add_url_rule(USER_ID_PATH, view_func=jwt_required()(profile_completion_required(UsersController.update_user)), methods=["PUT"])
users_bp.add_url_rule(USER_ID_PATH, view_func=jwt_required()(profile_completion_required(UsersController.delete_user)), methods=["DELETE"])