"""String field types."""

from typing import Any
from orm.fields.base import Field


class StringField(Field):
    """String field type with maximum length."""

    def __init__(self, max_length: int = 255, **kwargs) -> None:
        """
        Initialize a string field.

        Args:
            max_length: Maximum string length
            **kwargs: Additional field options
        """
        print(f"StringField: max_length={max_length}")
        super().__init__(**kwargs)
        self.max_length = max_length

    def validate(self, value: Any) -> None:
        """Validate string value."""
        super().validate(value)
        if value is not None:
            if not isinstance(value, str):
                from orm.exceptions import ValidationError
                raise ValidationError(f"Value must be a string, got {type(value)}")
            if len(value) > self.max_length:
                from orm.exceptions import ValidationError
                raise ValidationError(
                    f"String length must be <= {self.max_length}, got {len(value)}"
                )

    def get_db_type(self) -> str:
        """Get SQL type for string field."""
        return f"VARCHAR({self.max_length})"


class TextField(Field):
    """Text field type for unlimited text."""

    def validate(self, value: Any) -> None:
        """Validate text value."""
        super().validate(value)
        if value is not None and not isinstance(value, str):
            from orm.exceptions import ValidationError
            raise ValidationError(f"Value must be a string, got {type(value)}")

    def get_db_type(self) -> str:
        """Get SQL type for text field."""
        return "TEXT"


class EmailField(StringField):
    """Email field type with validation."""

    def __init__(self, **kwargs) -> None:
        """Initialize an email field."""
        kwargs.setdefault("max_length", 254)
        super().__init__(**kwargs)

    def validate(self, value: Any) -> None:
        """Validate email value."""
        super().validate(value)
        if value is not None:
            import re
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, value):
                from orm.exceptions import ValidationError
                raise ValidationError(f"Invalid email address: {value}")
