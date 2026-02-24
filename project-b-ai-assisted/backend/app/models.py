"""SQLAlchemy models for the URL shortener service."""

from sqlalchemy import Column, Integer, String, DateTime, Index
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional

from .database import Base


class URL(Base):
    """URL model for storing shortened URLs and their metadata."""
    
    __tablename__ = "urls"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    short_code = Column(String(8), unique=True, index=True, nullable=False)
    original_url = Column(String(2048), index=True, nullable=False)
    click_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    
    def __repr__(self) -> str:
        return f"<URL(short_code='{self.short_code}', original_url='{self.original_url}')>"
    
    def is_expired(self) -> bool:
        """Check if the URL has expired."""
        if self.expires_at is None:
            return False
        return datetime.utcnow() > self.expires_at
    
    def increment_click_count(self) -> None:
        """Increment the click count for this URL."""
        self.click_count += 1


# Create indexes for better performance
Index('idx_urls_short_code', URL.short_code)
Index('idx_urls_original_url', URL.original_url)
Index('idx_urls_created_at', URL.created_at)