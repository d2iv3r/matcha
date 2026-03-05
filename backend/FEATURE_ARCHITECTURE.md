# Feature-Based Backend Architecture 🏗️

A well-organized Flask application using **feature-based architecture** for better modularity and scalability.

## 📂 Directory Structure

```
backend/
├── app/
│   ├── __init__.py              # Application factory
│   ├── core/                    # Core infrastructure
│   │   ├── config.py           # Application configuration
│   │   ├── database.py         # Database initialization
│   │   ├── middleware.py       # Request/response middleware
│   │   └── routes.py           # General API routes
│   ├── features/                # Feature modules
│   │   ├── auth/               # Authentication feature
│   │   │   ├── __init__.py
│   │   │   ├── routes.py       # Auth endpoints
│   │   │   ├── services.py     # Auth business logic
│   │   │   └── schemas.py      # Auth validation
│   │   └── users/              # User management feature
│   │       ├── __init__.py
│   │       ├── routes.py       # User endpoints
│   │       ├── services.py     # User business logic
│   │       ├── schemas.py      # User validation
│   │       └── models.py       # User database model
│   └── shared/                  # Shared utilities
│       ├── __init__.py
│       └── utils.py            # Helper functions
├── orm/                         # Custom ORM framework
├── alembic/                     # Database migrations
├── tests/                       # Test suite
├── scripts/                     # Utility scripts
├── wsgi.py                      # WSGI entry point
└── alembic.ini                  # Alembic configuration
```

## 🎯 Architecture Principles

### Feature-Based Organization
Each feature is a **self-contained module** with all its layers:
- **Routes**: HTTP endpoints and request/response handling
- **Services**: Business logic and operations
- **Schemas**: Data validation and serialization
- **Models**: Database entities (if feature-specific)

### Benefits
1. **High Cohesion**: Related code lives together
2. **Easy Navigation**: Find everything about a feature in one place
3. **Scalability**: Add new features without touching existing ones
4. **Team Collaboration**: Different teams can own different features
5. **Testability**: Test features in isolation

## 🚀 Quick Start

### Start the Application
```bash
# From project root
make up
```

### Access Endpoints
- **API Health**: http://localhost:5000/api/health
- **API Root**: http://localhost:5000/api/
- **Auth Register**: http://localhost:5000/api/auth/register
- **Auth Login**: http://localhost:5000/api/auth/login
- **Users List**: http://localhost:5000/api/users/

## 📦 Module Structure

### Core Module (`app/core/`)
**Shared infrastructure** used across all features:

#### `config.py`
```python
from app.core.config import DevConfig, ProdConfig, TestConfig
```
Environment-specific configurations

#### `database.py`
```python
from app.core.database import init_db
```
Database connection and pooling

#### `middleware.py`
```python
from app.core.middleware import register_middleware
```
CORS, error handlers, request/response processing

#### `routes.py`
```python
from app.core.routes import api_bp
```
General API endpoints (health check, API info)

### Features Module (`app/features/`)
**Domain-specific modules** grouped by business capability:

#### Auth Feature (`app/features/auth/`)
Handles authentication and authorization:
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - User logout
- **GET** `/api/auth/me` - Get current user

#### Users Feature (`app/features/users/`)
Manages user data and profiles:
- **GET** `/api/users/` - List all users
- **GET** `/api/users/<id>` - Get user by ID
- **PUT** `/api/users/<id>` - Update user
- **DELETE** `/api/users/<id>` - Delete user
- **GET** `/api/users/profile/<username>` - Get user profile

### Shared Module (`app/shared/`)
**Common utilities** used across features:
- `hash_password()` - Password hashing
- `verify_password()` - Password verification
- `generate_token()` - Token generation
- `format_datetime()` - DateTime formatting

## 🔨 Adding a New Feature

### 1. Create Feature Directory
```bash
mkdir -p app/features/posts
cd app/features/posts
```

