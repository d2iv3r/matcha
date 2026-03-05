"""Authentication business logic."""

from typing import Dict, Any
from app.api.v1.users.services import UserService
from app.shared.utils import hash_password, verify_password, generate_token


class AuthService:
    """Service class for authentication operations."""
    
    @staticmethod
    def register_user(username: str, email: str, password: str) -> Dict[str, Any]:
        """
        Register a new user.
        
        Args:
            username: User's username
            email: User's email
            password: User's plain text password
            
        Returns:
            Dict with success status and user data or error
        """
        try:
            # Check if user already exists
            existing_user = UserService.get_user_by_email(email)
            if existing_user:
                return {
                    'success': False,
                    'error': 'User with this email already exists'
                }
            
            # Check username
            existing_username = UserService.get_user_by_username(username)
            if existing_username:
                return {
                    'success': False,
                    'error': 'Username already taken'
                }
            
            # Hash password
            password_hash = hash_password(password)
            
            # Create user
            user = UserService.create_user(
                username=username,
                email=email,
                password_hash=password_hash
            )
            
            if user:
                return {
                    'success': True,
                    'user': {
                        'id': user.get('id'),
                        'username': user.get('username'),
                        'email': user.get('email')
                    }
                }
            else:
                return {
                    'success': False,
                    'error': 'Failed to create user'
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': f'Registration failed: {str(e)}'
            }
    
    @staticmethod
    def authenticate(email: str, password: str) -> Dict[str, Any]:
        """
        Authenticate a user.
        
        Args:
            email: User's email
            password: User's plain text password
            
        Returns:
            Dict with success status and user data/token or error
        """
        try:
            # Get user by email
            user = UserService.get_user_by_email(email)
            
            if not user:
                return {
                    'success': False,
                    'error': 'Invalid credentials'
                }
            
            # Verify password
            password_hash = user.get('password_hash')
            if not verify_password(password, password_hash):
                return {
                    'success': False,
                    'error': 'Invalid credentials'
                }
            
            # Check if user is active
            if not user.get('is_active', True):
                return {
                    'success': False,
                    'error': 'Account is deactivated'
                }
            
            # Generate authentication token
            token = generate_token(32)
            
            return {
                'success': True,
                'user': {
                    'id': user.get('id'),
                    'username': user.get('username'),
                    'email': user.get('email')
                },
                'token': token
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Authentication failed: {str(e)}'
            }
    
    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        """
        Verify an authentication token.
        
        Args:
            token: Authentication token
            
        Returns:
            Dict with success status and user data or error
        """
        # TODO: Implement token verification with database/cache
        return {
            'success': False,
            'error': 'Token verification not implemented'
        }
