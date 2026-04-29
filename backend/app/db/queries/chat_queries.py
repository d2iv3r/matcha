"""Chat-related SQL query constants."""

CREATE_CONVERSATION = """
INSERT INTO conversations (user1_id, user2_id)
VALUES (%s, %s)
ON CONFLICT (user1_id, user2_id) DO NOTHING
RETURNING id, user1_id, user2_id, created_at;
"""

GET_CONVERSATION = """
SELECT id, user1_id, user2_id, created_at
FROM conversations
WHERE (user1_id = %s AND user2_id = %s)
   OR (user1_id = %s AND user2_id = %s)
LIMIT 1;
"""

GET_USER_CONVERSATIONS = """
SELECT c.id, c.user1_id, c.user2_id, c.created_at,
       u1.username as user1_username, u2.username as user2_username,
       p1.avatar as user1_avatar, p2.avatar as user2_avatar,
       (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
       (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
       (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != %s AND is_read = FALSE) as unread_count
FROM conversations c
JOIN users u1 ON c.user1_id = u1.id
JOIN users u2 ON c.user2_id = u2.id
LEFT JOIN profiles p1 ON c.user1_id = p1.user_id
LEFT JOIN profiles p2 ON c.user2_id = p2.user_id
WHERE c.user1_id = %s OR c.user2_id = %s
ORDER BY last_message_at DESC NULLS LAST;
"""

CREATE_MESSAGE = """
INSERT INTO messages (conversation_id, sender_id, content)
VALUES (%s, %s, %s)
RETURNING id, conversation_id, sender_id, content, is_read, created_at;
"""

GET_MESSAGES = """
SELECT id, conversation_id, sender_id, content, is_read, created_at
FROM messages
WHERE conversation_id = %s
ORDER BY created_at DESC
LIMIT %s OFFSET %s;
"""

MARK_MESSAGES_READ = """
UPDATE messages
SET is_read = TRUE
WHERE conversation_id = %s AND sender_id != %s AND is_read = FALSE;
"""

CHECK_MUTUAL_LIKE = """
SELECT EXISTS (
    SELECT 1 FROM profile_likes WHERE profile_user_id = %s AND liker_user_id = %s
) AND EXISTS (
    SELECT 1 FROM profile_likes WHERE profile_user_id = %s AND liker_user_id = %s
) as is_match;
"""

GET_TOTAL_UNREAD_MESSAGES = """
SELECT COUNT(*) as total_unread
FROM messages m
JOIN conversations c ON m.conversation_id = c.id
WHERE (c.user1_id = %s OR c.user2_id = %s)
  AND m.sender_id != %s
  AND m.is_read = FALSE;
"""
