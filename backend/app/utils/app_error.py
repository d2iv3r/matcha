"""Application-specific error classes."""

from typing import Any

from pydantic import ValidationError as PydanticValidationError
from werkzeug.exceptions import HTTPException

from app.utils.response import error


class AppError(Exception):
    """Base class for application-specific errors."""

    def __init__(self, message: str, status_code: int = 400, details: Any | None = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details


class NotFoundError(AppError):
    def __init__(self, resource: str, identifier: Any = None):
        message = f"{resource} not found"
        if identifier:
            message += f": {identifier}"
        super().__init__(message=message, status_code=404)


class BadRequestError(AppError):
    def __init__(self, message: str = "Bad request"):
        super().__init__(message=message, status_code=400)


class ConflictError(AppError):
    def __init__(self, message: str = "Conflict"):
        super().__init__(message=message, status_code=409)


class UnauthorizedError(AppError):
    def __init__(self, message: str = "Authentication required"):
        super().__init__(message=message, status_code=401)


class ForbiddenError(AppError):
    def __init__(self, message: str = "Access denied"):
        super().__init__(message=message, status_code=403)


class ValidationError(AppError):
    """For request validation errors."""

    def __init__(self, errors: list):
        super().__init__(message="Validation failed", status_code=422, details=errors)


def register_error_handlers(app) -> None:
    @app.errorhandler(AppError)
    def handle_app_error(exc: AppError):
        return error(exc.message, exc.status_code, exc.details)

    @app.errorhandler(PydanticValidationError)
    def handle_pydantic_validation_error(exc: PydanticValidationError):
        return error("Validation failed", 400, exc.errors())

    @app.errorhandler(HTTPException)
    def handle_http_exception(exc: HTTPException):
        return error(exc.description, exc.code or 500)

    @app.errorhandler(Exception)
    def handle_generic_exception(_exc: Exception):
        return error("Internal server error", 500)