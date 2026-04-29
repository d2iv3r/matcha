"""Profile routes."""

from flask import Blueprint
from flask_jwt_extended import jwt_required

# from app.controllers.profile_controller import ProfileController
from app.controllers.profile_views_controller import ProfileViewsController
from app.controllers.profile_likes_controller import ProfileLikesController
from app.controllers.block_controller import BlockController
from app.middlewares.profile_guard import profile_completion_required


profile_bp = Blueprint("profile", __name__, url_prefix="/api/v1/profile")

# Profile Views management endpoints
# profile_bp.add_url_rule("/<string:username>/view", view_func=jwt_required()(profile_completion_required(ProfileViewsController.record_profile_viewer)), methods=["POST"])
profile_bp.add_url_rule("/viewers", view_func=jwt_required()(profile_completion_required(ProfileViewsController.get_profile_viewers)), methods=["GET"])
# profile_bp.add_url_rule("/views-count", view_func=jwt_required()(profile_completion_required(ProfileViewsController.get_view_count)), methods=["GET"])

# Profile Likes management endpoints
profile_bp.add_url_rule("/<string:username>/like", view_func=jwt_required()(profile_completion_required(ProfileLikesController.record_profile_like)), methods=["POST"])
profile_bp.add_url_rule("/likes", view_func=jwt_required()(profile_completion_required(ProfileLikesController.get_profile_likers)), methods=["GET"])
profile_bp.add_url_rule("/<string:username>/unlike", view_func=jwt_required()(profile_completion_required(ProfileLikesController.remove_profile_like)), methods=["POST"])
profile_bp.add_url_rule("/matches", view_func=jwt_required()(profile_completion_required(ProfileLikesController.get_profile_matches)), methods=["GET"])

# profile_bp.add_url_rule("/likes-count", view_func=jwt_required()(profile_completion_required(ProfileLikesController.get_like_count)), methods=["GET"])

# Profile blocking management endpoints
profile_bp.add_url_rule("/<string:username>/block", view_func=jwt_required()(profile_completion_required(BlockController.block_user)), methods=["POST"])
profile_bp.add_url_rule("/<string:username>/unblock", view_func=jwt_required()(profile_completion_required(BlockController.unblock_user)), methods=["POST"])
profile_bp.add_url_rule("/blocks", view_func=jwt_required()(profile_completion_required(BlockController.get_my_blocked_users)), methods=["GET"])
