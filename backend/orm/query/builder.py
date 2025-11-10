"""SQL query builder."""

from typing import Any, Dict, List, Optional, Tuple


class QueryBuilder:
    """
    SQL query builder for constructing database queries.

    Provides methods to build SELECT, INSERT, UPDATE, and DELETE queries.
    """

    def __init__(self, table_name: str) -> None:
        """
        Initialize query builder.

        Args:
            table_name: Name of the database table
        """
        self.table_name = table_name
        self._select_fields: List[str] = ["*"]
        self._where_clauses: List[str] = []
        self._where_params: List[Any] = []
        self._order_by: List[str] = []
        self._limit: Optional[int] = None
        self._offset: Optional[int] = None
        self._joins: List[str] = []

    def select(self, *fields: str) -> "QueryBuilder":
        """
        Set fields to select.

        Args:
            *fields: Field names to select

        Returns:
            QueryBuilder instance
        """
        self._select_fields = list(fields) if fields else ["*"]
        return self

    def where(self, condition: str, *params: Any) -> "QueryBuilder":
        """
        Add WHERE clause.

        Args:
            condition: SQL condition
            *params: Query parameters

        Returns:
            QueryBuilder instance
        """
        self._where_clauses.append(condition)
        self._where_params.extend(params)
        return self

    def order_by(self, field: str, direction: str = "ASC") -> "QueryBuilder":
        """
        Add ORDER BY clause.

        Args:
            field: Field name
            direction: Sort direction (ASC or DESC)

        Returns:
            QueryBuilder instance
        """
        self._order_by.append(f"{field} {direction}")
        return self

    def limit(self, count: int) -> "QueryBuilder":
        """
        Set LIMIT.

        Args:
            count: Maximum number of results

        Returns:
            QueryBuilder instance
        """
        self._limit = count
        return self

    def offset(self, count: int) -> "QueryBuilder":
        """
        Set OFFSET.

        Args:
            count: Number of results to skip

        Returns:
            QueryBuilder instance
        """
        self._offset = count
        return self

    def join(self, table: str, on_condition: str, join_type: str = "INNER") -> "QueryBuilder":
        """
        Add JOIN clause.

        Args:
            table: Table to join
            on_condition: JOIN condition
            join_type: Type of join (INNER, LEFT, RIGHT, FULL)

        Returns:
            QueryBuilder instance
        """
        self._joins.append(f"{join_type} JOIN {table} ON {on_condition}")
        return self

    def build_select(self) -> Tuple[str, List[Any]]:
        """
        Build SELECT query.

        Returns:
            Tuple of (query string, parameters)
        """
        fields = ", ".join(self._select_fields)
        query = f"SELECT {fields} FROM {self.table_name}"

        if self._joins:
            query += " " + " ".join(self._joins)

        if self._where_clauses:
            where = " AND ".join(self._where_clauses)
            query += f" WHERE {where}"

        if self._order_by:
            query += " ORDER BY " + ", ".join(self._order_by)

        if self._limit is not None:
            query += f" LIMIT {self._limit}"

        if self._offset is not None:
            query += f" OFFSET {self._offset}"

        return query, self._where_params

    def build_insert(self, data: Dict[str, Any]) -> Tuple[str, List[Any]]:
        """
        Build INSERT query.

        Args:
            data: Field-value pairs to insert

        Returns:
            Tuple of (query string, parameters)
        """
        fields = ", ".join(data.keys())
        placeholders = ", ".join(["%s"] * len(data))
        query = f"INSERT INTO {self.table_name} ({fields}) VALUES ({placeholders}) RETURNING *"
        return query, list(data.values())

    def build_update(self, data: Dict[str, Any]) -> Tuple[str, List[Any]]:
        """
        Build UPDATE query.

        Args:
            data: Field-value pairs to update

        Returns:
            Tuple of (query string, parameters)
        """
        set_clause = ", ".join([f"{k} = %s" for k in data.keys()])
        query = f"UPDATE {self.table_name} SET {set_clause}"

        params = list(data.values())

        if self._where_clauses:
            where = " AND ".join(self._where_clauses)
            query += f" WHERE {where}"
            params.extend(self._where_params)

        query += " RETURNING *"
        return query, params

    def build_delete(self) -> Tuple[str, List[Any]]:
        """
        Build DELETE query.

        Returns:
            Tuple of (query string, parameters)
        """
        query = f"DELETE FROM {self.table_name}"

        if self._where_clauses:
            where = " AND ".join(self._where_clauses)
            query += f" WHERE {where}"

        return query, self._where_params
