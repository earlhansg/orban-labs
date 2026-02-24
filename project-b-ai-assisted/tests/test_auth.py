"""Unit tests for authentication functions."""

import pytest
from fastapi import HTTPException
from app.auth import verify_api_key, is_valid_api_key
from app.config import settings


class TestVerifyApiKey:
    """Test API key verification function."""
    
    @pytest.mark.asyncio
    async def test_valid_api_key(self):
        """Test verification with valid API key."""
        result = await verify_api_key(settings.api_key)
        assert result == settings.api_key
    
    @pytest.mark.asyncio
    async def test_invalid_api_key(self):
        """Test verification with invalid API key."""
        with pytest.raises(HTTPException) as exc_info:
            await verify_api_key("invalid-key")
        
        assert exc_info.value.status_code == 401
        assert "Invalid API key" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_missing_api_key(self):
        """Test verification with missing API key."""
        with pytest.raises(HTTPException) as exc_info:
            await verify_api_key(None)
        
        assert exc_info.value.status_code == 401
        assert "API key is required" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_empty_api_key(self):
        """Test verification with empty API key."""
        with pytest.raises(HTTPException) as exc_info:
            await verify_api_key("")
        
        assert exc_info.value.status_code == 401
        assert "API key is required" in exc_info.value.detail


class TestIsValidApiKey:
    """Test API key validation function."""
    
    def test_valid_api_key(self):
        """Test validation with valid API key."""
        assert is_valid_api_key(settings.api_key) is True
    
    def test_invalid_api_key(self):
        """Test validation with invalid API key."""
        assert is_valid_api_key("invalid-key") is False
    
    def test_empty_api_key(self):
        """Test validation with empty API key."""
        assert is_valid_api_key("") is False
    
    def test_none_api_key(self):
        """Test validation with None API key."""
        # This should not raise an exception, just return False
        assert is_valid_api_key(None) is False