### 2. Create Feature Files

**`__init__.py`** - Blueprint registration
```python
"""Posts feature package."""

from flask import Blueprint

posts_bp = Blueprint('posts', __name__, url_prefix='/api/posts')

from app.features.posts import routes

__all__ = ['posts_bp']
```

**`models.py`** - Database models
```python
"""Post model."""

from orm.core.model import Model
from orm import fields

class Post(Model):
    _table_name = "posts"
    
    id = fields.IntegerField(primary_key=True, auto_increment=True)
    title = fields.StringField(max_length=200)
    content = fields.TextField()
    user_id = fields.ForeignKey("users", "id")
```

**`schemas.py`** - Validation
```python
"""Post validation schemas."""

def validate_post_creation(data):
    # Validation logic
    pass
```

**`services.py`** - Business logic
```python
"""Post business logic."""

class PostService:
    @staticmethod
    def create_post(title, content, user_id):
        # Create post logic
        pass
```

**`routes.py`** - HTTP endpoints
```python
"""Post routes."""

from flask import jsonify, request
from app.features.posts import posts_bp
from app.features.posts.services import PostService

@posts_bp.route('/', methods=['POST'])
def create_post():
    data = request.get_json()
    # Handle request
```

### 3. Register Blueprint
In `app/__init__.py`:
```python
from app.features.posts import posts_bp

def create_app(config_class=DevConfig):
    # ...
    app.register_blueprint(posts_bp)
```

## 🧪 Testing

### Project Structure
```
tests/
├── conftest.py              # Pytest fixtures
├── features/
│   ├── test_auth.py        # Auth feature tests
│   └── test_users.py       # Users feature tests
└── core/
    └── test_middleware.py  # Middleware tests
```

### Running Tests
```bash
# All tests
pytest

# Specific feature
pytest tests/features/test_auth.py

# With coverage
pytest --cov=app --cov-report=html
```

### Writing Tests
```python
def test_user_registration(client):
    """Test user registration endpoint."""
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 201
```

## 📝 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### User Endpoints

#### List Users
```http
GET /api/users/
```

#### Get User
```http
GET /api/users/1
```

#### Update User
```http
PUT /api/users/1
Content-Type: application/json

{
  "username": "newusername",
  "bio": "Updated bio"
}
```

## 🔐 Security

### Password Hashing
```python
from app.shared.utils import hash_password, verify_password

# Hash password
hashed = hash_password("mypassword")

# Verify password
is_valid = verify_password("mypassword", hashed)
```

### Authentication Flow
1. User registers → Password hashed and stored
2. User logs in → Password verified, token generated
3. Protected routes → Token validated in middleware

## 🛠️ Development

### Code Style
```bash
# Format code
black app/

# Lint code
flake8 app/

# Type checking
mypy app/
```

### Database Migrations
```bash
# Create migration
alembic revision -m "add posts table"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

## 📦 Dependencies

### Production
- Flask 3.0.0
- psycopg2-binary 2.9.6
- python-dotenv 1.0.0
- alembic 1.11.1

### Development
- pytest 7.4.0
- pytest-flask 1.2.0
- black 23.7.0
- flake8 6.1.0

## 🐳 Docker

The application is containerized:
- **Backend**: Flask app on port 5000
- **Database**: PostgreSQL on port 5432
- **Frontend**: Next.js on port 3000
- **Adminer**: Database UI on port 8080

## 📚 Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Blueprint Pattern](https://flask.palletsprojects.com/en/stable/blueprints/)
- [Feature-Based Architecture](https://phauer.com/2020/package-by-feature/)

## 🎉 Summary

Your backend now uses a **feature-based architecture** where:
- Each feature is self-contained with routes, services, schemas, and models
- Core infrastructure is centralized in `app/core/`
- Shared utilities are in `app/shared/`
- Features can be developed, tested, and maintained independently

This structure scales well as your application grows! 🚀
