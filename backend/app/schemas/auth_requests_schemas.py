"""Authentication data validation schemas."""

import re

from pydantic import BaseModel, Field, field_validator
from zxcvbn import zxcvbn

EMAIL_PATTERN = r"^[^@]+@[^@]+\.[^@]+$"
NAME_PATTERN = r"^[A-Za-z][A-Za-z ]*$"


def validate_password_strength(value: str) -> str:
    """Ensure password is not a common dictionary word and is strong enough."""
    results = zxcvbn(value)
    if results["score"] < 2:
        # Check if it's explicitly a dictionary match
        matches = results.get("sequence", [])
        for match in matches:
            if match.get("pattern") == "dictionary":
                raise ValueError("Password is too common or a dictionary word")

        if results["score"] < 2:
            raise ValueError("Password is too weak")
    return value


class RegistrationSchema(BaseModel):
    """Schema for user registration data."""

    username: str = Field(..., min_length=3, max_length=30, pattern=r"^[A-Za-z][A-Za-z0-9_-]+$")
    first_name: str = Field(..., min_length=3, max_length=30, pattern=NAME_PATTERN)
    last_name: str = Field(..., min_length=3, max_length=30, pattern=NAME_PATTERN)
    email: str = Field(..., pattern=EMAIL_PATTERN)
    password: str = Field(..., min_length=8, max_length=64, pattern=r"^[A-Za-z\d\W_]+$")

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        """Validate password strength."""
        return validate_password_strength(value)

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
        return re.sub(r"\s+", " ", value).strip()


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

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        """Validate password strength."""
        return validate_password_strength(value)


class PasswordChangeSchema(BaseModel):
    """Schema for password change data."""

    old_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        """Validate password strength."""
        return validate_password_strength(value)