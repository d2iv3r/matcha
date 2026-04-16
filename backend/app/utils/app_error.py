"""Application-specific error classes."""

from typing import Any


class AppError(Exception):
    """Base class for application-specific errors."""

    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


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
        super().__init__(message="Validation failed", status_code=422)
        self.details = errors