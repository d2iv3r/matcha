from flask import Flask
from orm.core.database import Database
import os


def init_db(app: Flask) -> None:
    """Initialize the database connection and pooling."""
    try:
        # Debug: Print DATABASE_URL (masked password)
        db_url = app.config.get("DATABASE_URL") or os.environ.get("DATABASE_URL")
        if db_url:
            # Mask password for security
            masked_url = db_url.split('@')[1] if '@' in db_url else 'URL not properly formatted'
            print(f"[DB] Connecting to: ...@{masked_url}")
        else:
            raise ValueError("DATABASE_URL is not set in config or environment")
        
        app.db = Database(app)
        print("[DB] Database initialized successfully")
    except Exception as e:
        print(f"[DB] Database initialization error: {str(e)}")
        raise RuntimeError(f"Database initialization failed: {str(e)}") from e