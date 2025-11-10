"""Database connection and management."""

import os
from flask import Flask
from typing import Optional, Any, Dict
from contextlib import contextmanager
from psycopg2.pool import ThreadedConnectionPool
from psycopg2 import OperationalError
import psycopg2
from psycopg2.extras import RealDictCursor


class Database:
    """
    Database connection manager.

    Handles connection pooling and query execution.
    """

    def __init__(self, app: Flask) -> None:
        """
        Initialize database connection and pooling.

        Args:
            app: Flask application instance
        """
        self.connection_string = app.config.get("DATABASE_URL", os.environ.get("DATABASE_URL"))
        
        if not self.connection_string:
            raise ValueError("DATABASE_URL not configured")
        
        self._pool: Optional[ThreadedConnectionPool] = None
        self._connection = None
        self._initialize_pool(
            minconn=app.config.get("DB_POOL_MIN_CONN", 1),
            maxconn=app.config.get("DB_POOL_MAX_CONN", 10),
            connection_string=self.connection_string
        )

    def _initialize_pool(self, minconn: int, maxconn: int, connection_string: str) -> None:
        """Initialize the connection pool."""
        try:
            self._pool = ThreadedConnectionPool(
                minconn=minconn,
                maxconn=maxconn,
                dsn=connection_string,
            )
        except OperationalError as e:
            raise Exception("Failed to initialize connection pool") from e

    def connect(self) -> None:
        """Establish database connection."""
        if not self._connection or self._connection.closed:
            self._connection = psycopg2.connect(
                self.connection_string,
                cursor_factory=RealDictCursor
            )

    def disconnect(self) -> None:
        """Close database connection."""
        if self._connection and not self._connection.closed:
            self._connection.close()

    @contextmanager
    def get_cursor(self):
        """
        Context manager for database cursor.

        Yields:
            Database cursor for executing queries
        """
        self.connect()
        cursor = self._connection.cursor()
        try:
            yield cursor
            self._connection.commit()
        except Exception as e:
            self._connection.rollback()
            raise e
        finally:
            cursor.close()

    def execute(self, query: str, params: Optional[tuple] = None) -> Any:
        """
        Execute a SQL query.

        Args:
            query: SQL query string
            params: Query parameters

        Returns:
            Query result
        """
        with self.get_cursor() as cursor:
            cursor.execute(query, params or ())
            try:
                return cursor.fetchall()
            except psycopg2.ProgrammingError:
                return None

    def execute_one(self, query: str, params: Optional[tuple] = None) -> Optional[Dict]:
        """
        Execute a SQL query and return one result.

        Args:
            query: SQL query string
            params: Query parameters

        Returns:
            Single query result or None
        """
        with self.get_cursor() as cursor:
            cursor.execute(query, params or ())
            try:
                return cursor.fetchone()
            except psycopg2.ProgrammingError:
                return None

    def __enter__(self):
        """Context manager entry."""
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.disconnect()
