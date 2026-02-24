"""Unit tests for utility functions."""

import pytest
from app.utils import (
    validate_url,
    generate_short_code,
    is_valid_short_code,
    normalize_url,
    build_short_url,
    extract_domain
)


class TestValidateUrl:
    """Test URL validation function."""
    
    def test_valid_urls(self):
        """Test validation of valid URLs."""
        valid_urls = [
            "https://www.example.com",
            "http://example.com",
            "https://subdomain.example.com/path",
            "https://example.com:8080/path?query=value",
            "http://localhost:3000"
        ]
        
        for url in valid_urls:
            assert validate_url(url), f"URL should be valid: {url}"
    
    def test_invalid_urls(self):
        """Test validation of invalid URLs."""
        invalid_urls = [
            "not-a-url",
            "ftp://example.com",  # Invalid scheme
            "javascript:alert('xss')",  # Invalid scheme
            "",  # Empty string
            "http://",  # Incomplete URL
            "https://" + "a" * 2050,  # Too long
        ]
        
        for url in invalid_urls:
            assert not validate_url(url), f"URL should be invalid: {url}"


class TestGenerateShortCode:
    """Test short code generation function."""
    
    def test_default_length(self):
        """Test short code generation with default length."""
        code = generate_short_code()
        assert len(code) == 6  # Default length from config
        assert code.isalnum()
    
    def test_custom_length(self):
        """Test short code generation with custom length."""
        for length in [4, 6, 8, 10]:
            code = generate_short_code(length)
            assert len(code) == length
            assert code.isalnum()
    
    def test_uniqueness(self):
        """Test that generated codes are unique."""
        codes = set()
        for _ in range(1000):
            code = generate_short_code()
            codes.add(code)
        
        # Should generate mostly unique codes
        assert len(codes) > 990
    
    def test_no_confusing_characters(self):
        """Test that confusing characters are not used."""
        confusing_chars = ['0', 'O', 'l', 'I']
        
        for _ in range(100):
            code = generate_short_code()
            for char in confusing_chars:
                assert char not in code


class TestIsValidShortCode:
    """Test short code validation function."""
    
    def test_valid_short_codes(self):
        """Test validation of valid short codes."""
        valid_codes = [
            "abc123",
            "XYZ789",
            "aBc123",
            "123456",
            "abcdef",
            "ABCDEF"
        ]
        
        for code in valid_codes:
            assert is_valid_short_code(code), f"Code should be valid: {code}"
    
    def test_invalid_short_codes(self):
        """Test validation of invalid short codes."""
        invalid_codes = [
            "",  # Empty
            "ab",  # Too short
            "a" * 20,  # Too long
            "abc-123",  # Contains hyphen
            "abc 123",  # Contains space
            "abc@123",  # Contains special character
            None,  # None value
        ]
        
        for code in invalid_codes:
            assert not is_valid_short_code(code), f"Code should be invalid: {code}"


class TestNormalizeUrl:
    """Test URL normalization function."""
    
    def test_trailing_slash_removal(self):
        """Test removal of trailing slashes."""
        test_cases = [
            ("https://example.com/path/", "https://example.com/path"),
            ("https://example.com/", "https://example.com/"),  # Root URL keeps slash
            ("https://example.com/path/to/resource/", "https://example.com/path/to/resource"),
        ]
        
        for input_url, expected in test_cases:
            assert normalize_url(input_url) == expected
    
    def test_domain_lowercase(self):
        """Test domain conversion to lowercase."""
        test_cases = [
            ("https://EXAMPLE.COM/Path", "https://example.com/Path"),
            ("https://Example.Com/PATH", "https://example.com/PATH"),
            ("https://SUB.EXAMPLE.COM", "https://sub.example.com"),
        ]
        
        for input_url, expected in test_cases:
            assert normalize_url(input_url) == expected


class TestBuildShortUrl:
    """Test short URL building function."""
    
    def test_default_base_url(self):
        """Test building short URL with default base."""
        short_code = "abc123"
        expected = "http://localhost:8000/abc123"
        assert build_short_url(short_code) == expected
    
    def test_custom_base_url(self):
        """Test building short URL with custom base."""
        short_code = "abc123"
        base_url = "https://short.ly"
        expected = "https://short.ly/abc123"
        assert build_short_url(short_code, base_url) == expected
    
    def test_base_url_with_trailing_slash(self):
        """Test building short URL with base URL that has trailing slash."""
        short_code = "abc123"
        base_url = "https://short.ly/"
        expected = "https://short.ly/abc123"
        assert build_short_url(short_code, base_url) == expected


class TestExtractDomain:
    """Test domain extraction function."""
    
    def test_valid_domains(self):
        """Test extraction of valid domains."""
        test_cases = [
            ("https://www.example.com", "www.example.com"),
            ("http://example.com:8080", "example.com:8080"),
            ("https://subdomain.example.com/path", "subdomain.example.com"),
            ("https://EXAMPLE.COM", "example.com"),  # Should be lowercase
        ]
        
        for url, expected in test_cases:
            assert extract_domain(url) == expected
    
    def test_invalid_urls(self):
        """Test domain extraction from invalid URLs."""
        invalid_urls = [
            "not-a-url",
            "",
            None,
        ]
        
        for url in invalid_urls:
            assert extract_domain(url) is None