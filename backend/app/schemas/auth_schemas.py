"""Authentication data validation schemas."""

from pydantic import BaseModel, Field

EMAIL_PATTERN = r"^[^@]+@[^@]+\.[^@]+$"


class RegistrationSchema(BaseModel):
    """Schema for user registration data."""

    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_-]+$")
    first_name: str = Field(None, max_length=150)
    last_name: str = Field(None, max_length=150)
    email: str = Field(..., pattern=EMAIL_PATTERN)
    password: str = Field(..., min_length=8)


class LoginSchema(BaseModel):
    """Schema for user login data."""

    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_-]+$")
    password: str = Field(..., min_length=8)


class PasswordResetSchema(BaseModel):
    """Schema for password reset data."""

    email: str = Field(..., pattern=EMAIL_PATTERN)


class PasswordResetConfirmSchema(BaseModel):
    """Schema for password reset confirmation data."""

    token: str = Field(..., min_length=16)
    new_password: str = Field(..., min_length=8)


class PasswordChangeSchema(BaseModel):
    """Schema for password change data."""

    old_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)