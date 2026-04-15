"""Authentication data validation schemas."""

from pydantic import BaseModel, Field


class RegistrationSchema(BaseModel):
    """Schema for user registration data."""
    
    username: str = Field(..., min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_-]+$')
    first_name: str = Field(None, max_length=150)
    last_name: str = Field(None, max_length=150)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    password: str = Field(..., min_length=8)


class LoginSchema(BaseModel):
    """Schema for user login data."""
    
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    password: str = Field(..., min_length=8)

class PasswordResetSchema(BaseModel):
    """Schema for password reset data."""
    
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')

class PasswordChangeSchema(BaseModel):
    """Schema for password change data."""
    
    old_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8)

# def validate_registration(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
#     """
#     Validate user registration data.
    
#     Args:
#         data: Registration data dictionary
        
#     Returns:
#         Tuple of (is_valid, error_message)
#     """
#     required_fields = ['username', 'email', 'password']
    
#     for field in required_fields:
#         if field not in data or not data[field]:
#             return False, f"Missing required field: {field}"
    
#     # Validate email format
#     email = data.get('email', '')
#     if '@' not in email or '.' not in email.split('@')[-1]:
#         return False, "Invalid email format"
    
#     # Validate password strength
#     password = data.get('password', '')
#     if len(password) < 8:
#         return False, "Password must be at least 8 characters long"
    
#     # Validate username
#     username = data.get('username', '')
#     if len(username) < 3 or len(username) > 50:
#         return False, "Username must be between 3 and 50 characters"
    
#     # Check for alphanumeric username
#     if not username.replace('_', '').replace('-', '').isalnum():
#         return False, "Username can only contain letters, numbers, hyphens and underscores"
    
#     return True, None


# def validate_login(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
#     """
#     Validate user login data.
    
#     Args:
#         data: Login data dictionary
        
#     Returns:
#         Tuple of (is_valid, error_message)
#     """
#     required_fields = ['email', 'password']
    
#     for field in required_fields:
#         if field not in data or not data[field]:
#             return False, f"Missing required field: {field}"
    
#     # Validate email format
#     email = data.get('email', '')
#     if '@' not in email:
#         return False, "Invalid email format"
    
#     return True, None


# def validate_password_reset(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
#     """
#     Validate password reset data.
    
#     Args:
#         data: Password reset data dictionary
        
#     Returns:
#         Tuple of (is_valid, error_message)
#     """
#     if 'email' not in data or not data['email']:
#         return False, "Email is required"
    
#     email = data.get('email', '')
#     if '@' not in email:
#         return False, "Invalid email format"
    
#     return True, None


# def validate_password_change(data: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
#     """
#     Validate password change data.
    
#     Args:
#         data: Password change data dictionary
        
#     Returns:
#         Tuple of (is_valid, error_message)
#     """
#     required_fields = ['old_password', 'new_password']
    
#     for field in required_fields:
#         if field not in data or not data[field]:
#             return False, f"Missing required field: {field}"
    
#     new_password = data.get('new_password', '')
#     if len(new_password) < 8:
#         return False, "New password must be at least 8 characters long"
    
#     return True, None
