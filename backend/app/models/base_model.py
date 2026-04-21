"""Base model helpers for data access operations."""


from flask import current_app


class BaseModel:
    """Common model helpers for DB access."""

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

    @classmethod
    def from_row(cls, row):
        if row is None:
            return None
        return cls(**dict(row))
    
    @classmethod
    def from_rows(cls, rows):
        return [cls.from_row(r) for r in rows]

    @staticmethod
    def db_manager():
        db_manager = getattr(current_app, "db_manager", None)
        if db_manager is None:
            raise RuntimeError("Database is not initialized")
        return db_manager
    