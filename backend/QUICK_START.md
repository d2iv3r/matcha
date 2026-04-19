# Flask CLI - Quick Start Guide

## Installation & Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend/
pip install -r requirements-dev.txt
```

### 2. Set Environment Variables
```bash
export FLASK_APP=wsgi.py
export FLASK_ENV=dev
export DATABASE_URL=postgresql://user:password@localhost/matcha_db
```

### 3. Verify Installation
```bash
flask seed --help
```

You should see the seed command options displayed.

## Basic Usage

### Create Mock Data (Most Common)
```bash
# Create 10 users with profiles (default)
flask seed

# Create 20 users
flask seed --count 20

# Create 5 users only (no profiles)
flask seed --count 5 --skip-profiles
```

### View Help
```bash
# See detailed help with examples
flask seed-info

# See command-specific help
flask seed --help
flask seed-clear --help
```

### Output Example
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

## What Gets Created

### Each User Gets:
- ✓ Random realistic name, username, email
- ✓ Password: `TempPassword123!` (same for all)
- ✓ Auto-activated for testing

### Each Profile Gets:
- ✓ Random gender, age, date of birth
- ✓ Location (random US city)
- ✓ Bio (random generated text)
- ✓ 3-8 random interests from: photography, travel, cooking, reading, sports, music, art, gaming, fitness, movies, technology, nature
- ✓ Avatar field (optional, for uploads)
- ✓ Marked as complete

## Testing in Your App

### 1. Seed the Database
```bash
flask seed --count 5
```

### 2. Login with Mock User
Use any username from the output and password: `TempPassword123!`

### 3. Verify in Database
```bash
# Query users table
SELECT username, email, is_active, is_profile_complete FROM users LIMIT 5;

# Query profiles table  
SELECT user_id, gender, location, bio FROM profiles LIMIT 5;
```

## Common Scenarios

### Development with Fresh Data
```bash
# Clear old data and seed fresh
flask seed-clear
flask seed --count 20
```

### Testing Different Profile Counts
```bash
# Just users, no profiles
flask seed --count 10 --skip-profiles

# Users and profiles only
flask seed --count 10 --skip-complete
```

### Performance Testing
```bash
# Create larger dataset
flask seed --count 100
```

## Troubleshooting

### ❌ "Faker is required for seeding"
```bash
pip install faker==19.6.1
# or
pip install -r requirements-dev.txt
```

### ❌ "Database manager not available"
```bash
# Ensure DATABASE_URL is set
echo $DATABASE_URL

# Set it if empty:
export DATABASE_URL=postgresql://user:password@localhost/matcha_db
```

### ❌ "Command not found: flask seed"
```bash
# Ensure FLASK_APP is set
export FLASK_APP=wsgi.py
export FLASK_ENV=dev

# Verify app is working
flask --version
```

### ❌ "Users created but profiles missing"
- Users might not be active. Check: `is_active = true` in database
- Profiles require active users. Verify user activation succeeded.

## Integration with Makefile

Add to your Makefile:
```makefile
.PHONY: seed seed-clear seed-info

seed:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed $(ARGS)

seed-clear:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed-clear

seed-info:
	FLASK_APP=wsgi.py FLASK_ENV=dev flask seed-info
```

Then use:
```bash
make seed                   # Create 10 users
make seed ARGS="--count 50"  # Create 50 users
make seed-clear            # Delete all mock data
```

## Architecture Overview

```
CLI Interface (commands.py)
    └─ DataSeeder Class (seed.py)
         ├─ generate_mock_user()
         ├─ generate_mock_profile()
         ├─ seed_users()
         ├─ seed_profiles()
         └─ run_full_seed()
              └─ Services (UserService, ProfileService)
                   └─ Models & Database
```

## Files Created

- ✅ `/app/cli/__init__.py` - Package initialization
- ✅ `/app/cli/seed.py` - Mock data generation logic (287 lines)
- ✅ `/app/cli/commands.py` - Flask CLI commands (187 lines)
- ✅ `/CLI_COMMANDS.md` - Full documentation
- ✅ `/IMPLEMENTATION_SUMMARY.md` - Implementation details

## Files Modified

- ✅ `/app/__init__.py` - Added CLI registration
- ✅ `/requirements-dev.txt` - Added faker==19.6.1

## Next Steps

1. ✅ Install dependencies: `pip install -r requirements-dev.txt`
2. ✅ Set environment variables
3. ✅ Run: `flask seed --count 10`
4. ✅ Verify in database
5. ✅ Start developing/testing!

## Reference

**Command Syntax:**
```bash
flask seed [--count=N] [--skip-profiles] [--skip-complete]
flask seed-clear
flask seed-info
```

**Default Values:**
- Count: 10
- Password: TempPassword123!
- Skip profiles: false
- Skip complete: false

## More Information

- Full docs: See `CLI_COMMANDS.md`
- Implementation: See `IMPLEMENTATION_SUMMARY.md`
- Code: See `/app/cli/` directory
