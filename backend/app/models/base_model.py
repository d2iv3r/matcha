"""Base model helpers for data access operations."""

from dataclasses import dataclass

from flask import current_app


class BaseModel:
    """Common model helpers for DB access."""

    @staticmethod
    def db_manager():
        db_manager = getattr(current_app, "db_manager", None)
        if db_manager is None:
            raise RuntimeError("Database is not initialized")
        return db_manager
    