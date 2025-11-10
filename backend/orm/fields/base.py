"""Base Field class for all field types."""

from typing import Any, Optional, Callable
from unittest.mock import Base


class Field:
    """
    Base class for all field types

    All field types inherit from this class.
    """

    def __init__(
        self,
        primary_key: bool = False,
        unique: bool = False,
        null: bool = False,
        blank: bool = False,
        default: Optional[Any] = None,
        db_column: Optional[str] = None,
        validators: Optional[list[Callable]] = None,
        auto_increment: bool = False,
    ) -> None:
        """
        Initialize a field.

        Args:
            primary_key: Whether this field is a primary key
            unique: Whether this field must be unique
            null: Whether this field can be NULL
            default: Default value for this field
            db_column: Database column name (if different from field name)
            validators: List of validation functions
            auto_increment: Whether this field auto-increments
        """
        print(f"Field: primary_key={primary_key}, unique={unique}, null={null}, default={default}, db_column={db_column}, auto_increment={auto_increment}")
        self.primary_key = primary_key
        self.unique = unique
        self.null = null
        self.default = default
        self.db_column = db_column
        self.validators = validators or []
        self.auto_increment = auto_increment
        self.name: Optional[str] = None

    def validate(self, value: Any) -> None:
        """
        Validate field value.

        Args:
            value: Value to validate

        Raises:
            ValidationError: If value is invalid
        """
        if value is None and not self.null:
            from orm.exceptions import ValidationError
            raise ValidationError(f"Field {self.name} cannot be NULL")

        for validator in self.validators:
            validator(value)

    def to_db_value(self, value: Any) -> Any:
        """
        Convert Python value to database value.

        Args:
            value: Python value

        Returns:
            Database-compatible value
        """
        return value

    def to_python_value(self, value: Any) -> Any:
        """
        Convert database value to Python value.

        Args:
            value: Database value

        Returns:
            Python value
        """
        return value

    def get_db_type(self) -> str:
        """
        Get the SQL type for this field.

        Returns:
            SQL type string
        """
        raise NotImplementedError("Subclasses must implement get_db_type()")

    def __repr__(self) -> str:
        """String representation of the field."""
        return f"<{self.__class__.__name__}(name={self.name})>"
