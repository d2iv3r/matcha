"""Date and time field types."""

from datetime import date, datetime, time
from typing import Any
from orm.fields.base import Field


class DateField(Field):
    """Date field type."""

    def __init__(self, auto_now: bool = False, auto_now_add: bool = False, **kwargs) -> None:
        """
        Initialize a date field.

        Args:
            auto_now: Automatically update to current date on save
            auto_now_add: Automatically set to current date on creation
            **kwargs: Additional field options
        """
        super().__init__(**kwargs)
        self.auto_now = auto_now
        self.auto_now_add = auto_now_add

    def validate(self, value: Any) -> None:
        """Validate date value."""
        super().validate(value)
        if value is not None and not isinstance(value, date):
            from orm.exceptions import ValidationError
            raise ValidationError(f"Value must be a date, got {type(value)}")

    def get_db_type(self) -> str:
        """Get SQL type for date field."""
        return "DATE"


class DateTimeField(Field):
    """DateTime field type."""

    def __init__(self, auto_now: bool = False, auto_now_add: bool = False, **kwargs) -> None:
        """
        Initialize a datetime field.

        Args:
            auto_now: Automatically update to current datetime on save
            auto_now_add: Automatically set to current datetime on creation
            **kwargs: Additional field options
        """
        super().__init__(**kwargs)
        self.auto_now = auto_now
        self.auto_now_add = auto_now_add

    def validate(self, value: Any) -> None:
        """Validate datetime value."""
        super().validate(value)
        if value is not None and not isinstance(value, datetime):
            from orm.exceptions import ValidationError
            raise ValidationError(f"Value must be a datetime, got {type(value)}")

    def get_db_type(self) -> str:
        """Get SQL type for datetime field."""
        return "TIMESTAMP"


class TimeField(Field):
    """Time field type."""

    def validate(self, value: Any) -> None:
        """Validate time value."""
        super().validate(value)
        if value is not None and not isinstance(value, time):
            from orm.exceptions import ValidationError
            raise ValidationError(f"Value must be a time, got {type(value)}")

    def get_db_type(self) -> str:
        """Get SQL type for time field."""
        return "TIME"
