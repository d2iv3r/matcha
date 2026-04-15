"""User business logic."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Optional, Dict, Any, List

from flask import current_app

if TYPE_CHECKING:
    from app.api.v1.auth.schemas import RegistrationSchema


logger = logging.getLogger(__name__)


class UserService:
    """Service class for user-related operations."""

    @staticmethod
    def _db_manager():
        db_manager = getattr(current_app, 'db_manager', None)
        if db_manager is None:
            raise RuntimeError("Database is not initialized")
        return db_manager

    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        """
        Get user by email.

        Args:
            email: User's email

        Returns:
            User data or None
        """
        db_manager = UserService._db_manager()
        return db_manager.fetch_one(
            """
            SELECT id, username, email, password_hash, is_active
            FROM users
            WHERE email = %s
            LIMIT 1
            """,
            (email,),
        )
    
    @staticmethod
    def create_user(user_data: RegistrationSchema) -> Optional[Dict[str, Any]]:
        """
        Create a new user.

        Args:
            user_data: Dictionary containing user information

        Returns:
            Created user data or None
        """
        db_manager = UserService._db_manager()
        return db_manager.execute_returning(
            """
            INSERT INTO users (username, first_name, last_name, email, password_hash, is_active)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, username, email, is_active
            """,
            (user_data.username, user_data.first_name, user_data.last_name, user_data.email, user_data.password, False),
        )
    
    @staticmethod
    def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
        """
        Get user by ID.
        
        Args:
            user_id: User's ID
            
        Returns:
            User data or None
        """
        db_manager = UserService._db_manager()
        return db_manager.fetch_one(
            """
            SELECT id, username, email, password_hash, is_active
            FROM users
            WHERE id = %s
            LIMIT 1
            """,
            (user_id,),
        )
    
    @staticmethod
    def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
        """
        Get user by username.
        
        Args:
            username: User's username
            
        Returns:
            User data or None
        """
        db_manager = UserService._db_manager()
        return db_manager.fetch_one(
            """
            SELECT id, username, email, password_hash, is_active
            FROM users
            WHERE username = %s
            LIMIT 1
            """,
            (username,),
        )
    
    @staticmethod
    def get_all_users(limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """
        Get all users with pagination.
        
        Args:
            limit: Maximum number of users to return
            offset: Number of users to skip
            
        Returns:
            List of user data
        """
        return []
    
    @staticmethod
    def update_user(user_id: int, **kwargs) -> Optional[Dict[str, Any]]:
        """
        Update user information.
        
        Args:
            user_id: User's ID
            **kwargs: Fields to update
            
        Returns:
            Updated user data or None
        """
        return None
    
    @staticmethod
    def delete_user(user_id: int) -> bool:
        """
        Delete a user (soft delete - set is_active to False).
        
        Args:
            user_id: User's ID
            
        Returns:
            True if deleted, False otherwise
        """
        return False
    
    @staticmethod
    def search_users(query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Search users by username or email.
        
        Args:
            query: Search query
            limit: Maximum number of results
            
        Returns:
            List of matching users
        """
        return []
