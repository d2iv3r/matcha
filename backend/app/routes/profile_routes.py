"""Profile routes."""

from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.controllers.profile_controller import ProfileController
from app.middlewares.profile_guard import profile_completion_required


profile_bp = Blueprint("account", __name__, url_prefix="/api/v1/account")


profile_bp.add_url_rule("/complete-profile", view_func=jwt_required()(ProfileController.update_profile), methods=["POST"])
profile_bp.add_url_rule("/profile", view_func=jwt_required()(profile_completion_required(ProfileController.get_profile)), methods=["GET"])
