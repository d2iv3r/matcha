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

MARK_EMAIL_VERIFICATION_TOKEN_USED = """
UPDATE email_verification_tokens
SET verified_at = NOW()
WHERE id = %s
RETURNING id, user_id, token_hash, expires_at, verified_at, created_at
"""