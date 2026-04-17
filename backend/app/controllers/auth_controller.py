"""Controller for authentication-related operations."""

from flask import jsonify, make_response, request
from flask_jwt_extended import jwt_required, get_jwt_identity, set_refresh_cookies, unset_jwt_cookies
from pydantic import ValidationError

from app.schemas.auth_schemas import (
    LoginSchema,
    PasswordResetConfirmSchema,
    PasswordResetSchema,
    RegistrationSchema,
)

from app.utils.app_error import AppError, BadRequestError
from app.services.auth_service import AuthService


class AuthController:
    """Controller for authentication-related operations."""

    @staticmethod
    def register_user():
        """Handle user registration."""
        try:
            user_data = RegistrationSchema.model_validate(request.get_json())
            result = AuthService.register_user(user_data)

            return result, 201
        except AppError as e:
            payload = {"success": False, "error": e.message}
            if getattr(e, "details", None) is not None:
                payload["errors"] = e.details
            return payload, e.status_code
        except ValidationError as e:
            return {"success": False, "errors": e.errors()}, 400
        except BadRequestError as e:
            return {"success": False, "errors": [e.message]}, 400
        except Exception as e:
            return {"success": False, "errors": [str(e)]}, 500
        
    @staticmethod
    def login():
        """Handle user login."""
        try:
            data = LoginSchema.model_validate(request.get_json())
            result = AuthService.authenticate(data)

            if result.get("success"):
                response = make_response(jsonify({
                    "success": True,
                    "message": "Login successful",
                    "user": result.get("user"),
                    "access_token": result.get("access_token"),
                    "token_type": "Bearer"
                }), 200)
                set_refresh_cookies(response, result.get("refresh_token"))
                return response
            else:
                return {"success": False, "error": result.get("error")}, 401
        except AppError as e:
            payload = {"success": False, "error": e.message}
            if getattr(e, "details", None) is not None:
                payload["errors"] = e.details
            return payload, e.status_code
        except ValidationError as e:
            return {"success": False, "errors": e.errors()}, 400
        except BadRequestError as e:
            return {"success": False, "errors": [e.message]}, 400
        except Exception as e:
            return {"success": False, "errors": [str(e)]}, 500

    @staticmethod
    @jwt_required()
    def me():
        """Get details of the currently authenticated user."""
        try:
            user_id = get_jwt_identity()
            user = AuthService.get_user_by_identity(user_id)
            if not user:
                return {"success": False, "error": "User not found"}, 404

            return {
                "success": True,
                "user_id": int(user_id),
                "user": AuthService.serialize_user(user)
            }, 200
        except Exception as e:
            return {"success": False, "errors": [str(e)]}, 500

    @staticmethod
    @jwt_required(refresh=True)
    def refresh():
        """Issue a new access token from a valid refresh token."""
        try:
            user_id = get_jwt_identity()
            user = AuthService.get_user_by_identity(user_id)
            if not user:
                return {"success": False, "error": "User not found"}, 404

            access_token = AuthService.issue_access_token(user)
            refresh_token = AuthService.issue_refresh_token(user)

            response = make_response(jsonify({
                "success": True,
                "access_token": access_token,
                "token_type": "Bearer"
            }), 200)
            set_refresh_cookies(response, refresh_token)
            return response

        except Exception as e:
            return {"success": False, "errors": [str(e)]}, 500

    @staticmethod
    @jwt_required(refresh=True)
    def logout():
        """Clear refresh cookies and end the browser session."""
        try:
            response = make_response(jsonify({"success": True, "message": "Logout successful"}), 200)
            unset_jwt_cookies(response)
            return response

        except Exception as e:
            return {"success": False, "errors": [str(e)]}, 500

    @staticmethod
    def request_password_reset():
        """Send a password reset email with a verification token link."""
        try:
            data = PasswordResetSchema.model_validate(request.get_json())
            result = AuthService.request_password_reset(data.email)

            if result.get("success"):
                return result, 200
            return result, 400
        except AppError as e:
            payload = {"success": False, "error": e.message}
            if getattr(e, "details", None) is not None:
                payload["errors"] = e.details
            return payload, e.status_code
        except ValidationError as e:
            return {"success": False, "errors": e.errors()}, 400
        except BadRequestError as e:
            return {"success": False, "errors": [e.message]}, 400
        except Exception as e:
            return {"success": False, "errors": [str(e)]}, 500

    @staticmethod
    def reset_password():
        """Reset the user's password using a valid reset token."""
        try:
            data = PasswordResetConfirmSchema.model_validate(request.get_json())
            result = AuthService.reset_password(data.token, data.new_password)

            if result.get("success"):
                return result, 200
            return result, 400
        except AppError as e:
            payload = {"success": False, "error": e.message}
            if getattr(e, "details", None) is not None:
                payload["errors"] = e.details
            return payload, e.status_code
        except ValidationError as e:
            return {"success": False, "errors": e.errors()}, 400
        except BadRequestError as e:
            return {"success": False, "errors": [e.message]}, 400
        except Exception as e:
            return {"success": False, "errors": [str(e)]}, 500
