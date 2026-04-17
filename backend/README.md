# Backend Structure

A well-organized Flask application with custom ORM, following industry best practices.

## 📁 Directory Structure

```
backend/
├── app/                      # Main application package
│   ├── __init__.py          # App factory
│   ├── config.py            # Configuration classes
│   ├── routes/              # API endpoints
│   │   ├── api.py           # General API routes
│   │   └── auth.py          # Authentication routes
│   ├── services/            # Business logic layer
│   │   └── user_service.py  # User-related operations
│   ├── schemas/             # Data validation
│   │   └── user_schema.py   # User validation schemas
│   ├── models/              # Database models
│   │   └── user.py          # User model
│   ├── middleware/          # Request/response middleware
│   │   └── __init__.py      # CORS, error handlers, etc.
│   ├── extensions/          # Flask extensions
│   │   └── db.py            # Database initialization
│   └── utils/               # Utility functions
│       └── __init__.py      # Helpers (password hashing, tokens, etc.)
├── orm/                      # Custom ORM framework
│   ├── core/                # Core ORM functionality
│   │   ├── connection.py
│   │   ├── database.py
│   │   └── model.py
│   ├── fields/              # Field types
│   │   ├── base.py
│   │   ├── string.py
│   │   ├── numeric.py
│   │   ├── datetime.py
│   │   ├── boolean.py
│   │   └── relations.py
│   ├── query/               # Query builder
│   │   ├── builder.py
│   │   └── queryset.py
│   ├── migrations/          # Migration utilities
│   │   ├── migrator.py
│   │   └── schema.py
│   ├── exceptions/          # Custom exceptions
│   └── utils/               # ORM utilities
├── tests/                    # Test suite
│   ├── conftest.py          # Pytest configuration
│   └── test_user.py         # User tests
├── scripts/                  # Utility scripts
│   └── init_db.py           # Database initialization
├── docker/                   # Docker configuration
│   └── Dockerfile.dev       # Development Dockerfile
├── wsgi.py                   # WSGI entry point
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development dependencies
└── .env.example             # Environment variables template
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. Run with Docker

```bash
# From project root
make up

# Or with build
make build

# Stop services
make down

# Clean volumes
make clean
```

### 3. Run Locally

```bash
# Install dependencies
pip install -r requirements-dev.txt

# Start development server
flask run --reload
```

## 📦 Architecture

### Application Factory Pattern

The app uses the factory pattern (`app/__init__.py`):

```python
from flask import Flask
from app.config import DevConfig

app = create_app(config_class=DevConfig)
```

### Layer Structure

1. **Routes Layer** (`app/routes/`)
   - Handle HTTP requests/responses
   - Input validation
   - Call service layer

2. **Service Layer** (`app/services/`)
   - Business logic
   - Data processing
   - Coordinate between models and routes

3. **Model Layer** (`app/models/`)
   - Database schema definition
   - ORM model classes

4. **Schema Layer** (`app/schemas/`)
   - Data validation
   - Input/output serialization

### Custom ORM

The application uses a custom-built ORM located in the `orm/` directory:

- **Field Types**: String, Integer, Float, DateTime, Boolean, Foreign Keys
- **Query Builder**: Chainable query methods
- **Migrations**: Database schema management
- **Connection Pooling**: Efficient database connections

## 🔧 Configuration

Configurations are in `app/config.py`:

- `DevConfig`: Development settings
- `ProdConfig`: Production settings
- `TestConfig`: Testing settings
- Database access is handled directly through `psycopg2` and the custom raw SQL migration runner.

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_user.py
```

## 📝 Database Migrations

This backend uses raw SQL migration scripts stored in [app/core/sql_migrations](app/core/sql_migrations).
Migrations are applied automatically when the Flask app initializes and the database is reachable.

```bash
# Add a new SQL file to app/db/sql_migrations
# Use the naming format: YYYYMMDD_HHMMSS_description.sql

# Start the app to apply pending migrations automatically
flask run --reload
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### API Documentation
- `GET /api/docs/` - Swagger UI
- `GET /api/openapi.json` - OpenAPI 3 specification

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signup` - Register new user (alias)
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Issue a new access token from refresh token
- `POST /api/auth/logout` - Clear refresh cookie and log out
- `GET /api/auth/me` - Get current authenticated user
- `GET /api/auth/verify-email?token=...` - Verify signup email and activate account
- `POST /api/auth/reset-password/request` - Send password reset email
- `POST /api/auth/reset-password/confirm` - Validate reset token and update password

Hybrid JWT flow:
- send the short-lived access token in `Authorization: Bearer <access_token>` for API requests
- keep the refresh token in the secure HttpOnly cookie set by login
- send the browser’s CSRF header when calling refresh/logout endpoints

Use `Authorization: Bearer <access_token>` for protected endpoints.

## 🛠️ Development Tools

- **Black**: Code formatting
- **Flake8**: Linting
- **MyPy**: Type checking
- **Pytest**: Testing framework
- **IPython**: Enhanced Python shell

## 📚 Adding New Features

### 1. Create a Model

```python
# app/models/post.py
from orm import fields
from orm.core.model import Model

class Post(Model):
    _table_name = "posts"
    
    id = fields.IntegerField(primary_key=True)
    title = fields.StringField(max_length=200)
    content = fields.TextField()
    user_id = fields.ForeignKey("users", "id")
```

### 2. Create a Service

```python
# app/services/post_service.py
class PostService:
    @staticmethod
    def create_post(title, content, user_id):
        # Business logic here
        pass
```

### 3. Create Routes

```python
# app/routes/posts.py
from flask import Blueprint, request
from app.services.post_service import PostService

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    # Handle request
```

### 4. Register Blueprint

```python
# app/__init__.py
from app.routes.posts import posts_bp

app.register_blueprint(posts_bp)
```

## 🐳 Docker

The application runs in containers:

- **app**: Flask backend (port 5000)
- **db**: PostgreSQL database (port 5432)
- **adminer**: Database UI (port 8080)
- **frontend**: Next.js frontend (port 3000)

## 📄 License

See LICENSE file for details.
