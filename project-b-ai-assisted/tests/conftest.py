"""Test configuration and fixtures."""

import pytest
import tempfile
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# Add the backend directory to the Python path
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.main import app
from app.database import get_db, Base
from app.config import settings


@pytest.fixture(scope="function")
def test_db():
    """Create a temporary test database."""
    # Create a temporary database file
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    test_database_url = f"sqlite:///{db_path}"
    
    # Create test engine and session
    engine = create_engine(
        test_database_url,
        connect_args={"check_same_thread": False}
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    # Override the dependency
    app.dependency_overrides[get_db] = override_get_db
    
    yield TestingSessionLocal()
    
    # Cleanup
    os.close(db_fd)
    os.unlink(db_path)
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client."""
    return TestClient(app)


@pytest.fixture
def valid_api_key():
    """Return a valid API key for testing."""
    return settings.api_key


@pytest.fixture
def invalid_api_key():
    """Return an invalid API key for testing."""
    return "invalid-api-key"


@pytest.fixture
def sample_urls():
    """Return sample URLs for testing."""
    return [
        "https://www.example.com",
        "https://www.google.com/search?q=test",
        "http://localhost:3000/app",
        "https://github.com/user/repo",
        "https://docs.python.org/3/library/urllib.html"
    ]


@pytest.fixture
def invalid_urls():
    """Return invalid URLs for testing."""
    return [
        "not-a-url",
        "ftp://example.com",  # Invalid scheme
        "javascript:alert('xss')",  # Invalid scheme
        "",  # Empty string
        "http://",  # Incomplete URL
        "https://" + "a" * 2050,  # Too long
    ]