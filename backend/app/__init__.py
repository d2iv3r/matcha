"""Flask application factory."""

from flask import Flask
from app.config import DevConfig
from app.core.database import init_db
from app.core.middleware import register_middleware
from app.core.routes import api_bp
from app.api.v1.auth import auth_bp
from app.api.v1.users import users_bp
from app.extensions import register_extensions


def create_app(config_class=DevConfig) -> Flask:
    """
    Application factory pattern.
    
    Args:
        config_class: Configuration class to use
        
    Returns:
        Configured Flask application
    """
    print(f"[APP] Creating Flask app in {config_class.__name__} mode...")
    
    try:
        app = Flask(__name__)
        app.config.from_object(config_class)

        # Extensions registration
        register_extensions(app)
        
        print("[APP] Flask app created, initializing database...")
        # Initialize database connection (custom ORM)
        # Commented out if using Flask-SQLAlchemy only
        # init_db(app)
        
        # Register middleware
        print("[APP] Registering middleware...")
        register_middleware(app)
        
        # Register blueprints
        print("[APP] Registering blueprints...")
        app.register_blueprint(api_bp)
        app.register_blueprint(auth_bp)
        app.register_blueprint(users_bp)
        
        print("[APP] App created successfully!")
    except Exception as e:
        print(f"[APP] Failed to create app: {str(e)}")
        raise RuntimeError(f"Failed to create app: {str(e)}") from e

    return app
