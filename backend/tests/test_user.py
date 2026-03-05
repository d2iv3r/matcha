"""Tests for user-related functionality."""

import pytest


def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'


def test_api_root(client):
    """Test the API root endpoint."""
    response = client.get('/api/')
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data
    assert 'version' in data


# TODO: Add more tests for user registration, login, etc.
