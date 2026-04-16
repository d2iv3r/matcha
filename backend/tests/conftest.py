"""Pytest configuration and fixtures."""

import pytest
from app import create_app
from app.config import TestConfig


@pytest.fixture
def app():
    """Create application for testing."""
    app = create_app(config_class=TestConfig)
    return app


@pytest.fixture
def client(app):
    """Create a test client."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Create a test CLI runner."""
    return app.test_cli_runner()
