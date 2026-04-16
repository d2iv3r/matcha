"""Raw SQL migration runner for the application."""

from __future__ import annotations

import hashlib
import logging
import re
from pathlib import Path
from typing import Any

from flask import Flask


logger = logging.getLogger(__name__)

MIGRATION_FILENAME_RE = re.compile(r"^(?P<version>\d{8}_\d{6})_(?P<name>[a-zA-Z0-9_\-]+)\.sql$")
SCHEMA_FILENAME = "database_schema.sql"


def _migrations_dir(app: Flask) -> Path:
    relative_dir = app.config.get("SQL_MIGRATIONS_DIR", "db/sql_migrations")
    return Path(app.root_path) / relative_dir


def _list_migration_files(migrations_dir: Path) -> list[Path]:
    if not migrations_dir.exists():
        return []

    files = [path for path in migrations_dir.glob("*.sql") if path.is_file()]

    def sort_key(path: Path) -> tuple[int, str]:
        return (0, path.name) if path.name == SCHEMA_FILENAME else (1, path.name)

    return sorted(files, key=sort_key)


def _parse_migration_file(path: Path) -> tuple[str, str]:
    if path.name == SCHEMA_FILENAME:
        return "00000000_000000", "database_schema"

    match = MIGRATION_FILENAME_RE.match(path.name)
    if not match:
        raise ValueError(
            f"Invalid migration filename '{path.name}'. Expected database_schema.sql or YYYYMMDD_HHMMSS_name.sql"
        )
    return match.group("version"), match.group("name")


def _checksum(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def _ensure_migrations_table(manager: Any) -> None:
    logger.info("[DB] Ensuring schema_migrations tracking table exists")
    manager.execute(
        """
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version VARCHAR(32) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            filename VARCHAR(255) NOT NULL,
            checksum VARCHAR(64) NOT NULL,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """,
        commit=True,
    )


def _get_applied_migrations(manager: Any) -> dict[str, dict[str, Any]]:
    rows = manager.fetch_all(
        """
        SELECT version, name, filename, checksum, applied_at
        FROM schema_migrations
        ORDER BY version
        """
    )
    return {row["version"]: row for row in rows}


def _apply_migration(manager: Any, path: Path, version: str, name: str) -> None:
    sql = path.read_text(encoding="utf-8")
    checksum = _checksum(sql)

    with manager.transaction() as cursor:
        cursor.execute(sql)
        cursor.execute(
            """
            INSERT INTO schema_migrations (version, name, filename, checksum)
            VALUES (%s, %s, %s, %s)
            """,
            (version, name, path.name, checksum),
        )


def migrate_database(app: Flask, manager: Any) -> None:
    """Apply pending raw SQL migrations in filename order."""
    migrations_dir = _migrations_dir(app)
    logger.info("[DB] Starting SQL migration scan in %s", migrations_dir)
    _ensure_migrations_table(manager)

    applied_migrations = _get_applied_migrations(manager)
    migration_files = _list_migration_files(migrations_dir)

    if not migration_files:
        logger.info("[DB] No SQL migrations found in %s", migrations_dir)
        return

    applied_count = 0
    skipped_count = 0

    for migration_file in migration_files:
        version, name = _parse_migration_file(migration_file)
        migration_sql = migration_file.read_text(encoding="utf-8")
        checksum = _checksum(migration_sql)

        applied = applied_migrations.get(version)
        if applied:
            if applied.get("checksum") != checksum:
                raise RuntimeError(
                    f"Migration {migration_file.name} has changed after being applied"
                )
            skipped_count += 1
            logger.info("[DB] Skipping already applied migration: %s", migration_file.name)
            continue

        logger.info("[DB] Applying migration: %s", migration_file.name)
        _apply_migration(manager, migration_file, version, name)
        applied_count += 1

    logger.info(
        "[DB] SQL migration run completed: %s applied, %s skipped",
        applied_count,
        skipped_count,
    )