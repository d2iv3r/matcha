"""Flask application factory."""

import logging

from flask import Flask
from app.config import DevConfig, BaseConfig

from app.core.database import init_db
from app.core.middleware import register_middleware
from app.extensions import register_extensions

from app.core.routes import api_bp
from app.api.v1.auth import auth_bp


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
        
        init_db(app)
        logger.info("[APP] Database initialized successfully.")

        @app.teardown_appcontext
        def close_db(_exception: BaseException | None) -> None:
            db_manager = getattr(app, 'db_manager', None)
            if db_manager is not None:
                db_manager.disconnect()
                app.db_manager = None

        register_middleware(app)
        logger.info("[APP] Middleware registered successfully.")
        
        # Register blueprints
        app.register_blueprint(api_bp)
        app.register_blueprint(auth_bp)
        logger.info("[APP] App created successfully!")
    except Exception as e:
        logger.error(f"[APP] Failed to create app: {str(e)}")
        raise RuntimeError(f"Failed to create app: {str(e)}") from e

    return app
