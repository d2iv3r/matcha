"""Flask application factory."""

import atexit
import os

from flask import Flask
from app.config import DevConfig, BaseConfig

from app.middlewares.middleware import register_middleware
from app.extensions import register_extensions, socketio
from app.utils.app_error import register_error_handlers
from app.realtime import register_realtime
from app.db.database import init_db

from app.routes import (
    api_bp, auth_bp, docs_bp, profile_bp, accounts_bp,
    notifications_bp, chat_bp
)


def create_app(config_class: BaseConfig=DevConfig) -> Flask:
    """
    Application factory pattern.
    
    Args:
        config_class: Configuration class to use
    Returns:
        Configured Flask application
    """

    try:
        static_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))
        app = Flask(__name__, static_folder=static_root, static_url_path="/static")
        app.config.from_object(config_class)
        app.config["MEDIA_PATH"] = os.path.join(app.static_folder, "media")

        # Extensions registration
        register_extensions(app)
        # realtime registration
        register_realtime(socketio)
        # Initialize database connection pool
        init_db(app)
        # middleware registration
        register_middleware(app)
        # error handlers registration
        register_error_handlers(app)
        # Register CLI commands
        from app.commands import register_commands
        register_commands(app)
        # Setup database manager cleanup on exit
        def cleanup_db():
            db_manager = getattr(app, "db_manager", None)
            if db_manager is not None:
                db_manager.disconnect()
        atexit.register(cleanup_db)
        # Register blueprints
        app.register_blueprint(api_bp)
        app.register_blueprint(docs_bp)
        app.register_blueprint(auth_bp)
        app.register_blueprint(accounts_bp)
        app.register_blueprint(profile_bp)
        app.register_blueprint(notifications_bp)
        app.register_blueprint(chat_bp)        
    except Exception as e:
        raise RuntimeError(f"Failed to create app: {str(e)}") from e
    return app
