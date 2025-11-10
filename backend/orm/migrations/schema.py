"""Schema definition and manipulation."""

from typing import Dict, List, Any


class Schema:
    """
    Schema builder for creating and modifying database schemas.

    Provides a fluent API for defining table structures.
    """

    def __init__(self, table_name: str) -> None:
        """
        Initialize schema builder.

        Args:
            table_name: Name of the table
        """
        self.table_name = table_name
        self.columns: List[Dict[str, Any]] = []
        self.indexes: List[Dict[str, Any]] = []
        self.constraints: List[str] = []

    def add_column(
        self,
        name: str,
        type: str,
        nullable: bool = True,
        default: Any = None,
        unique: bool = False
    ) -> "Schema":
        """
        Add a column to the schema.

        Args:
            name: Column name
            type: SQL type
            nullable: Whether column can be NULL
            default: Default value
            unique: Whether column must be unique

        Returns:
            Schema instance
        """
        column = {
            "name": name,
            "type": type,
            "nullable": nullable,
            "default": default,
            "unique": unique,
        }
        self.columns.append(column)
        return self

    def add_index(self, columns: List[str], unique: bool = False) -> "Schema":
        """
        Add an index to the schema.

        Args:
            columns: Columns to index
            unique: Whether index should be unique

        Returns:
            Schema instance
        """
        index = {
            "columns": columns,
            "unique": unique,
        }
        self.indexes.append(index)
        return self

    def add_foreign_key(
        self,
        column: str,
        references_table: str,
        references_column: str,
        on_delete: str = "CASCADE"
    ) -> "Schema":
        """
        Add a foreign key constraint.

        Args:
            column: Column name
            references_table: Referenced table
            references_column: Referenced column
            on_delete: Action on delete

        Returns:
            Schema instance
        """
        constraint = (
            f"FOREIGN KEY ({column}) REFERENCES {references_table}({references_column}) "
            f"ON DELETE {on_delete}"
        )
        self.constraints.append(constraint)
        return self

    def build_create_table(self) -> str:
        """
        Build CREATE TABLE SQL.

        Returns:
            SQL string
        """
        column_defs = []
        for col in self.columns:
            col_def = f"{col['name']} {col['type']}"
            if not col['nullable']:
                col_def += " NOT NULL"
            if col['default'] is not None:
                col_def += f" DEFAULT {col['default']}"
            if col['unique']:
                col_def += " UNIQUE"
            column_defs.append(col_def)

        all_defs = column_defs + self.constraints
        return f"CREATE TABLE {self.table_name} ({', '.join(all_defs)})"
