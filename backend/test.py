from orm.core.model import Model
from orm.fields import IntegerField, StringField

from django.db.models import Model


class User(Model):
    """User model representing application users."""

    id = IntegerField(primary_key=True)
    username = StringField(max_length=150, unique=True, nullable=False)
    # email = StringField(max_length=255, unique=True, nullable=False)
    # password_hash = StringField(max_length=255, nullable=False)
    # is_active = BooleanField(default=True)
    # created_at = DateTimeField(auto_now_add=True)
    # updated_at = DateTimeField(auto_now=True)

    # def __repr__(self) -> str:
    #     return f"<User id={self.id} username={self.username} email={self.email}>"