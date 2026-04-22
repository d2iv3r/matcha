"""Profile routes."""

from flask import Blueprint
from flask_jwt_extended import jwt_required

# from app.controllers.profile_controller import ProfileController
from app.controllers.profile_views_controller import ProfileViewsController
from app.controllers.profile_likes_controller import ProfileLikesController
from app.middlewares.profile_guard import profile_completion_required


profile_bp = Blueprint("profile", __name__, url_prefix="/api/v1/profile")

# Profile Views management endpoints
# profile_bp.add_url_rule("/<string:username>/view", view_func=jwt_required()(profile_completion_required(ProfileViewsController.record_profile_viewer)), methods=["POST"])
profile_bp.add_url_rule("/viewers", view_func=jwt_required()(profile_completion_required(ProfileViewsController.get_profile_viewers)), methods=["GET"])
# profile_bp.add_url_rule("/views-count", view_func=jwt_required()(profile_completion_required(ProfileViewsController.get_view_count)), methods=["GET"])

# Profile Likes management endpoints
profile_bp.add_url_rule("/<string:username>/like", view_func=jwt_required()(profile_completion_required(ProfileLikesController.record_profile_like)), methods=["POST"])
profile_bp.add_url_rule("/likes", view_func=jwt_required()(profile_completion_required(ProfileLikesController.get_profile_likers)), methods=["GET"])
# profile_bp.add_url_rule("/likes-count", view_func=jwt_required()(profile_completion_required(ProfileLikesController.get_like_count)), methods=["GET"])
