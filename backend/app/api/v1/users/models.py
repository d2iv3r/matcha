"""User model."""

from orm.core.model import Model
from orm import fields


class User(Model):
    """User model representing application users."""

    _table_name = "users"

    id = fields.IntegerField(primary_key=True, auto_increment=True)
    username = fields.StringField(max_length=150, unique=True, null=False)
    email = fields.StringField(max_length=255, unique=True, null=False)
    password_hash = fields.StringField(max_length=255, null=False)
    is_active = fields.BooleanField(default=True)
    created_at = fields.DateTimeField(auto_now_add=True)
    updated_at = fields.DateTimeField(auto_now=True)

    def __repr__(self) -> str:
        return f"<User id={self.id} username={self.username} email={self.email}>"
    
    def to_dict(self, exclude_password: bool = True) -> dict:
        """
        Convert user to dictionary.
        
        Args:
            exclude_password: Whether to exclude password_hash
            
        Returns:
            Dictionary representation of user
        """
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_active': self.is_active,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
        
        if not exclude_password:
            data['password_hash'] = self.password_hash
            
        return data
