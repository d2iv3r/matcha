#!/usr/bin/env python3
"""Initialize the database with sample data."""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from app.config import DevConfig


def init_database():
    """Initialize database with sample data."""
    print("Initializing database...")
    
    app = create_app(config_class=DevConfig)
    
    with app.app_context():
        print("Database initialized successfully!")


if __name__ == "__main__":
    init_database()
