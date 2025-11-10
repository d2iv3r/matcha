# Matcha ORM

A lightweight, custom ORM library for Flask applications with PostgreSQL support.

## Features

- **Model Definition**: Simple, declarative model syntax
- **Field Types**: Support for common data types (Integer, String, Text, DateTime, Boolean, etc.)
- **Relationships**: Foreign keys and many-to-many relationships
- **Query Builder**: Chainable query API for filtering, ordering, and pagination
- **Migrations**: Schema creation and modification tools
- **Validation**: Built-in field validation
- **Connection Pooling**: Efficient database connection management

## Installation

The ORM is included in your Flask backend. No additional installation required.

## Quick Start

### 1. Define a Model

```python
from orm import Model, StringField, IntegerField, DateTimeField

class User(Model):
    _table_name = "users"

    id = IntegerField(primary_key=True, auto_increment=True)
    username = StringField(max_length=50, unique=True, null=False)
    email = StringField(max_length=100, null=False)
    created_at = DateTimeField(auto_now_add=True)
```

### 2. Create Tables

```python
from orm import Database
from orm.migrations import Migrator

db = Database()
migrator = Migrator(db)
migrator.create_tables([User])
```

### 3. Query Data

```python
# Get all users
users = User.objects().all()

# Filter users
active_users = User.objects().filter(is_active=True).all()

# Get a single user
user = User.objects().get(id=1)

# Order and limit
recent_users = User.objects().order_by('-created_at').limit(10).all()
```

### 4. Create and Save

```python
# Create a new user
user = User(
    username="john_doe",
    email="john@example.com"
)
user.save()
```

## Field Types

- **IntegerField**: Integer values
- **FloatField**: Floating-point numbers
- **DecimalField**: Precise decimal numbers
- **StringField**: Variable-length strings
- **TextField**: Unlimited text
- **EmailField**: Email addresses with validation
- **BooleanField**: Boolean values
- **DateField**: Date values
- **DateTimeField**: Date and time values
- **TimeField**: Time values
- **ForeignKey**: Foreign key relationships
- **ManyToMany**: Many-to-many relationships

## Field Options

Common options for all fields:

- `primary_key`: Mark field as primary key
- `unique`: Enforce uniqueness
- `null`: Allow NULL values
- `default`: Default value
- `db_column`: Custom database column name
- `validators`: List of validation functions

## Query API

The QuerySet API provides chainable methods for building queries:

- `filter(**kwargs)`: Filter by field values
- `exclude(**kwargs)`: Exclude matching records
- `order_by(*fields)`: Order results
- `limit(count)`: Limit number of results
- `offset(count)`: Skip results
- `all()`: Fetch all results
- `first()`: Fetch first result
- `last()`: Fetch last result
- `count()`: Count results
- `exists()`: Check if results exist
- `get(**kwargs)`: Get single result

## Project Structure

```
orm/
├── __init__.py              # Main ORM exports
├── core/                    # Core ORM components
│   ├── model.py            # Base Model class
│   ├── database.py         # Database connection
│   └── connection.py       # Connection pooling
├── fields/                  # Field types
│   ├── base.py             # Base Field class
│   ├── numeric.py          # Numeric fields
│   ├── string.py           # String fields
│   ├── datetime.py         # Date/time fields
│   ├── boolean.py          # Boolean field
│   └── relations.py        # Relationship fields
├── query/                   # Query building
│   ├── queryset.py         # QuerySet API
│   └── builder.py          # SQL builder
├── exceptions/              # Custom exceptions
│   └── __init__.py
├── migrations/              # Migration system
│   ├── migrator.py         # Migration manager
│   └── schema.py           # Schema builder
└── utils/                   # Utilities
    ├── validators.py       # Validation functions
    └── helpers.py          # Helper functions
```

## Development Status

This ORM is under active development. Current implementation includes:

- ✅ Model definition and field types
- ✅ Query builder structure
- ✅ Database connection management
- ✅ Basic migration system
- ⏳ Query execution (in progress)
- ⏳ Relationship handling (in progress)
- ⏳ Advanced migrations (planned)

## Contributing

This is a custom ORM built specifically for the Matcha project. Feel free to extend and modify as needed.

## License

Part of the Matcha project.
