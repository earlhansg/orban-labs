"""Utility functions for URL validation and short code generation."""

import re
import secrets
import string
from urllib.parse import urlparse
from typing import Optional
from pydantic import HttpUrl, ValidationError

from .config import settings


def validate_url(url: str) -> bool:
    """
    Validate if a URL is properly formatted and uses allowed schemes.
    
    Args:
        url: The URL string to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    try:
        # Use Pydantic's HttpUrl for validation
        HttpUrl(url)
        
        # Parse URL to check scheme
        parsed = urlparse(url)
        
        # Check if scheme is allowed
        if parsed.scheme not in settings.allowed_schemes:
            return False
            
        # Check URL length
        if len(url) > settings.max_url_length:
            return False
            
        return True
        
    except (ValidationError, ValueError):
        return False


def generate_short_code(length: Optional[int] = None) -> str:
    """
    Generate a cryptographically secure random short code.
    
    Args:
        length: Length of the short code (defaults to config setting)
        
    Returns:
        str: Random short code
    """
    if length is None:
        length = settings.short_code_length
        
    # Use alphanumeric characters (excluding confusing ones)
    alphabet = string.ascii_letters + string.digits
    # Remove potentially confusing characters
    alphabet = alphabet.replace('0', '').replace('O', '').replace('l', '').replace('I', '')
    
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def is_valid_short_code(short_code: str) -> bool:
    """
    Validate if a short code has the correct format.
    
    Args:
        short_code: The short code to validate
        
    Returns:
        bool: True if valid format, False otherwise
    """
    if not short_code:
        return False
        
    # Check length
    if len(short_code) < settings.short_code_length or len(short_code) > settings.max_short_code_length:
        return False
        
    # Check if contains only alphanumeric characters
    pattern = r'^[a-zA-Z0-9]+$'
    return bool(re.match(pattern, short_code))


def normalize_url(url: str) -> str:
    """
    Normalize a URL for consistent storage and comparison.
    
    Args:
        url: The URL to normalize
        
    Returns:
        str: Normalized URL
    """
    # Remove trailing slash if present (except for root URLs)
    if url.endswith('/') and url.count('/') > 2:
        url = url.rstrip('/')
        
    # Convert to lowercase for the domain part
    parsed = urlparse(url)
    normalized = parsed._replace(netloc=parsed.netloc.lower()).geturl()
    
    return normalized


def build_short_url(short_code: str, base_url: str = "http://localhost:8000") -> str:
    """
    Build the complete short URL from a short code.
    
    Args:
        short_code: The short code
        base_url: The base URL of the service
        
    Returns:
        str: Complete short URL
    """
    return f"{base_url.rstrip('/')}/{short_code}"


def extract_domain(url: str) -> Optional[str]:
    """
    Extract domain from URL for analytics purposes.
    
    Args:
        url: The URL to extract domain from
        
    Returns:
        str: Domain name or None if invalid
    """
    try:
        parsed = urlparse(url)
        return parsed.netloc.lower()
    except Exception:
        return None