"""API route handlers for the URL shortener service."""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from typing import Optional

from .database import get_db
from .models import URL
from .schemas import (
    URLCreateRequest, 
    URLCreateResponse, 
    URLStatsResponse, 
    ErrorResponse,
    HealthResponse
)
from .auth import verify_api_key
from .utils import (
    validate_url, 
    generate_short_code, 
    is_valid_short_code, 
    normalize_url,
    build_short_url
)
from .config import settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version=settings.app_version
    )


@router.post("/shorten", response_model=URLCreateResponse)
async def create_short_url(
    request: URLCreateRequest,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """
    Create a shortened URL.
    
    Requires API key authentication via x-api-key header.
    """
    original_url = str(request.url)
    
    # Validate URL
    if not validate_url(original_url):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid URL format or unsupported scheme"
        )
    
    # Normalize URL for consistent storage
    normalized_url = normalize_url(original_url)
    
    # Check if URL already exists
    existing_url = db.query(URL).filter(URL.original_url == normalized_url).first()
    if existing_url:
        return URLCreateResponse(
            data={
                "short_code": existing_url.short_code,
                "original_url": existing_url.original_url,
                "short_url": build_short_url(existing_url.short_code),
                "created_at": existing_url.created_at.isoformat(),
                "expires_at": existing_url.expires_at.isoformat() if existing_url.expires_at else None
            },
            message="URL already exists, returning existing short code"
        )
    
    # Generate unique short code with collision handling
    short_code = None
    for attempt in range(settings.max_collision_retries):
        candidate_code = generate_short_code()
        
        # Check if short code already exists
        existing_code = db.query(URL).filter(URL.short_code == candidate_code).first()
        if not existing_code:
            short_code = candidate_code
            break
    
    if not short_code:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate unique short code after multiple attempts"
        )
    
    # Create new URL record
    url_record = URL(
        short_code=short_code,
        original_url=normalized_url,
        expires_at=request.expires_at
    )
    
    try:
        db.add(url_record)
        db.commit()
        db.refresh(url_record)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create short URL due to database constraint"
        )
    
    return URLCreateResponse(
        data={
            "short_code": url_record.short_code,
            "original_url": url_record.original_url,
            "short_url": build_short_url(url_record.short_code),
            "created_at": url_record.created_at.isoformat(),
            "expires_at": url_record.expires_at.isoformat() if url_record.expires_at else None
        },
        message="URL shortened successfully"
    )


@router.get("/{short_code}")
async def redirect_to_url(short_code: str, db: Session = Depends(get_db)):
    """
    Redirect to the original URL using the short code.
    
    This is a public endpoint that doesn't require authentication.
    """
    # Validate short code format
    if not is_valid_short_code(short_code):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid short code format"
        )
    
    # Find URL record
    url_record = db.query(URL).filter(URL.short_code == short_code).first()
    if not url_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Short code not found"
        )
    
    # Check if URL has expired
    if url_record.is_expired():
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Short URL has expired"
        )
    
    # Increment click count
    url_record.increment_click_count()
    
    try:
        db.commit()
    except Exception:
        # Don't fail the redirect if we can't update the click count
        db.rollback()
    
    # Redirect to original URL
    return RedirectResponse(
        url=url_record.original_url,
        status_code=status.HTTP_302_FOUND
    )


@router.get("/stats/{short_code}", response_model=URLStatsResponse)
async def get_url_stats(short_code: str, db: Session = Depends(get_db)):
    """
    Get statistics for a shortened URL.
    
    This is a public endpoint for transparency.
    """
    # Validate short code format
    if not is_valid_short_code(short_code):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid short code format"
        )
    
    # Find URL record
    url_record = db.query(URL).filter(URL.short_code == short_code).first()
    if not url_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Short code not found"
        )
    
    return URLStatsResponse(
        data={
            "short_code": url_record.short_code,
            "original_url": url_record.original_url,
            "click_count": url_record.click_count,
            "created_at": url_record.created_at.isoformat(),
            "expires_at": url_record.expires_at.isoformat() if url_record.expires_at else None,
            "is_expired": url_record.is_expired()
        }
    )