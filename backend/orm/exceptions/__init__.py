"""ORM exceptions."""


class ORMException(Exception):
    """Base exception for all ORM errors."""
    pass


class ValidationError(ORMException):
    """Raised when field validation fails."""
    pass


class DatabaseError(ORMException):
    """Raised when a database operation fails."""
    pass


class DoesNotExist(ORMException):
    """Raised when a query returns no results."""
    pass


class MultipleObjectsReturned(ORMException):
    """Raised when a query expected to return one result returns multiple."""
    pass


class IntegrityError(DatabaseError):
    """Raised when database integrity constraints are violated."""
    pass


class ConnectionError(DatabaseError):
    """Raised when database connection fails."""
    pass


__all__ = [
    "ORMException",
    "ValidationError",
    "DatabaseError",
    "DoesNotExist",
    "MultipleObjectsReturned",
    "IntegrityError",
    "ConnectionError",
]
