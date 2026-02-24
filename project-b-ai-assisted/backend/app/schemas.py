"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, HttpUrl, Field, validator
from datetime import datetime
from typing import Optional


class URLCreateRequest(BaseModel):
    """Request schema for creating a shortened URL."""
    
    url: HttpUrl = Field(..., description="The URL to shorten")
    expires_at: Optional[datetime] = Field(None, description="Optional expiration date")
    
    @validator('url')
    def validate_url_length(cls, v):
        """Validate URL length."""
        url_str = str(v)
        if len(url_str) > 2048:
            raise ValueError("URL is too long (max 2048 characters)")
        return v


class URLCreateResponse(BaseModel):
    """Response schema for URL creation."""
    
    success: bool = True
    data: dict
    message: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "short_code": "abc123",
                    "original_url": "https://example.com/very/long/url",
                    "short_url": "http://localhost:8000/abc123",
                    "created_at": "2026-02-25T10:30:00Z",
                    "expires_at": None
                },
                "message": "URL shortened successfully"
            }
        }


class URLStatsResponse(BaseModel):
    """Response schema for URL statistics."""
    
    success: bool = True
    data: dict
    message: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "data": {
                    "short_code": "abc123",
                    "original_url": "https://example.com/very/long/url",
                    "click_count": 42,
                    "created_at": "2026-02-25T10:30:00Z",
                    "expires_at": None
                }
            }
        }


class ErrorResponse(BaseModel):
    """Response schema for errors."""
    
    success: bool = False
    error: str
    message: str
    
    class Config:
        schema_extra = {
            "example": {
                "success": False,
                "error": "NOT_FOUND",
                "message": "Short code not found"
            }
        }


class HealthResponse(BaseModel):
    """Response schema for health check."""
    
    status: str = "healthy"
    timestamp: datetime
    version: str
    
    class Config:
        schema_extra = {
            "example": {
                "status": "healthy",
                "timestamp": "2026-02-25T10:30:00Z",
                "version": "1.0.0"
            }
        }