import pytest
import os
import sys
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app
from database import get_db, Base
import models

# Test database configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override the database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def test_db():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with database override"""
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def valid_api_key():
    """Return a valid API key for testing"""
    return os.getenv("API_KEY", "your-secret-api-key-here")


@pytest.fixture
def invalid_api_key():
    """Return an invalid API key for testing"""
    return "invalid-api-key"


@pytest.fixture
def auth_headers(valid_api_key):
    """Return headers with valid API key"""
    return {"X-API-Key": valid_api_key}


@pytest.fixture
def invalid_auth_headers(invalid_api_key):
    """Return headers with invalid API key"""
    return {"X-API-Key": invalid_api_key}


@pytest.fixture
def sample_note_data():
    """Return sample note data for testing"""
    return {
        "title": "Test Note",
        "body": "This is a test note body",
        "tags": ["test", "sample", "api"]
    }


@pytest.fixture
def sample_note_update_data():
    """Return sample note update data for testing"""
    return {
        "title": "Updated Test Note",
        "body": "This is an updated test note body",
        "tags": ["updated", "test", "api"]
    }


@pytest.fixture
def create_sample_note(client, auth_headers, sample_note_data):
    """Create a sample note and return its data"""
    response = client.post("/notes", json=sample_note_data, headers=auth_headers)
    assert response.status_code == 200
    return response.json()