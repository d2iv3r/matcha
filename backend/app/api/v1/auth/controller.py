"""Controller for authentication-related operations."""

from flask import request
from pydantic import ValidationError

from .schemas import RegistrationSchema

from app.core.appError import AppError, BadRequestError
from .services import AuthService


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
