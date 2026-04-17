"""Authentication business logic."""

from typing import Dict, Any
from flask import current_app
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.services.user_service import UserService
from app.utils.mail import MailService
from app.utils.utils import hash_password, verify_password, generate_token
from app.schemas.auth_schemas import LoginSchema, RegistrationSchema
from app.utils.app_error import BadRequestError, ConflictError


class AuthService:
    """Service class for authentication operations."""

    PASSWORD_RESET_SALT = "password-reset"

    @staticmethod
    def serialize_user(user: Dict[str, Any]) -> Dict[str, Any]:
        return {
            'id': user.get('id'),
            'username': user.get('username'),
            'email': user.get('email'),
            'is_profile_complete': user.get('is_profile_complete', False),
        }

    @staticmethod
    def get_user_by_identity(identity: str | int) -> Dict[str, Any] | None:
        try:
            return UserService.get_user_by_id(int(identity))
        except (TypeError, ValueError):
            return None

    @staticmethod
    def issue_access_token(user: Dict[str, Any]) -> str:
        return create_access_token(
            identity=str(user.get('id')),
            additional_claims={
                'username': user.get('username'),
                'email': user.get('email')
            }
        )

    @staticmethod
    def issue_refresh_token(user: Dict[str, Any]) -> str:
        return create_refresh_token(identity=str(user.get('id')))

    @staticmethod
    def _password_reset_serializer() -> URLSafeTimedSerializer:
        return URLSafeTimedSerializer(current_app.config["SECRET_KEY"], salt=AuthService.PASSWORD_RESET_SALT)

    @staticmethod
    def generate_password_reset_token(user: Dict[str, Any]) -> str:
        payload = {
            "user_id": user.get("id"),
            "email": user.get("email"),
        }
        return AuthService._password_reset_serializer().dumps(payload)

    @staticmethod
    def verify_password_reset_token(token: str) -> Dict[str, Any]:
        try:
            payload = AuthService._password_reset_serializer().loads(
                token,
                max_age=current_app.config.get("PASSWORD_RESET_TOKEN_MAX_AGE", 3600),
            )
        except SignatureExpired:
            return {"success": False, "error": "Reset token has expired"}
        except BadSignature:
            return {"success": False, "error": "Invalid reset token"}

        if not payload.get("user_id") or not payload.get("email"):
            return {"success": False, "error": "Invalid reset token"}

        return {"success": True, "payload": payload}

    @staticmethod
    def request_password_reset(email: str) -> Dict[str, Any]:
        user = UserService.get_user_by_email(email)

        if not user:
            return {
                "success": True,
                "message": "If an account exists for that email, a reset link has been sent.",
            }

        token = AuthService.generate_password_reset_token(user)
        verification_email_sent = MailService.send_password_reset_email(
            recipient=user.get("email"),
            username=user.get("username"),
            token=token,
        )
        if not verification_email_sent:
            raise BadRequestError("Failed to send password reset email")

        return {
            "success": True,
            "message": "Password reset link sent successfully",
            "verification_email_sent": verification_email_sent,
        }

    @staticmethod
    def reset_password(token: str, new_password: str) -> Dict[str, Any]:
        token_result = AuthService.verify_password_reset_token(token)
        if not token_result.get("success"):
            return token_result

        payload = token_result["payload"]
        user = UserService.get_user_by_id(int(payload["user_id"]))
        if not user:
            return {"success": False, "error": "User not found"}

        password_hash = hash_password(new_password)
        updated_user = UserService.update_password(int(user["id"]), password_hash)
        if not updated_user:
            raise BadRequestError("Failed to reset password")

        return {
            "success": True,
            "message": "Password reset successfully",
            "user": AuthService.serialize_user(updated_user),
        }
    
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
        if not verification_email_sent:
            raise BadRequestError("Failed to send verification email")
        return {
            'success': True,
            'message': 'User registered successfully',
            'verification_email_sent': verification_email_sent,
            'user': {
                'id': created_user.get('id'),
                'username': created_user.get('username'),
                'email': created_user.get('email'),
                'is_active': created_user.get('is_active', True),
                'is_profile_complete': created_user.get('is_profile_complete', False),
            }
        }
    
    @staticmethod
    def authenticate(data: LoginSchema) -> Dict[str, Any]:
        """
        Authenticate a user.
        
        Args:
            email: User's email
            password: User's plain text password
            
        Returns:
            Dict with success status and user data/token or error
        """
        try:
            user = UserService.get_user_by_email(data.email)
            
            if not user:
                return {
                    'success': False,
                    'error': 'Invalid credentials'
                }
            
            password_hash = user.get('password_hash')
            if not verify_password(data.password, password_hash):
                return {
                    'success': False,
                    'error': 'Invalid credentials'
                }
            
            # Check if user is active
            if not user.get('is_active', True):
                return {
                    'success': False,
                    'error': 'Account is deactivated, verify your email to activate it'
                }

            user_payload = AuthService.serialize_user(user)
            access_token = AuthService.issue_access_token(user)
            refresh_token = create_refresh_token(identity=str(user.get('id')))
            
            return {
                'success': True,
                'user': user_payload,
                'access_token': access_token,
                'refresh_token': refresh_token
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
        try:
            decoded = decode_token(token)
            identity = decoded.get('sub')
            if identity is None:
                return {
                    'success': False,
                    'error': 'Invalid token payload'
                }

            user = UserService.get_user_by_id(int(identity))
            if not user:
                return {
                    'success': False,
                    'error': 'User not found'
                }

            return {
                'success': True,
                'user': AuthService.serialize_user(user),
                'claims': decoded
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'Token verification failed: {str(e)}'
            }
