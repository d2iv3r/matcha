"""Base Model class for ORM."""

from typing import Any, Dict, List, Optional, Type
# from orm.query.queryset import QuerySet
from orm.fields.base import Field


class ModelMeta(type):
    """Metaclass for Model to handle field registration."""

    def __new__(mcs, name: str, bases: tuple, attrs: dict) -> Type:
        """Create a new Model class with field registration."""
        print(f"ModelMeta: Creating class {name}")
        if name == "Model":
            return super().__new__(mcs, name, bases, attrs)

        # Collect fields from the class definition
        fields = {}
        for key, value in list(attrs.items()):
            if isinstance(value, Field):
                fields[key] = value
                value.name = key

        attrs["_fields"] = fields
        attrs["_table_name"] = attrs.get("_table_name", name.lower())

        return super().__new__(mcs, name, bases, attrs)


class Model(metaclass=ModelMeta):
    """
    Base Model class for all database models.

    Example:
        class User(Model):
            _table_name = "users"

            id = IntegerField(primary_key=True, auto_increment=True)
            username = StringField(max_length=50, unique=True)
            email = StringField(max_length=100)
            created_at = DateTimeField(auto_now_add=True)
    """

    _table_name: str = ""
    _fields: Dict[str, Field] = {}
    _database = None

    def __init__(self, **kwargs: Any) -> None:
        """Initialize a model instance with field values."""
        print(f"Model class: Initializing {self.__class__.__name__} with {kwargs}")
        self._data: Dict[str, Any] = {}
        self._changed_fields: set = set()

        for field_name, field in self._fields.items():
            if field_name in kwargs:
                setattr(self, field_name, kwargs[field_name])
            elif field.default is not None:
                setattr(self, field_name, field.default)
            else:
                self._data[field_name] = None

    # def __setattr__(self, name: str, value: Any) -> None:
    #     """Track field changes."""
    #     if name.startswith("_"):
    #         super().__setattr__(name, value)
    #     elif name in self._fields:
    #         self._data[name] = value
    #         if hasattr(self, "_changed_fields"):
    #             self._changed_fields.add(name)
    #     else:
    #         super().__setattr__(name, value)

    # def __getattribute__(self, name: str) -> Any:
    #     """Get field values from _data dictionary."""
    #     if name.startswith("_") or name in ["save", "delete", "objects"]:
    #         return super().__getattribute__(name)

    #     fields = super().__getattribute__("_fields")
    #     if name in fields:
    #         data = super().__getattribute__("_data")
    #         return data.get(name)

    #     return super().__getattribute__(name)

    # @classmethod
    # def objects(cls) -> QuerySet:
    #     """Return a QuerySet for this model."""
    #     return QuerySet(cls)

    # def save(self) -> "Model":
    #     """Save the model instance to the database."""
    #     # TODO: Implement save logic
    #     raise NotImplementedError("Save method not yet implemented")

    # def delete(self) -> None:
    #     """Delete the model instance from the database."""
    #     # TODO: Implement delete logic
    #     raise NotImplementedError("Delete method not yet implemented")

    # def to_dict(self) -> Dict[str, Any]:
    #     """Convert model instance to dictionary."""
    #     return {field: getattr(self, field) for field in self._fields}

    # def __repr__(self) -> str:
    #     """String representation of the model."""
    #     fields_str = ", ".join(
    #         f"{k}={v!r}" for k, v in self.to_dict().items()
    #     )
    #     return f"<{self.__class__.__name__}({fields_str})>"
