"""Numeric field types."""

from typing import Any, Optional
from orm.fields.base import Field


class IntegerField(Field):
    """Integer field type."""

    def __init__(self, min_value: Optional[int] = None, max_value: Optional[int] = None, **kwargs) -> None:
        """
        Initialize an integer field.

        Args:
            min_value: Minimum allowed value
            max_value: Maximum allowed value
            **kwargs: Additional field options
        """
        print(f"IngteerField: min_value={min_value}, max_value={max_value}")
        super().__init__(**kwargs)
        self.min_value = min_value
        self.max_value = max_value

    def validate(self, value: Any) -> None:
        """Validate integer value."""
        super().validate(value)
        if value is not None:
            if not isinstance(value, int):
                from orm.exceptions import ValidationError
                raise ValidationError(f"Value must be an integer, got {type(value)}")
            if self.min_value is not None and value < self.min_value:
                from orm.exceptions import ValidationError
                raise ValidationError(f"Value must be >= {self.min_value}")
            if self.max_value is not None and value > self.max_value:
                from orm.exceptions import ValidationError
                raise ValidationError(f"Value must be <= {self.max_value}")

    def get_db_type(self) -> str:
        """Get SQL type for integer field."""
        if self.auto_increment:
            return "SERIAL" if not self.primary_key else "SERIAL PRIMARY KEY"
        return "INTEGER"


class FloatField(Field):
    """Float field type."""

    def validate(self, value: Any) -> None:
        """Validate float value."""
        super().validate(value)
        if value is not None and not isinstance(value, (int, float)):
            from orm.exceptions import ValidationError
            raise ValidationError(f"Value must be a number, got {type(value)}")

    def get_db_type(self) -> str:
        """Get SQL type for float field."""
        return "REAL"


class DecimalField(Field):
    """Decimal field type for precise numeric values."""

    def __init__(self, max_digits: int = 10, decimal_places: int = 2, **kwargs) -> None:
        """
        Initialize a decimal field.

        Args:
            max_digits: Maximum number of digits
            decimal_places: Number of decimal places
            **kwargs: Additional field options
        """
        super().__init__(**kwargs)
        self.max_digits = max_digits
        self.decimal_places = decimal_places

    def get_db_type(self) -> str:
        """Get SQL type for decimal field."""
        return f"NUMERIC({self.max_digits}, {self.decimal_places})"
