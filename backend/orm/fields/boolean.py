"""Boolean field type."""

from typing import Any
from orm.fields.base import Field


class BooleanField(Field):
    """Boolean field type."""

    def validate(self, value: Any) -> None:
        """Validate boolean value."""
        super().validate(value)
        if value is not None and not isinstance(value, bool):
            from orm.exceptions import ValidationError
            raise ValidationError(f"Value must be a boolean, got {type(value)}")

    def to_db_value(self, value: Any) -> Any:
        """Convert boolean to database value."""
        if value is None:
            return None
        return bool(value)

    def get_db_type(self) -> str:
        """Get SQL type for boolean field."""
        return "BOOLEAN"
