"""Profile likes-related SQL query constants."""

RECORD_PROFILE_LIKE = """
INSERT INTO profile_likes (profile_user_id, liker_user_id)
VALUES (%s, %s)
ON CONFLICT DO NOTHING;
"""

REMOVE_PROFILE_LIKE = """
DELETE FROM profile_likes
WHERE profile_user_id = %s
    AND liker_user_id = %s;
"""

REMOVE_MUTUAL_LIKES = """
DELETE FROM profile_likes
WHERE (profile_user_id = %s AND liker_user_id = %s)
   OR (profile_user_id = %s AND liker_user_id = %s);
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
    u.id as liker_id,
    u.username as liker_username,
    u.first_name as liker_first_name,
    u.last_name as liker_last_name,
    p.age as liker_age,
    p.city as liker_city,
    p.country as liker_country,
    p.avatar as liker_avatar
FROM profile_likes pl
JOIN users u ON u.id = pl.liker_user_id
LEFT JOIN profiles p ON p.user_id = pl.liker_user_id
WHERE pl.profile_user_id = %s
ORDER BY pl.liked_at DESC
LIMIT %s;
"""

GET_PROFILE_MATCHES = """
SELECT 
    u.id as liker_id,
    u.username as liker_username,
    u.first_name as liker_first_name,
    u.last_name as liker_last_name,
    p.age as liker_age,
    p.city as liker_city,
    p.country as liker_country,
    p.avatar as liker_avatar
FROM profile_likes pl1
JOIN profile_likes pl2 ON pl1.profile_user_id = pl2.liker_user_id 
    AND pl1.liker_user_id = pl2.profile_user_id
JOIN users u ON u.id = pl1.liker_user_id
LEFT JOIN profiles p ON p.user_id = pl1.liker_user_id
WHERE pl1.profile_user_id = %s
ORDER BY pl1.liked_at DESC
LIMIT %s;
"""
