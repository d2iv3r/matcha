"""User data validation schemas."""

from datetime import datetime
from typing import Any, Dict, Optional, Tuple

from pydantic import BaseModel


class UserSchema(BaseModel):
    id: int | None = None
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    password_hash: str | None = None
    is_active: bool | None = None
    is_profile_complete: bool | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

def _validate_email(data: Dict[str, Any]) -> Optional[str]:
    if "email" not in data:
        return None
    email = data["email"]
    if "@" not in email or "." not in email.split("@")[-1]:
        return "Invalid email format"
    return None


def _validate_username(data: Dict[str, Any]) -> Optional[str]:
    if "username" not in data:
        return None
    username = data["username"]
    if len(username) < 3 or len(username) > 50:
        return "Username must be between 3 and 50 characters"
    if not username.replace("_", "").replace("-", "").isalnum():
        return "Username can only contain letters, numbers, hyphens and underscores"
    return None


def _validate_length(data: Dict[str, Any], field: str, max_length: int, label: str) -> Optional[str]:
    if field in data and len(data[field]) > max_length:
        return f"{label} must be less than {max_length} characters"
    return None


def validate_user_update(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    allowed_fields = ["username", "email", "first_name", "last_name", "bio"]

    if not any(field in data for field in allowed_fields):
        return False, "At least one field must be provided for update"

    for error in (
        _validate_email(data),
        _validate_username(data),
        _validate_length(data, "first_name", 100, "First name"),
        _validate_length(data, "last_name", 100, "Last name"),
        _validate_length(data, "bio", 500, "Bio"),
    ):
        if error:
            return False, error

    return True, None


def validate_user_search(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    if "query" not in data or not data["query"]:
        return False, "Search query is required"

    query = data["query"]
    if len(query) < 2:
        return False, "Search query must be at least 2 characters"

    return True, None