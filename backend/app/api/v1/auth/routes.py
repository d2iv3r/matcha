"""Authentication routes."""

from flask import jsonify, request
from app.api.v1.auth import auth_bp
from app.api.v1.auth.services import AuthService
from app.api.v1.auth.schemas import validate_registration, validate_login


@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint."""
    data = request.get_json()
    
    # Validate input
    is_valid, error_message = validate_registration(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    # Register user
    result = AuthService.register_user(
        username=data['username'],
        email=data['email'],
        password=data['password']
    )
    
    if result['success']:
        return jsonify({
            'message': 'User registered successfully',
            'user': result['user']
        }), 201
    else:
        return jsonify({'error': result['error']}), 400


@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint."""
    data = request.get_json()
    
    # Validate input
    is_valid, error_message = validate_login(data)
    if not is_valid:
        return jsonify({'error': error_message}), 400
    
    # Authenticate user
    result = AuthService.authenticate(
        email=data['email'],
        password=data['password']
    )
    
    if result['success']:
        return jsonify({
            'message': 'Login successful',
            'user': result['user'],
            'token': result.get('token')
        }), 200
    else:
        return jsonify({'error': result['error']}), 401


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """User logout endpoint."""
    # TODO: Implement token invalidation
    return jsonify({'message': 'Logout successful'}), 200


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current authenticated user."""
    # TODO: Implement JWT token verification
    return jsonify({'message': 'Current user endpoint'}), 200
