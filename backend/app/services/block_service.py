"""Service for handling user blocking logic."""

import logging
from typing import Any, Dict, List, Optional
from flask import current_app
from app.db.queries.block_queries import (
    BLOCK_USER,
    UNBLOCK_USER,
    IS_USER_BLOCKED,
    GET_MY_BLOCKED_USERS,
    GET_BLOCKED_USERS_IDS
)
from app.db.queries.users_queries import GET_USER_BY_ID, GET_USER_BY_USERNAME

logger = logging.getLogger(__name__)

class BlockService:
    @staticmethod
    def block_user_by_username(blocker_id: int, blocked_username: str) -> Optional[Dict[str, Any]]:
        """Block a user by username."""
        # Get blocked user ID
        user = current_app.db_manager.fetch_one(GET_USER_BY_USERNAME, (blocked_username,))
        if not user:
            return None
        
        blocked_id = user['id']
        
        if blocker_id == blocked_id:
            raise ValueError("You cannot block yourself")

        # Perform block
        result = current_app.db_manager.execute_returning(BLOCK_USER, (blocker_id, blocked_id))
        
        # Automatically unmatch (remove likes in both directions)
        from app.services.profile_likes_service import ProfileLikesService
        ProfileLikesService.remove_mutual_likes(blocker_id, blocked_id)
        
        return result

    @staticmethod
    def unblock_user_by_username(blocker_id: int, blocked_username: str) -> int:
        """Unblock a user by username."""
        user = current_app.db_manager.fetch_one(GET_USER_BY_USERNAME, (blocked_username,))
        if not user:
            return 0
            
        blocked_id = user['id']
        return current_app.db_manager.execute(UNBLOCK_USER, (blocker_id, blocked_id))

    @staticmethod
    def is_blocked(user1_id: int, user2_id: int) -> bool:
        """Check if there is a block between two users (either way)."""
        result = current_app.db_manager.fetch_one(IS_USER_BLOCKED, (user1_id, user2_id, user2_id, user1_id))
        return result["is_blocked"] if result else False

    @staticmethod
    def get_blocked_users_ids(user_id: int) -> List[int]:
        """Get IDs of all users blocked by this user or who blocked this user."""
        rows = current_app.db_manager.fetch_all(GET_BLOCKED_USERS_IDS, (user_id, user_id))
        return [row["blocked_id"] for row in rows]

    @staticmethod
    def get_my_blocked_users(user_id: int) -> List[Dict[str, Any]]:
        """Get list of users blocked by the current user."""
        return current_app.db_manager.fetch_all(GET_MY_BLOCKED_USERS, (user_id,))
