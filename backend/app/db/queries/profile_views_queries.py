"""Profile views-related SQL query constants."""

RECORD_PROFILE_VIEW = """
INSERT INTO profile_views (profile_user_id, viewer_user_id)
VALUES (%s, %s)
ON CONFLICT DO NOTHING;
"""

GET_PROFILE_VIEWS_COUNT = """
SELECT COUNT(*) as count
FROM profile_views
WHERE profile_user_id = %s;
"""

GET_PROFILE_RECENT_VIEWS = """
SELECT 
    u.username as viewer_username,
    p.age,
    p.location,
    p.avatar
FROM profile_views pv
JOIN users u ON u.id = pv.viewer_user_id
LEFT JOIN profiles p ON p.user_id = pv.viewer_user_id
WHERE pv.profile_user_id = %s
ORDER BY pv.viewed_at DESC
LIMIT %s;
"""
