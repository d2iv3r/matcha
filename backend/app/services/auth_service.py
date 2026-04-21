"""Authentication business logic."""

from datetime import datetime, timedelta, timezone
from venv import logger

from app.models.email_verification_token_model import EmailVerificationTokenModel
from app.models.password_reset_token_model import PasswordResetTokenModel
from app.models.user_model import UserModel

from app.utils.mail import MailService
from app.utils.utils import hash_password, verify_password, generate_token, hash_token
from app.schemas.auth_requests_schemas import LoginSchema, RegistrationSchema
from app.utils.app_error import BadRequestError, ConflictError


class AuthService:
    """Service class for authentication operations."""

    @staticmethod
    def register_user(user_data: RegistrationSchema) -> UserModel:
        """
        Register a new user.

        Args:
            user_data: Registration schema instance
        Returns:
            UserModel instance of the created user
        """
        if UserModel.is_email_existing(user_data.email):
            raise ConflictError("User with this email already exists")
        if UserModel.is_username_existing(user_data.username):
            raise ConflictError("User with this username already exists")

        password_hash = hash_password(user_data.password)
        created_user = UserModel(
            username=user_data.username,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=user_data.email,
            password_hash=password_hash,
        ).create_user()

        if not created_user:
            raise BadRequestError("Failed to create user")
        return created_user

    @staticmethod
    def generate_email_verification_token(user_id: int) -> tuple[str, datetime]:
        """
        generate an email verification token for a user.
        Args:
            user_id: ID of the user to generate the token for
        Returns:
            Tuple containing the generated token and its expiration datetime
        """
        token = generate_token(48)
        expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
        token_hash = hash_token(token)
        EmailVerificationTokenModel.store_token(user_id, token_hash, expires_at)
        return token, expires_at
    
    @staticmethod
    def verify_email_token(token: str) -> None:
        """
        verify an email verification token and activate the associated user account if valid.
        Args:
            token: The email verification token to verify
        Raises:
            BadRequestError: If the token is invalid, expired, or if the user cannot be activated
        """
        token_hash = hash_token(token)
        record = EmailVerificationTokenModel.get_by_token_hash(token_hash)

        logger.info("Verifying email token if is in database")
        if not record:
            raise BadRequestError("Invalid verification token")

        logger.info("Checking if token is expired")
        expires_at = record.expires_at
        if expires_at and expires_at < datetime.now(timezone.utc):
            raise BadRequestError("Verification token has expired")

        logger.info("Fetching user associated with token")
        user = UserModel.get_user_by_id(int(record.user_id))
        if not user:
            raise BadRequestError("User not found")

        logger.info("Activating user account")
        if not UserModel.activate_user_by_id(int(user.id)):
            raise BadRequestError("Failed to activate user account")

        EmailVerificationTokenModel.delete_by_id(int(record.id))

    @staticmethod
    def authenticate(data: LoginSchema) -> UserModel | None:
        """
        Authenticate a user.
        
        Args:
            username: User's username
            password: User's plain text password
            
        Returns:
            UserModel instance if authentication is successful, None otherwise
        """

        user = UserModel.get_user_by_username(data.username)
        if not user:
            return None
        password_hash = user.password_hash
        if not verify_password(data.password, password_hash):
            return None

        return user
    
    @staticmethod
    def request_password_reset(email: str) -> None:
        """
        request a password reset for a user by email. This generates a password reset token and sends a password reset email to the user.
        Args:
            email: The email of the user requesting the password reset
        Raises:
            BadRequestError: If no user is found with the provided email or if the password reset email fails to send
        """
        user = UserModel.get_user_by_email(email)

        if not user:
            raise BadRequestError("No user found with the provided email")
        token = generate_token(48)
        expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
        token_hash = hash_token(token)
        PasswordResetTokenModel.store_token(user.id, token_hash, expires_at)
        password_reset_email_sent = MailService.send_password_reset_email(
            recipient=user.email,
            username=user.username,
            token=token,
        )
        if not password_reset_email_sent:
            raise BadRequestError("Failed to send password reset email")


    @staticmethod
    def reset_password(token: str, new_password: str) -> None:
        """
        reset a user's password using a password reset token. This verifies the token, updates the user's password, and marks the token as used.
        Args:            token: The password reset token to verify
            new_password: The new plain text password to set for the user
        Raises: 
            BadRequestError: If the token is invalid, expired, if the user is not found, if the password update fails, or if marking the token as used fails
        """
        token_hash = hash_token(token)
        record = PasswordResetTokenModel.get_by_token_hash(token_hash)

        if not record:
            raise BadRequestError("Invalid token")

        expires_at = record.expires_at
        if expires_at and expires_at < datetime.now(timezone.utc):
            raise BadRequestError("Verification token has expired")
        user = UserModel.get_user_by_id(int(record.user_id))
        if not user:
            raise BadRequestError("User not found")
        if not UserModel.update_password(int(user.id), hash_password(new_password)):
            raise BadRequestError("Failed to update user password")
        PasswordResetTokenModel.delete_by_id(int(record.id))



    # @staticmethod
    # def get_user_by_identity(identity: str | int) -> UserSchema | None:
    #     try:
    #         return UserService.get_user_by_id(int(identity))
    #     except (TypeError, ValueError):
    #         return None

    # @staticmethod
    # def issue_access_token(user: UserSchema | UserModel | Dict[str, Any]) -> str:
    #     if isinstance(user, (UserSchema, UserModel)):
    #         return create_access_token(
    #             identity=str(user.id),
    #             additional_claims={
    #                 'username': user.username,
    #                 'email': user.email
    #             }
    #         )

    #     return create_access_token(
    #         identity=str(user.get('id')),
    #         additional_claims={
    #             'username': user.get('username'),
    #             'email': user.get('email')
    #         }
    #     )

    # @staticmethod
    # def issue_refresh_token(user: UserSchema | UserModel | Dict[str, Any]) -> str:
    #     if isinstance(user, (UserSchema, UserModel)):
    #         return create_refresh_token(identity=str(user.id))
    #     return create_refresh_token(identity=str(user.get('id')))

    # @staticmethod
    # def _email_verification_token_hash(token: str) -> str:
    #     return hashlib.sha256(token.encode("utf-8")).hexdigest()


    # @staticmethod
    # def generate_password_reset_token(user: UserSchema | UserModel | Dict[str, Any]) -> str:
    #     token = generate_token(48)
    #     expires_at = datetime.now(timezone.utc) + timedelta(
    #         seconds=int(current_app.config.get("PASSWORD_RESET_TOKEN_MAX_AGE", 3600))
    #     )
    #     token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    #     user_id = user.id if isinstance(user, (UserSchema, UserModel)) else user.get("id")
    #     PasswordResetTokenModel.store_token(int(user_id), token_hash, expires_at)
    #     return token

    # @staticmethod
    # def verify_password_reset_token(token: str) -> Dict[str, Any]:
    #     token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    #     record = PasswordResetTokenModel.get_by_token_hash(token_hash)

    #     if not record:
    #         return {"success": False, "error": "Invalid reset token"}

    #     if record.used_at is not None:
    #         return {"success": False, "error": "Reset token has already been used"}

    #     expires_at = record.expires_at
    #     if expires_at and expires_at < datetime.now(timezone.utc):
    #         return {"success": False, "error": "Reset token has expired"}

    #     return {"success": True, "payload": {"user_id": record.user_id}, "record_id": record.id}
                  
    
    # @staticmethod
    # def verify_token(token: str) -> VerifyTokenResultSchema:
    #     """
    #     Verify an authentication token.
        
    #     Args:
    #         token: Authentication token
            
    #     Returns:
    #         Dict with success status and user data or error
    #     """
    #     try:
    #         decoded = decode_token(token)
    #         identity = decoded.get('sub')
    #         if identity is None:
    #             return VerifyTokenResultSchema(success=False, error='Invalid token payload')

    #         user = UserService.get_user_by_id(int(identity))
    #         if not user:
    #             return VerifyTokenResultSchema(success=False, error='User not found')

    #         return VerifyTokenResultSchema(success=True, user=AuthService.serialize_user(user), claims=decoded)
    #     except Exception as e:
    #         return VerifyTokenResultSchema(success=False, error=f'Token verification failed: {str(e)}')
