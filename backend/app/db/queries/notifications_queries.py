"""Notifications-related SQL query constants."""

GET_USER_NOTIFICATIONS = """
SELECT id, user_id, actor_id, type, message, data, entity_id, is_read, created_at
FROM notifications
WHERE user_id = %s
ORDER BY created_at DESC
LIMIT %s OFFSET %s;
"""

CREATE_NOTIFICATION = """
INSERT INTO notifications (user_id, actor_id, type, message, data, entity_id)
VALUES (%s, %s, %s, %s, %s, %s)
RETURNING id, user_id, actor_id, type, message, data, entity_id, is_read, created_at;
"""

MARK_NOTIFICATION_READ = """
UPDATE notifications
SET is_read = TRUE
WHERE id = %s
    AND user_id = %s
RETURNING id, user_id, actor_id, type, message, data, entity_id, is_read, created_at;
"""

MARK_ALL_NOTIFICATIONS_READ = """
UPDATE notifications
SET is_read = TRUE
WHERE user_id = %s AND is_read = FALSE;
"""

CHECK_UNREAD_MESSAGE_NOTIFICATION = """
SELECT id FROM notifications
WHERE user_id = %s AND actor_id = %s AND type = 'MESSAGE' AND is_read = FALSE
LIMIT 1;
"""
