"""Authentication business logic."""

from typing import Dict, Any
from app.api.v1.users.services import UserService
from app.shared.mail import MailService
from app.shared.utils import hash_password, verify_password, generate_token
from app.api.v1.auth.schemas import RegistrationSchema
from app.core.appError import BadRequestError, ConflictError


class AuthService:
    """Service class for authentication operations."""
    
    @staticmethod
    def register_user(user_data: RegistrationSchema) -> Dict[str, Any]:
        """
        Register a new user.
        
        Args:
            user_data: Registration schema instance
        """
        existing_user = UserService.get_user_by_email(user_data.email)
        if existing_user:
            raise ConflictError("User with this email already exists")

        existing_username = UserService.get_user_by_username(user_data.username)
        if existing_username:
            raise ConflictError("Username is already taken")

        password_hash = hash_password(user_data.password)
        user_data.password = password_hash
        created_user = UserService.create_user(user_data)

        if not created_user:
            raise BadRequestError("Failed to create user")

        verification_token = generate_token(48)
        verification_email_sent = MailService.send_verification_email(
            recipient=user_data.email,
            username=user_data.username,
            token=verification_token,
        )

        return {
            'success': True,
            'message': 'User registered successfully',
            'verification_email_sent': verification_email_sent,
            'user': {
                'id': created_user.get('id'),
                'username': created_user.get('username'),
                'email': created_user.get('email'),
                'is_active': created_user.get('is_active', True)
            }
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
        return {
            'success': False,
            'error': 'Token verification not implemented'
        }
