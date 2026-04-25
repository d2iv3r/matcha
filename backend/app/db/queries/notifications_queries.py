"""Notifications-related SQL query constants."""

GET_USER_NOTIFICATIONS = """
SELECT id, user_id, type, message, data, is_read, created_at
FROM notifications
WHERE user_id = %s
ORDER BY created_at DESC
LIMIT %s OFFSET %s;
"""

CREATE_NOTIFICATION = """
INSERT INTO notifications (user_id, type, message, data)
VALUES (%s, %s, %s, %s)
RETURNING id, user_id, type, message, data, is_read, created_at;
"""

MARK_NOTIFICATION_READ = """
UPDATE notifications
SET is_read = TRUE
WHERE id = %s
    AND user_id = %s
RETURNING id, user_id, type, message, data, is_read, created_at;
"""
