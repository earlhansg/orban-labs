"""Unit tests for database models."""

import pytest
from datetime import datetime, timedelta
from app.models import URL


class TestURLModel:
    """Test URL model functionality."""
    
    def test_url_creation(self):
        """Test creating a URL instance."""
        url = URL(
            short_code="abc123",
            original_url="https://example.com",
            click_count=0
        )
        
        assert url.short_code == "abc123"
        assert url.original_url == "https://example.com"
        assert url.click_count == 0
        assert url.expires_at is None
    
    def test_url_with_expiration(self):
        """Test creating a URL with expiration."""
        expires_at = datetime.utcnow() + timedelta(days=30)
        url = URL(
            short_code="abc123",
            original_url="https://example.com",
            expires_at=expires_at
        )
        
        assert url.expires_at == expires_at
    
    def test_is_expired_no_expiration(self):
        """Test is_expired when no expiration is set."""
        url = URL(
            short_code="abc123",
            original_url="https://example.com"
        )
        
        assert url.is_expired() is False
    
    def test_is_expired_future_expiration(self):
        """Test is_expired with future expiration."""
        expires_at = datetime.utcnow() + timedelta(days=30)
        url = URL(
            short_code="abc123",
            original_url="https://example.com",
            expires_at=expires_at
        )
        
        assert url.is_expired() is False
    
    def test_is_expired_past_expiration(self):
        """Test is_expired with past expiration."""
        expires_at = datetime.utcnow() - timedelta(days=1)
        url = URL(
            short_code="abc123",
            original_url="https://example.com",
            expires_at=expires_at
        )
        
        assert url.is_expired() is True
    
    def test_increment_click_count(self):
        """Test incrementing click count."""
        url = URL(
            short_code="abc123",
            original_url="https://example.com",
            click_count=5
        )
        
        url.increment_click_count()
        assert url.click_count == 6
        
        url.increment_click_count()
        assert url.click_count == 7
    
    def test_url_repr(self):
        """Test string representation of URL."""
        url = URL(
            short_code="abc123",
            original_url="https://example.com"
        )
        
        repr_str = repr(url)
        assert "abc123" in repr_str
        assert "https://example.com" in repr_str