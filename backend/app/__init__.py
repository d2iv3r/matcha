"""Flask application factory."""

import atexit
import logging

from flask import Flask
from app.config import DevConfig, BaseConfig

from app.middlewares.middleware import register_middleware
from app.extensions import register_extensions

from app.routes import api_bp, auth_bp, docs_bp, profile_bp, accounts_bp


logger = logging.getLogger(__name__)


def create_app(config_class: BaseConfig=DevConfig) -> Flask:
    """
    Application factory pattern.
    
    Args:
        config_class: Configuration class to use
    Returns:
        Configured Flask application
    """
    logger.info("[APP] Creating Flask application...")

    try:
        app = Flask(__name__)
        app.config.from_object(config_class)

        # Extensions registration
        register_extensions(app)
        logger.info("[APP] Extensions registered successfully.")

        # Initialize database connection pool (without running migrations)
        from app.db.database import init_db
        init_db(app)

        register_middleware(app)
        logger.info("[APP] Middleware registered successfully.")

        # Register CLI commands
        from app.commands import register_commands
        register_commands(app)
        logger.info("[APP] CLI commands registered successfully.")
        
        # Setup database manager cleanup on exit
        # Note: Database initialization moved to 'flask db init' CLI command
        def cleanup_db():
            db_manager = getattr(app, "db_manager", None)
            if db_manager is not None:
                db_manager.disconnect()
        
        atexit.register(cleanup_db)
        
        # Register blueprints
        app.register_blueprint(api_bp)
        app.register_blueprint(docs_bp)
        app.register_blueprint(auth_bp)
        
        app.register_blueprint(profile_bp)
        app.register_blueprint(accounts_bp)
        logger.info("[APP] App created successfully!")
    except Exception as e:
        logger.error(f"[APP] Failed to create app: {str(e)}")
        raise RuntimeError(f"Failed to create app: {str(e)}") from e

    return app
