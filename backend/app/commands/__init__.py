"""Flask CLI commands for the application."""

from .init_db import init_db
from .seed_db import seed_db

def register_commands(app):
    """Register CLI commands with the Flask app."""
    app.cli.add_command(init_db)
    app.cli.add_command(seed_db)