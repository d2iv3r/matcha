"""Validation utility functions."""

import re
from typing import Any
from orm.exceptions import ValidationError


def validate_email(value: str) -> None:
    """
    Validate email address.

    Args:
        value: Email address to validate

    Raises:
        ValidationError: If email is invalid
    """
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, value):
        raise ValidationError(f"Invalid email address: {value}")


def validate_length(min_length: int = 0, max_length: int = None):
    """
    Create a length validator.

    Args:
        min_length: Minimum length
        max_length: Maximum length

    Returns:
        Validator function
    """
    def validator(value: str) -> None:
        if len(value) < min_length:
            raise ValidationError(
                f"Value must be at least {min_length} characters"
            )
        if max_length is not None and len(value) > max_length:
            raise ValidationError(
                f"Value must be at most {max_length} characters"
            )
    return validator


def validate_range(min_value: Any = None, max_value: Any = None):
    """
    Create a range validator.

    Args:
        min_value: Minimum value
        max_value: Maximum value

    Returns:
        Validator function
    """
    def validator(value: Any) -> None:
        if min_value is not None and value < min_value:
            raise ValidationError(f"Value must be >= {min_value}")
        if max_value is not None and value > max_value:
            raise ValidationError(f"Value must be <= {max_value}")
    return validator
