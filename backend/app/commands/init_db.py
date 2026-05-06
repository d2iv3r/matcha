"""
Initialize the database schema and apply migrations.
"""

import click
from flask import current_app


@click.command("init-db")
def init_db():
    """
    Initialize the database
    Usage:
        flask init-db Initialize database with schema migrations
    """
    try:
        click.echo("Initializing database schema...")
        from app.db.database import DatabaseManager, init_db
        from app.db.migrations import migrate_database
        
        # At this point, current_app.db_manager is already created 
        # by init_db(app) during app creation in __init__.py
        manager = current_app.db_manager
        
        if not manager:
            click.secho("Database manager not found. Database connection pool failed to initialize.", fg="red")
            raise SystemExit(1)

        migrate_database(current_app, manager)
        click.secho("Database initialized successfully!", fg="green", bold=True)
    except click.Abort:
        click.secho("Database initialization cancelled", fg="red")
        raise SystemExit(1)
    except Exception as e:
        click.secho(f"Database initialization failed: {str(e)}", fg="red")
        raise SystemExit(1)