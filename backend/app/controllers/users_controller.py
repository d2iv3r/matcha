"""Controller for user-related operations."""

from flask import jsonify, request

from app.schemas.user_schemas import validate_user_update
from app.services.user_service import UserService


class UsersController:
    """Controller for user endpoints."""

    @staticmethod
    def list_users():
        users = UserService.get_all_users()
        return jsonify({"users": users, "count": len(users)}), 200

    @staticmethod
    def get_user(user_id: int):
        user = UserService.get_user_by_id(user_id)
        if user:
            return jsonify({"user": user}), 200
        return jsonify({"error": "User not found"}), 404

    @staticmethod
    def update_user(user_id: int):
        data = request.get_json()
        is_valid, error_message = validate_user_update(data)
        if not is_valid:
            return jsonify({"error": error_message}), 400

        user = UserService.update_user(user_id, **data)
        if user:
            return jsonify({"message": "User updated successfully", "user": user}), 200
        return jsonify({"error": "User not found or update failed"}), 404

    @staticmethod
    def delete_user(user_id: int):
        success = UserService.delete_user(user_id)
        if success:
            return jsonify({"message": "User deleted successfully"}), 200
        return jsonify({"error": "User not found or delete failed"}), 404