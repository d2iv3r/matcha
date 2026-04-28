"""Block-related SQL query constants."""

BLOCK_USER = """
INSERT INTO blocks (blocker_id, blocked_id)
VALUES (%s, %s)
ON CONFLICT (blocker_id, blocked_id) DO NOTHING
RETURNING id, blocker_id, blocked_id, blocked_at;
"""

UNBLOCK_USER = """
DELETE FROM blocks
WHERE blocker_id = %s AND blocked_id = %s;
"""

IS_USER_BLOCKED = """
SELECT EXISTS (
    SELECT 1 FROM blocks
    WHERE (blocker_id = %s AND blocked_id = %s)
       OR (blocker_id = %s AND blocked_id = %s)
) as is_blocked;
"""

GET_BLOCKED_USERS_IDS = """
SELECT blocked_id FROM blocks WHERE blocker_id = %s
UNION
SELECT blocker_id FROM blocks WHERE blocked_id = %s;
"""

GET_MY_BLOCKED_USERS = """
SELECT u.id, u.username, u.first_name, u.last_name, p.avatar, p.age, p.city, p.country, p.rating
FROM blocks b
JOIN users u ON b.blocked_id = u.id
LEFT JOIN profiles p ON u.id = p.user_id
WHERE b.blocker_id = %s;
"""
