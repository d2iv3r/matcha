"""User routes."""

from flask import jsonify, request
from app.api.v1.users import users_bp
from app.api.v1.users.services import UserService
from app.api.v1.users.schemas import validate_user_update


@users_bp.route('/', methods=['GET'])
def list_users():
    """List all users."""
    # TODO: Add pagination
    users = UserService.get_all_users()
    return jsonify({
        'users': users,
        'count': len(users)
    }), 200


@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id: int):
    """Get a specific user by ID."""
    user = UserService.get_user_by_id(user_id)
    
    if user:
        return jsonify({'user': user}), 200
    else:
        return jsonify({'error': 'User not found'}), 404


@users_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id: int):
    """Update user information."""
    data = request.get_json()
    
    # Validate input
    is_valid, error_message = validate_user_update(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    # Update user
    user = UserService.update_user(user_id, **data)
    
    if user:
        return jsonify({
            'message': 'User updated successfully',
            'user': user
        }), 200
    else:
        return jsonify({'error': 'User not found or update failed'}), 404


@users_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id: int):
    """Delete a user."""
    success = UserService.delete_user(user_id)
    
    if success:
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found or delete failed'}), 404


@users_bp.route('/profile/<username>', methods=['GET'])
def get_user_profile(username: str):
    """Get user profile by username."""
    user = UserService.get_user_by_username(username)
    
    if user:
        return jsonify({'user': user}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
