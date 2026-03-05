"""User data validation schemas."""

from typing import Dict, Any, Optional, Tuple


def validate_user_update(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validate user update data.
    
    Args:
        data: Update data dictionary
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    allowed_fields = ['username', 'email', 'first_name', 'last_name', 'bio']
    
    # Check if at least one field is present
    if not any(field in data for field in allowed_fields):
        return False, "At least one field must be provided for update"
    
    # Validate individual fields if present
    if 'email' in data:
        email = data['email']
        if '@' not in email or '.' not in email.split('@')[-1]:
            return False, "Invalid email format"
    
    if 'username' in data:
        username = data['username']
        if len(username) < 3 or len(username) > 50:
            return False, "Username must be between 3 and 50 characters"
        if not username.replace('_', '').replace('-', '').isalnum():
            return False, "Username can only contain letters, numbers, hyphens and underscores"
    
    if 'first_name' in data:
        if len(data['first_name']) > 100:
            return False, "First name must be less than 100 characters"
    
    if 'last_name' in data:
        if len(data['last_name']) > 100:
            return False, "Last name must be less than 100 characters"
    
    if 'bio' in data:
        if len(data['bio']) > 500:
            return False, "Bio must be less than 500 characters"
    
    return True, None


def validate_user_search(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
    """
    Validate user search data.
    
    Args:
        data: Search data dictionary
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if 'query' not in data or not data['query']:
        return False, "Search query is required"
    
    query = data['query']
    if len(query) < 2:
        return False, "Search query must be at least 2 characters"
    
    return True, None
