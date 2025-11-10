"""Database migration manager."""

from typing import List, Type
from orm.core.model import Model


class Migrator:
    """
    Manages database migrations.

    Creates and applies schema changes based on model definitions.
    """

    def __init__(self, database) -> None:
        """
        Initialize migrator.

        Args:
            database: Database instance
        """
        self.database = database

    def create_tables(self, models: List[Type[Model]]) -> None:
        """
        Create database tables for models.

        Args:
            models: List of model classes
        """
        for model in models:
            self._create_table(model)

    def _create_table(self, model: Type[Model]) -> None:
        """
        Create a database table for a model.

        Args:
            model: Model class
        """
        table_name = model._table_name
        fields = []

        for field_name, field in model._fields.items():
            column_name = field.db_column or field_name
            field_type = field.get_db_type()

            constraints = []
            if field.primary_key:
                constraints.append("PRIMARY KEY")
            if field.unique:
                constraints.append("UNIQUE")
            if not field.null:
                constraints.append("NOT NULL")

            field_def = f"{column_name} {field_type}"
            if constraints:
                field_def += " " + " ".join(constraints)

            fields.append(field_def)

        create_sql = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(fields)})"
        self.database.execute(create_sql)

    def drop_table(self, model: Type[Model]) -> None:
        """
        Drop a database table.

        Args:
            model: Model class
        """
        table_name = model._table_name
        drop_sql = f"DROP TABLE IF EXISTS {table_name}"
        self.database.execute(drop_sql)

    def add_column(self, model: Type[Model], field_name: str) -> None:
        """
        Add a column to a table.

        Args:
            model: Model class
            field_name: Name of the field to add
        """
        # TODO: Implement add column logic
        raise NotImplementedError("Add column not yet implemented")

    def drop_column(self, model: Type[Model], field_name: str) -> None:
        """
        Drop a column from a table.

        Args:
            model: Model class
            field_name: Name of the field to drop
        """
        # TODO: Implement drop column logic
        raise NotImplementedError("Drop column not yet implemented")
