import pytest
from unittest.mock import MagicMock, patch
from app.services.auth_service import AuthService
from app.models.user_model import UserModel

def test_oauth_42_login_redirect(client):
    """Test that the login route redirects to 42 Intra."""
    with patch("app.extensions.oauth.intra42.authorize_redirect") as mock_redirect:
        mock_redirect.return_value = "redirecting..."
        
        response = client.get("/api/auth/oauth2/42/login")
        
        assert response.status_code == 200
        assert response.data.decode() == "redirecting..."
        mock_redirect.assert_called_once()

def test_oauth_42_callback_success(client, monkeypatch):
    """Test successful OAuth callback handling."""
    # Mock user data from 42 API
    mock_user_info = {
        "id": 12345,
        "login": "testuser",
        "email": "test@student.42.fr",
        "image": {"link": "http://example.com/avatar.jpg"}
    }
    
    # Mocking Authlib client methods
    mock_token = {"access_token": "fake_token"}
    
    # Setup mocks
    with patch("app.extensions.oauth.intra42.authorize_access_token", return_value=mock_token), \
         patch("app.extensions.oauth.intra42.get") as mock_get:
        
        mock_get.return_value.json.return_value = mock_user_info
        
        # Mock AuthService.handle_oauth_login
        class FakeUser:
            id = 1
            username = "testuser"
            email = "test@student.42.fr"
            is_active = True
            is_profile_complete = False

        monkeypatch.setattr(AuthService, "handle_oauth_login", lambda provider, data: FakeUser())
        
        # We also need to mock create_access_token and create_refresh_token if we don't want real JWTs 
        # or just let them run since it's a test environment. 
        # But wait, create_access_token needs a secret key. TestConfig has one (or empty).
        
        response = client.get("/api/auth/oauth2/42/callback")
        
        # Should redirect to dashboard
        assert response.status_code == 302
        assert "http://localhost:3000/complete-profile" in response.headers["Location"]
        
        # Check if cookies are set
        cookies = response.headers.getlist("Set-Cookie")
        assert any("access_token_cookie" in c for c in cookies)
        assert any("refresh_token_cookie" in c for c in cookies)

def test_handle_oauth_login_new_user(app, monkeypatch):
    """Test AuthService.handle_oauth_login for a new user."""
    user_data = {
        "email": "new@example.com",
        "username": "newuser",
        "provider_id": "999"
    }
    
    # Mock UserModel methods to simulate a new user
    monkeypatch.setattr(UserModel, "get_user_by_oauth", lambda provider, pid: None)
    monkeypatch.setattr(UserModel, "get_user_by_email", lambda email: None)
    monkeypatch.setattr(UserModel, "is_username_existing", lambda uname: False)
    
    class FakeUser:
        def __init__(self, **kwargs):
            self.id = 1
            self.username = kwargs.get("username")
            self.email = kwargs.get("email")
            self.is_active = True

        def create_user(self):
            return self

    monkeypatch.setattr(UserModel, "create_user", lambda self: self)
    # We need to mock the constructor to return our FakeUser or just use the real one and mock its DB calls
    # Given the architecture, mocking DB calls might be easier if we have a mock DB manager.
    
    with patch("app.models.user_model.UserModel.create_user") as mock_create, \
         patch("app.models.user_model.UserModel.link_oauth_account") as mock_link:
        
        mock_create.return_value = UserModel(id=1, username="newuser", email="new@example.com", is_active=True)
        mock_link.return_value = True
        
        with app.app_context():
            user = AuthService.handle_oauth_login("intra42", user_data)
            
            assert user.email == "new@example.com"
            assert user.username == "newuser"
            mock_create.assert_called_once()
            mock_link.assert_called_once()

def test_handle_oauth_login_existing_user_same_email(app, monkeypatch):
    """Test AuthService.handle_oauth_login linking to an existing email."""
    user_data = {
        "email": "existing@example.com",
        "username": "new42user",
        "provider_id": "888"
    }
    
    existing_user = UserModel(id=10, username="olduser", email="existing@example.com")
    
    monkeypatch.setattr(UserModel, "get_user_by_oauth", lambda provider, pid: None)
    monkeypatch.setattr(UserModel, "get_user_by_email", lambda email: existing_user)
    
    with patch("app.models.user_model.UserModel.link_oauth_account") as mock_link:
        mock_link.return_value = True
        
        with app.app_context():
            user = AuthService.handle_oauth_login("intra42", user_data)
            
            assert user.id == 10
            assert user.email == "existing@example.com"
            mock_link.assert_called_once_with(10, "intra42", "888")

def test_handle_oauth_login_existing_oauth_user(app, monkeypatch):
    """Test AuthService.handle_oauth_login for an existing OAuth user."""
    user_data = {
        "email": "test@example.com",
        "username": "testuser",
        "provider_id": "777"
    }
    
    existing_user = UserModel(id=5, username="testuser", email="test@example.com")
    
    monkeypatch.setattr(UserModel, "get_user_by_oauth", lambda provider, pid: existing_user)
    
    with app.app_context():
        user = AuthService.handle_oauth_login("intra42", user_data)
        
        assert user.id == 5
        assert user.username == "testuser"
