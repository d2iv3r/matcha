"""Relationship field types."""

from typing import Optional, Type, TYPE_CHECKING
from orm.fields.base import Field

if TYPE_CHECKING:
    from orm.core.model import Model


class ForeignKey(Field):
    """Foreign key relationship field."""

    def __init__(
        self,
        to: Type["Model"],
        on_delete: str = "CASCADE",
        related_name: Optional[str] = None,
        **kwargs
    ) -> None:
        """
        Initialize a foreign key field.

        Args:
            to: Target model class
            on_delete: Action on delete (CASCADE, SET_NULL, RESTRICT)
            related_name: Name for reverse relationship
            **kwargs: Additional field options
        """
        super().__init__(**kwargs)
        self.to = to
        self.on_delete = on_delete
        self.related_name = related_name

    def get_db_type(self) -> str:
        """Get SQL type for foreign key field."""
        return "INTEGER"


class ManyToMany(Field):
    """Many-to-many relationship field."""

    def __init__(
        self,
        to: Type["Model"],
        through: Optional[str] = None,
        related_name: Optional[str] = None,
        **kwargs
    ) -> None:
        """
        Initialize a many-to-many field.

        Args:
            to: Target model class
            through: Intermediate table name
            related_name: Name for reverse relationship
            **kwargs: Additional field options
        """
        super().__init__(**kwargs)
        self.to = to
        self.through = through
        self.related_name = related_name

    def get_db_type(self) -> str:
        """Many-to-many fields don't have a direct database type."""
        return ""
