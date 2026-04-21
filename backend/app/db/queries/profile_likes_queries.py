"""Profile likes-related SQL query constants."""

RECORD_PROFILE_LIKE = """
INSERT INTO profile_likes (profile_user_id, liker_user_id)
VALUES (%s, %s)
ON CONFLICT DO NOTHING;
"""

GET_PROFILE_LIKES_COUNT = """
SELECT COUNT(*) as count
FROM profile_likes
WHERE profile_user_id = %s;
"""

HAS_PROFILE_LIKE = """
SELECT EXISTS (
        SELECT 1
        FROM profile_likes
        WHERE profile_user_id = %s
            AND liker_user_id = %s
) AS has_like;
"""

GET_PROFILE_RECENT_LIKES = """
SELECT 
    u.username as liker_username,
    p.age,
    p.location,
    p.avatar
FROM profile_likes pl
JOIN users u ON u.id = pl.liker_user_id
LEFT JOIN profiles p ON p.user_id = pl.liker_user_id
WHERE pl.profile_user_id = %s
ORDER BY pl.liked_at DESC
LIMIT %s;
"""
