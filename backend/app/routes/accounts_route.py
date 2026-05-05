"""Accounts routes."""

from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.controllers.profile_controller import ProfileController
from app.middlewares.profile_guard import profile_completion_required

accounts_bp = Blueprint("accounts", __name__, url_prefix="/api/v1/accounts")

accounts_bp.add_url_rule("/complete-profile", view_func=jwt_required()(ProfileController.complete_profile), methods=["POST"])
accounts_bp.add_url_rule("/profile", view_func=jwt_required()(profile_completion_required(ProfileController.get_my_profile)), methods=["GET"])
accounts_bp.add_url_rule("/profile", view_func=jwt_required()(profile_completion_required(ProfileController.update_my_profile)), methods=["PATCH"])
accounts_bp.add_url_rule("/security", view_func=jwt_required()(profile_completion_required(ProfileController.update_security_settings)), methods=["PATCH"])
accounts_bp.add_url_rule("/profile/media", view_func=jwt_required()(profile_completion_required(ProfileController.update_profile_media)), methods=["PATCH"])
accounts_bp.add_url_rule("/profile/location", view_func=jwt_required()(profile_completion_required(ProfileController.update_location)), methods=["PATCH"])
accounts_bp.add_url_rule("/profile/<string:username>", view_func=jwt_required()(profile_completion_required(ProfileController.get_profile_by_username)), methods=["GET"])

accounts_bp.add_url_rule("/profiles/search", view_func=jwt_required()(profile_completion_required(ProfileController.search_profiles)), methods=["GET"])
accounts_bp.add_url_rule("/profiles", view_func=jwt_required()(profile_completion_required(ProfileController.get_profiles_list)), methods=["GET"])
