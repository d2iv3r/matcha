"""Controller for block-related endpoints."""

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.services.block_service import BlockService

class BlockController:
    @staticmethod
    @jwt_required()
    def block_user(username: str):
        """Block a user."""
        blocker_id = int(get_jwt_identity())
        try:
            result = BlockService.block_user_by_username(blocker_id, username)
            if not result:
                return jsonify({"error": "User not found"}), 404
            return jsonify({"message": "User blocked successfully", "data": result}), 201
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "An error occurred while blocking the user"}), 500

    @staticmethod
    @jwt_required()
    def unblock_user(username: str):
        """Unblock a user."""
        blocker_id = int(get_jwt_identity())
        try:
            affected_rows = BlockService.unblock_user_by_username(blocker_id, username)
            if affected_rows == 0:
                return jsonify({"error": "Block not found"}), 404
            return jsonify({"message": "User unblocked successfully"}), 200
        except Exception as e:
            return jsonify({"error": "An error occurred while unblocking the user"}), 500

    @staticmethod
    @jwt_required()
    def get_my_blocked_users():
        """Get list of blocked users."""
        user_id = int(get_jwt_identity())
        try:
            blocked_users = BlockService.get_my_blocked_users(user_id)
            return jsonify({"data": blocked_users}), 200
        except Exception as e:
            return jsonify({"error": "An error occurred while fetching blocked users"}), 500
