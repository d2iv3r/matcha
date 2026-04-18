"""User-related SQL query constants."""

GET_USER_BY_EMAIL = """
SELECT id, username, email, password_hash, is_active, is_profile_complete
FROM users
WHERE email = %s
LIMIT 1
"""

CREATE_USER = """
INSERT INTO users (username, first_name, last_name, email, password_hash, is_active, is_profile_complete)
VALUES (%s, %s, %s, %s, %s, %s, %s)
RETURNING id, username, email, is_active, is_profile_complete
"""

GET_USER_BY_ID = """
SELECT id, username, email, password_hash, is_active, is_profile_complete
FROM users
WHERE id = %s
LIMIT 1
"""

GET_USER_BY_USERNAME = """
SELECT id, username, email, password_hash, is_active, is_profile_complete
FROM users
WHERE username = %s
LIMIT 1
"""

GET_ALL_USERS = """
SELECT id, username, email, is_active, is_profile_complete
FROM users
ORDER BY id ASC
LIMIT %s OFFSET %s
"""

SEARCH_USERS = """
SELECT id, username, email, is_active, is_profile_complete
FROM users
WHERE username ILIKE %s OR email ILIKE %s
ORDER BY username ASC
LIMIT %s
"""

DELETE_USER_SOFT = """
UPDATE users
SET is_active = FALSE
WHERE id = %s
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

GET_USER_WITH_PROFILE_BY_ID = """
SELECT
	u.id,
	u.username,
	u.email,
	u.password_hash,
	u.is_active,
	u.is_profile_complete,
	p.user_id AS profile_user_id,
	p.gender,
	p.age,
	p.date_of_birth,
	p.location,
	p.bio,
	p.interests,
	p.avatar,
	p.pictures
FROM users u
LEFT JOIN profiles p ON p.user_id = u.id
WHERE u.id = %s
LIMIT 1
"""

UPDATE_USER_PASSWORD_BY_ID = """
UPDATE users
SET password_hash = %s
WHERE id = %s
RETURNING id, username, email, is_active, is_profile_complete
"""