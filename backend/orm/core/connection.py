from typing import Optional
from queue import Queue
import psycopg2


class ConnectionPool:
    """
    Database connection pool.

    Manages multiple database connections for concurrent access.
    """

    def __init__(
        self,
        connection_string: str,
        min_connections: int = 1,
        max_connections: int = 10
    ) -> None:
        """
        Initialize connection pool.

        Args:
            connection_string: PostgreSQL connection string
            min_connections: Minimum number of connections
            max_connections: Maximum number of connections
        """
        self.connection_string = connection_string
        self.min_connections = min_connections
        self.max_connections = max_connections
        self._pool: Queue = Queue(maxsize=max_connections)
        self._initialize_pool()

    def _initialize_pool(self) -> None:
        """Initialize the connection pool with minimum connections."""
        for _ in range(self.min_connections):
            conn = psycopg2.connect(self.connection_string)
            self._pool.put(conn)

    def get_connection(self):
        """
        Get a connection from the pool.

        Returns:
            Database connection
        """
        if self._pool.empty():
            return psycopg2.connect(self.connection_string)
        return self._pool.get()

    def return_connection(self, connection) -> None:
        """
        Return a connection to the pool.

        Args:
            connection: Database connection to return
        """
        if not self._pool.full():
            self._pool.put(connection)
        else:
            connection.close()

    def close_all(self) -> None:
        """Close all connections in the pool."""
        while not self._pool.empty():
            conn = self._pool.get()
            conn.close()
