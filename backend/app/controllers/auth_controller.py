"""Controller for authentication-related operations."""

from operator import is_

from flask import make_response, request
from flask_jwt_extended import create_access_token, create_refresh_token, set_refresh_cookies, set_access_cookies, unset_jwt_cookies

from app.schemas.auth_requests_schemas import (
    LoginSchema,
    PasswordResetConfirmSchema,
    PasswordResetSchema,
    RegistrationSchema,
)
from app.utils.app_error import BadRequestError
from app.services.auth_service import AuthService
from app.utils.mail import MailService
from app.extensions import oauth
from app.utils.response import created, error, success


class AuthController:
    """Controller for authentication-related operations."""

    @staticmethod
    def register_user():
        """Handle user registration."""
        user_data = RegistrationSchema.model_validate(request.get_json())
        created_user = AuthService.register_user(user_data)

        token, expire_at = AuthService.generate_email_verification_token(int(created_user.id))
        verification_email_sent = MailService.send_verification_email(
            recipient=created_user.email,
            username=created_user.username,
            token=token,
        )
        return created(
            message="User registered successfully",
            data={
                "user": {
                    "id": created_user.id,
                    "username": created_user.username,
                    "email": created_user.email,
                    "is_active": created_user.is_active,
                },
                "verification_email_sent": verification_email_sent,
                "verification_token_expires_at": expire_at.isoformat() if expire_at else None,
            },
        )

    @staticmethod
    def verify_email():
        """Verify an email token and activate the user."""
        token = request.args.get("token", "")
        if not token:
            raise BadRequestError("Verification token is required")

        AuthService.verify_email_token(token)
        return success(message="Email verified successfully", data={})
        
    @staticmethod
    def login():
        """Handle user login."""
        data = LoginSchema.model_validate(request.get_json())
        user = AuthService.authenticate(data)

        if user is None:
            raise BadRequestError("Wrong username or password")
        if user.is_active is False:
            raise BadRequestError("Account is not active. Please verify your email.")

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        response, status = success(
            message="Login successful",
            data = {
                'username': user.username,
                'is_active': user.is_active,
                'is_profile_complete': user.is_profile_complete
            })

        set_refresh_cookies(response, refresh_token)
        set_access_cookies(response, access_token)

        return response, status
    
    @staticmethod
    def logout():
        """Clear refresh cookies and end the browser session."""
        response, status = success(message="Logout successful", data={})
        unset_jwt_cookies(response)
        return response, status
    
    @staticmethod
    def request_password_reset():
        """Send a password reset email with a verification token link."""
        data = PasswordResetSchema.model_validate(request.get_json())
        AuthService.request_password_reset(data.email)
        return success(message="Password reset email sent", data={})

    @staticmethod
    def reset_password():
        """Reset the user's password using a valid reset token."""
        data = PasswordResetConfirmSchema.model_validate(request.get_json())
        print(f"Received password reset request with token: {data.token}")
        AuthService.reset_password(data.token, data.new_password)
        return success(message="Password reset successful", data={})

    @staticmethod
    def oauth_42_login():
        """Redirect to 42 Intra for authentication."""
        from flask import current_app
        redirect_uri = request.args.get("redirect_uri") or current_app.config["INTRA42_REDIRECT_URI"]
        # Store redirect_uri in session if needed, but here we'll just use the default or one from config
        return oauth.intra42.authorize_redirect(redirect_uri)

    @staticmethod
    def oauth_42_callback():
        """Handle 42 Intra OAuth callback."""
        try:
            token = oauth.intra42.authorize_access_token()
            resp = oauth.intra42.get("v2/me", token=token)
            
            if not resp.ok:
                raise BadRequestError(f"Failed to fetch user info from 42 Intra: {resp.status_code} {resp.text}")
                
            user_info = resp.json()
        except Exception as e:
            if isinstance(e, BadRequestError):
                raise e
            raise BadRequestError(f"Error during OAuth callback: {str(e)}")

        # Normalize user data
        normalized_data = {
            "email": user_info.get("email"),
            "username": user_info.get("login"),
            "first_name": user_info.get("first_name"),
            "last_name": user_info.get("last_name"),
            "avatar": user_info.get("image", {}).get("link"),
            "provider_id": user_info.get("id"),
        }
        user = AuthService.handle_oauth_login("intra42", normalized_data)

        # Issue JWT
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        # Determine redirect target based on profile completeness
        from flask import current_app
        import urllib.parse
        base_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
        if not user.is_profile_complete:
            # Pass OAuth info to onboarding to skip avatar etc.
            params = {
                "oauth": "intra42",
                "first_name": normalized_data["first_name"] or "",
                "last_name": normalized_data["last_name"] or "",
                "avatar": normalized_data["avatar"] or ""
            }
            query = urllib.parse.urlencode({k: v for k, v in params.items() if v})
            frontend_url = f"{base_url}/step1?{query}"
        else:
            frontend_url = f"{base_url}/home"
            
        response = make_response("", 302)
        response.headers["Location"] = frontend_url

        set_refresh_cookies(response, refresh_token)
        set_access_cookies(response, access_token)

        return response

    # @staticmethod
    # @jwt_required()
    # def me():
    #     """Get details of the currently authenticated user."""
    #     user_id = get_jwt_identity()
    #     user = AuthService.get_user_by_identity(user_id)
    #     if not user:
    #         return error("User not found", 404)
    #     return success({"user": AuthService.serialize_user(user)}, 200)

    # @staticmethod
    # @jwt_required(refresh=True)
    # def refresh():
    #     """Issue a new access token from a valid refresh token."""
    #     user_id = get_jwt_identity()
    #     user = AuthService.get_user_by_identity(user_id)
    #     if not user:
    #         return error("User not found", 404)

    #     access_token = AuthService.issue_access_token(user)
    #     response, status = success({"message": "Token refreshed successfully"}, 200)
    #     response.set_cookie(
    #         key="access_token_cookie",
    #         value=access_token,
    #         httponly=True,
    #         secure=request.environ.get("wsgi.url_scheme") == "https",
    #         samesite="Lax",
    #         path="/",
    #     )
    #     return response, status