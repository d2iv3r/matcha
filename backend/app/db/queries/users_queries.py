"""User-related SQL query constants."""

SEED_USERS = """
INSERT INTO users (username, first_name, last_name, email, password_hash, is_active, is_profile_complete)
VALUES %s
ON CONFLICT DO NOTHING
RETURNING id;
"""

IS_EMAIL_EXISTING = """
SELECT 1
FROM users
WHERE email = %s
LIMIT 1;
"""

IS_USERNAME_EXISTING = """
SELECT 1
FROM users
WHERE username = %s
LIMIT 1;
"""

CREATE_USER = """
INSERT INTO users (username, first_name, last_name, email, password_hash)
VALUES (%s, %s, %s, %s, %s)
RETURNING id, username, email, is_active, is_profile_complete
"""

GET_USER_BY_ID = """
SELECT id, username, email, password_hash, is_active, is_profile_complete
FROM users
WHERE id = %s
LIMIT 1
"""

GET_USER_BY_EMAIL = """
SELECT id, username, email, password_hash, is_active, is_profile_complete
FROM users
WHERE email = %s
LIMIT 1
"""

GET_USER_BY_USERNAME = """
SELECT id, username, email, password_hash, is_active, is_profile_complete
FROM users
WHERE username = %s
LIMIT 1
"""

ACTIVATE_USER_BY_ID = """
UPDATE users
SET is_active = TRUE
WHERE id = %s
RETURNING id, username, email, is_active, is_profile_complete
"""

MARK_PROFILE_COMPLETE = """
UPDATE users
SET is_profile_complete = TRUE
WHERE id = %s
"""

UPDATE_USER_PASSWORD_BY_ID = """
UPDATE users
SET password_hash = %s
WHERE id = %s
"""

UPDATE_USER_BY_ID = """
UPDATE users
SET first_name = COALESCE(%s, first_name),
	last_name = COALESCE(%s, last_name),
	email = COALESCE(%s, email)
WHERE id = %s
RETURNING id, username, first_name, last_name, email, is_active, is_profile_complete
"""
