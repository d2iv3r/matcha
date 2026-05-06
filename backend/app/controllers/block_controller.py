"""Controller for block-related endpoints."""

from app.utils.response import success
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.services.block_service import BlockService

class BlockController:
    @staticmethod
    @jwt_required()
    def block_user(username: str):
        """Block a user."""
        blocker_id = int(get_jwt_identity())
        BlockService.block_user_by_username(blocker_id, username)
        return success(message="User blocked successfully", data={}, status=201)


    @staticmethod
    @jwt_required()
    def unblock_user(username: str):
        """Unblock a user."""
        blocker_id = int(get_jwt_identity())
        BlockService.unblock_user_by_username(blocker_id, username)
        return success(message="User unblocked successfully", data={})

    @staticmethod
    @jwt_required()
    def get_my_blocked_users():
        """Get list of blocked users."""
        user_id = int(get_jwt_identity())
        blocked_users = BlockService.get_my_blocked_users(user_id)
        return success(message="Blocked users fetched successfully", data=blocked_users)
