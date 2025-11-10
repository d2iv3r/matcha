from flask import Flask
from app.config import DevConfig
from app.extensions.db import init_db


def create_app(config_class=DevConfig):
    print(f"[APP] Creating Flask app in {config_class.__name__} mode...")
    
    try:
        app = Flask(__name__)
        app.config.from_object(config_class)
        
        print(f"[APP] Flask app created, initializing database...")
        # Initialize database connection
        init_db(app)
        
        print(f"[APP] App created successfully!")
    except Exception as e:
        print(f"[APP] Failed to create app: {str(e)}")
        raise Exception(f"Failed to create app: {str(e)}") from e

    return app
