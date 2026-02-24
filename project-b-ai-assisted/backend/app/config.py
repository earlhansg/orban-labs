"""Configuration management for the URL shortener service."""

import os
from typing import Optional
from pydantic import BaseModel
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # Database
    database_url: str = "sqlite:///./url_shortener.db"
    
    # Authentication
    api_key: str = "your-secret-api-key-here"
    
    # URL shortening
    short_code_length: int = 6
    max_short_code_length: int = 8
    max_collision_retries: int = 5
    
    # URL validation
    max_url_length: int = 2048
    allowed_schemes: list[str] = ["http", "https"]
    
    # Application
    app_name: str = "URL Shortener Service"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # CORS
    allowed_origins: list[str] = ["*"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Global settings instance
settings = Settings()