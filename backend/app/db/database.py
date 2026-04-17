"""Database infrastructure based on psycopg2."""

import logging
import os
from contextlib import contextmanager
from typing import Any, Dict, Generator, Iterable, Optional

from flask import Flask
from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool

from app.db.migrations import migrate_database

logger = logging.getLogger(__name__)


class DatabaseManager:
    """Manage PostgreSQL connections and query execution."""

    def __init__(
        self,
        database_url: str,
        min_connections: int = 1,
        max_connections: int = 5,
    ) -> None:
        self.database_url = database_url
        self.min_connections = min_connections
        self.max_connections = max_connections
        self.pool: Optional[SimpleConnectionPool] = None

    def connect(self) -> None:
        """Create a PostgreSQL connection pool."""
        if self.pool is not None:
            return

        self.pool = SimpleConnectionPool(
            self.min_connections,
            self.max_connections,
            self.database_url,
        )

        if self.pool is None:
            raise RuntimeError("Failed to initialize database connection pool")

    def disconnect(self) -> None:
        """Close all pooled database connections."""
        if self.pool is not None:
            self.pool.closeall()
            self.pool = None

    def _get_connection(self):
        """Acquire a connection from the pool."""
        if self.pool is None:
            raise RuntimeError("Database pool is not initialized")
        return self.pool.getconn()

    def _release_connection(self, connection) -> None:
        """Return a connection to the pool."""
        if self.pool is not None:
            self.pool.putconn(connection)

    def test_connection(self) -> None:
        """Validate connectivity to PostgreSQL."""
        self.fetch_one("SELECT 1 AS ok")

    def execute(
        self,
        query: str,
        params: Optional[Iterable[Any]] = None,
        *,
        commit: bool = True,
    ) -> int:
        """Execute an INSERT/UPDATE/DELETE statement."""
        connection = self._get_connection()
        try:
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                affected_rows = cursor.rowcount
            if commit:
                connection.commit()
            return affected_rows
        except Exception:
            connection.rollback()
            raise
        finally:
            self._release_connection(connection)

    def fetch_one(
        self,
        query: str,
        params: Optional[Iterable[Any]] = None,
    ) -> Optional[Dict[str, Any]]:
        """Execute a query and return one row as a dictionary."""
        connection = self._get_connection()
        try:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, params)
                row = cursor.fetchone()
            return dict(row) if row else None
        finally:
            self._release_connection(connection)

    def fetch_all(
        self,
        query: str,
        params: Optional[Iterable[Any]] = None,
    ) -> list[Dict[str, Any]]:
        """Execute a query and return all rows as dictionaries."""
        connection = self._get_connection()
        try:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, params)
                rows = cursor.fetchall()
            return [dict(row) for row in rows]
        finally:
            self._release_connection(connection)

    def execute_returning(
        self,
        query: str,
        params: Optional[Iterable[Any]] = None,
    ) -> Optional[Dict[str, Any]]:
        """Execute a write query with RETURNING and commit the transaction."""
        connection = self._get_connection()
        try:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, params)
                row = cursor.fetchone()
            connection.commit()
            return dict(row) if row else None
        except Exception:
            connection.rollback()
            raise
        finally:
            self._release_connection(connection)

    @contextmanager
    def transaction(self) -> Generator[Any, None, None]:
        """Provide a cursor within a transaction boundary."""
        connection = self._get_connection()
        try:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                yield cursor
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            self._release_connection(connection)


def init_db(app: Flask) -> None:
    """Initialize PostgreSQL manager and attach it to the Flask app."""
    database_url = app.config.get("DATABASE_URL")
    if database_url is None:
        database_url = os.environ.get("DATABASE_URL")

    if not database_url:
        logger.warning("[DB] DATABASE_URL is not configured; skipping database initialization")
        app.db_manager = None
        return

    manager = DatabaseManager(
        database_url=database_url,
        min_connections=app.config.get("DB_POOL_MIN_CONN", 1),
        max_connections=app.config.get("DB_POOL_MAX_CONN", 10),
    )

    manager.connect()
    manager.test_connection()
    app.db_manager = manager
    logger.info("[DB] Database connection pool initialized successfully")

    try:
        migrate_database(app, manager)
    except Exception as exc:
        logger.error("[DB] Failed to apply SQL migrations: %s", exc)
        raise