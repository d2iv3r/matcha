"""Auth-related SQL query constants."""

STORE_EMAIL_VERIFICATION_TOKEN = """
INSERT INTO email_verification_tokens (user_id, token_hash, expires_at, verified_at)
VALUES (%s, %s, %s, NULL)
ON CONFLICT (user_id)
DO UPDATE SET
    token_hash = EXCLUDED.token_hash,
    expires_at = EXCLUDED.expires_at,
    verified_at = NULL,
    created_at = NOW()
RETURNING id, user_id, token_hash, expires_at, verified_at, created_at
"""

GET_EMAIL_VERIFICATION_TOKEN_BY_HASH = """
SELECT id, user_id, token_hash, expires_at, verified_at, created_at
FROM email_verification_tokens
WHERE token_hash = %s
LIMIT 1
"""

DELETE_EMAIL_VERIFICATION_TOKEN_BY_ID = """
DELETE FROM email_verification_tokens
WHERE id = %s
"""

STORE_PASSWORD_RESET_TOKEN = """
INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, used_at)
VALUES (%s, %s, %s, NULL)
ON CONFLICT (user_id)
DO UPDATE SET
    token_hash = EXCLUDED.token_hash,
    expires_at = EXCLUDED.expires_at,
    used_at = NULL,
    created_at = NOW()
RETURNING id, user_id, token_hash, expires_at, used_at, created_at
"""

GET_PASSWORD_RESET_TOKEN_BY_HASH = """
SELECT id, user_id, token_hash, expires_at, used_at, created_at
FROM password_reset_tokens
WHERE token_hash = %s
LIMIT 1
"""

DELETE_PASSWORD_RESET_TOKEN_BY_ID = """
DELETE FROM password_reset_tokens
WHERE id = %s
"""