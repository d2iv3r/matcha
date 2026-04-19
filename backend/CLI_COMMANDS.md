# Flask CLI Commands Documentation

This document describes the Flask CLI commands available for the Matcha application for database seeding and management.

## Overview

The CLI module provides commands for seeding the database with mock data during development and testing. These commands follow Flask best practices and use the service layer for business logic.

## Setup

### Installation

Ensure you have the required dependencies installed:

```bash
# Install development dependencies (includes Faker)
pip install -r requirements-dev.txt
```

### Configuration

Set the Flask app environment variable:

```bash
export FLASK_APP=wsgi.py
export FLASK_ENV=dev
```

Or use the Makefile:

```bash
make run   # Starts the Flask app
make seed  # Runs the seeding command
```

## Available Commands

### 1. `flask seed` - Seed Database with Mock Data

Generates realistic mock users and profiles for testing and development.

#### Usage

```bash
flask seed [OPTIONS]
```

#### Options

- `--count INTEGER` - Number of mock users to generate (default: 10)
- `--skip-profiles` - Skip profile creation (create only users)
- `--skip-complete` - Skip marking profiles as complete during creation

#### Examples

```bash
# Create 10 users with complete profiles (default)
flask seed

# Create 20 users with profiles
flask seed --count 20

# Create only 5 users without profiles
flask seed --count 5 --skip-profiles

# Create users and profiles but don't mark them complete
flask seed --count 15 --skip-complete

# View help
flask seed --help
```

#### What Gets Created

1. **Users**: Creates mock users with:
   - Random username (3-50 characters, alphanumeric with - and _)
   - Random first and last names
   - Random email addresses
   - Default password: `TempPassword123!` (same for all mock users for easy testing)
   - Auto-activated for testing purposes

2. **Profiles**: Creates profile information for each user with:
   - Gender (randomly: male, female, other)
   - Age (18-70)
   - Date of birth
   - Location (random US city)
   - Bio (randomly generated text)
   - Interests (3-8 interests randomly selected from predefined list)
   - Avatar (optional)
   - Pictures (optional)
   - Marked as complete

#### Output Example

```
🌱 Seeding database with 10 mock users...
--------------------------------------------------
→ Creating users...
✓ Created 10 users
→ Creating profiles...
✓ Created 10 profiles
→ Marking profiles as complete...
✓ Marked 10 profiles as complete
==================================================
✓ DATABASE SEEDING COMPLETED
==================================================
Users Created:       10
Profiles Created:    10
Profiles Completed:  10
==================================================

🎉 Seeding completed successfully!
```

### 2. `flask seed-clear` - Clear Mock Data

Removes all mock data from the database.

**⚠️ WARNING**: This is a destructive operation and cannot be undone.

#### Usage

```bash
flask seed-clear
```

#### Confirmation

The command will prompt for confirmation before proceeding:

```
⚠️  This will delete ALL mock data. Are you sure? [y/N]:
```

### 3. `flask seed-info` - Display Help Information

Shows usage information and examples for seeding commands.

#### Usage

```bash
flask seed-info
```

#### Output

Displays comprehensive help with examples and environment variable information.

## Architecture & Best Practices

### Directory Structure

```
app/cli/
├── __init__.py          # Package initialization, exports register_cli
├── commands.py          # Flask CLI commands and command groups
└── seed.py             # Mock data seeding logic (DataSeeder class)
```

### Design Principles

1. **Separation of Concerns**
   - CLI commands in `commands.py` handle user input and output
   - Business logic in `seed.py` handles data generation
   - Service layer (UserService, ProfileService) handles database operations

2. **Reusability**
   - `DataSeeder` class can be imported and used programmatically
   - Commands are built on top of reusable `DataSeeder` methods

3. **Logging**
   - All operations are logged at INFO and ERROR levels
   - Easy debugging with detailed log messages

4. **Error Handling**
   - Graceful error handling with informative messages
   - Operations continue on individual record failures
   - Summary statistics even if some records fail

5. **User Experience**
   - Color-coded output (green for success, red for errors)
   - Progress indicators
   - Clear summary statistics
   - Help text available with `--help` flag

### Using DataSeeder Programmatically

```python
from app.cli.seed import DataSeeder

# Create a seeder instance
seeder = DataSeeder(count=20)

# Seed users
users = seeder.seed_users()

# Seed profiles
profiles = seeder.seed_profiles()

# Get complete statistics
stats = seeder.run_full_seed()
print(stats)  # {'users_created': 20, 'profiles_created': 20, ...}
```

### Mock Data Specifications

#### Interests List
- photography, travel, cooking, reading, sports, music, art, gaming, fitness, movies, technology, nature

#### Locations
- 10 random US cities (New York, Los Angeles, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Jose)

#### Default Password
- All mock users: `TempPassword123!`

## Integration with Makefile

Add these targets to your Makefile for convenient command execution:

```makefile
.PHONY: seed seed-clear seed-info

seed:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed

seed-clear:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed-clear

seed-info:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed-info
```

Then run commands as:

```bash
make seed
make seed --count=50
make seed-clear
make seed-info
```

## Troubleshooting

### "Faker is required for seeding"

**Solution**: Install development dependencies:

```bash
pip install -r requirements-dev.txt
```

### "Database manager not available"

**Solution**: Ensure the Flask app is properly initialized and database is configured in environment:

```bash
export DATABASE_URL=postgresql://user:password@localhost/matcha_db
export FLASK_APP=wsgi.py
flask seed
```

### Users created but profiles missing

**Solution**: Run seeding again without `--skip-profiles`:

```bash
flask seed --count 5
```

### User activation fails

**Solution**: Ensure the database schema includes an `is_active` field on the users table and users are properly configured.

## Testing

To verify the seeding works correctly:

```bash
# Start the app
python wsgi.py

# In another terminal, seed the database
export FLASK_APP=wsgi.py FLASK_ENV=dev
flask seed --count 5

# Check the results in your database
# Users should have is_active=true and is_profile_complete=true
# Profiles should be created with all mock data
```

## Future Enhancements

Potential improvements for the seeding system:

1. Add `--output` flag to save seeded data to JSON
2. Add `--from-file` flag to seed from custom JSON files
3. Add database validation before seeding
4. Add batch operations for better performance on large seeds
5. Add selective clearing (clear only specific users/profiles)
6. Add seeding for other data types (messages, likes, etc.)

## Contributing

When adding new features to the CLI:

1. Add commands to `commands.py`
2. Add business logic to `seed.py` or appropriate modules
3. Update this documentation
4. Ensure all operations are logged
5. Add user-friendly output messages
6. Test with various options and edge cases
