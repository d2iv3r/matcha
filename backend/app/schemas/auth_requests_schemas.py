"""Authentication data validation schemas."""

import re

from pydantic import BaseModel, Field, field_validator

EMAIL_PATTERN = r"^[^@]+@[^@]+\.[^@]+$"
NAME_PATTERN = r"^[A-Za-z][A-Za-z ]*$"


class RegistrationSchema(BaseModel):
    """Schema for user registration data."""

    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[A-Za-z][A-Za-z0-9_-]+$")
    first_name: str = Field(None, min_length=3, max_length=30, pattern=NAME_PATTERN)
    last_name: str = Field(None, min_length=3, max_length=30, pattern=NAME_PATTERN)
    email: str = Field(..., pattern=EMAIL_PATTERN)
    password: str = Field(..., min_length=8, pattern=r"^[A-Za-z\d\W_]+$")

    @field_validator("username")
    @classmethod
    def validate_username_min_letters(cls, value: str) -> str:
        """Require username to contain at least three alphabetic characters."""
        if len(re.findall(r"[A-Za-z]", value)) < 3:
            raise ValueError("Username must contain at least three letters")
        return value

    @field_validator("first_name", "last_name", mode="before")
    @classmethod
    def strip_name_whitespace(cls, value: str) -> str:
        """Trim leading/trailing whitespace from name fields."""
        if value is None:
            return value
        return value.strip()


class LoginSchema(BaseModel):
    """Schema for user login data."""

    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[A-Za-z][A-Za-z0-9_-]+$")
    password: str = Field(..., min_length=8)

    @field_validator("username")
    @classmethod
    def validate_username_min_letters(cls, value: str) -> str:
        """Require username to contain at least three alphabetic characters."""
        if len(re.findall(r"[A-Za-z]", value)) < 3:
            raise ValueError("Username must contain at least three letters")
        return value


class PasswordResetSchema(BaseModel):
    """Schema for password reset data."""

    email: str = Field(..., pattern=EMAIL_PATTERN)


class PasswordResetConfirmSchema(BaseModel):
    """Schema for password reset confirmation data."""

    token: str = Field(...)
    new_password: str = Field(..., min_length=8)


class PasswordChangeSchema(BaseModel):
    """Schema for password change data."""

    old_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)