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

GET_USER_BY_OAUTH = """
SELECT u.id, u.username, u.email, u.is_active, u.is_profile_complete
FROM users u
JOIN oauth_accounts oa ON u.id = oa.user_id
WHERE oa.provider = %s AND oa.provider_user_id = %s
LIMIT 1
"""

LINK_OAUTH_ACCOUNT = """
INSERT INTO oauth_accounts (user_id, provider, provider_user_id)
VALUES (%s, %s, %s)
ON CONFLICT (provider, provider_user_id) DO NOTHING
"""