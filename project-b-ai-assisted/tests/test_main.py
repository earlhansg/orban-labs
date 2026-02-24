"""Integration tests for the main API endpoints."""

import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient


class TestHealthEndpoint:
    """Test health check endpoint."""
    
    def test_health_check(self, client: TestClient):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert data["version"] == "1.0.0"


class TestRootEndpoint:
    """Test root endpoint."""
    
    def test_root_endpoint(self, client: TestClient):
        """Test root endpoint returns service information."""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert data["service"] == "URL Shortener Service"
        assert data["version"] == "1.0.0"
        assert data["status"] == "running"
        assert data["docs"] == "/docs"
        assert data["health"] == "/health"


class TestShortenEndpoint:
    """Test URL shortening endpoint."""
    
    def test_shorten_url_success(self, client: TestClient, valid_api_key: str):
        """Test successful URL shortening."""
        response = client.post(
            "/shorten",
            json={"url": "https://www.example.com"},
            headers={"x-api-key": valid_api_key}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "data" in data
        assert "short_code" in data["data"]
        assert "original_url" in data["data"]
        assert "short_url" in data["data"]
        assert "created_at" in data["data"]
        assert data["data"]["original_url"] == "https://www.example.com"
    
    def test_shorten_url_duplicate(self, client: TestClient, valid_api_key: str):
        """Test shortening the same URL twice returns existing short code."""
        url = "https://www.example.com/duplicate-test"
        
        # First request
        response1 = client.post(
            "/shorten",
            json={"url": url},
            headers={"x-api-key": valid_api_key}
        )
        assert response1.status_code == 200
        data1 = response1.json()
        
        # Second request with same URL
        response2 = client.post(
            "/shorten",
            json={"url": url},
            headers={"x-api-key": valid_api_key}
        )
        assert response2.status_code == 200
        data2 = response2.json()
        
        # Should return the same short code
        assert data1["data"]["short_code"] == data2["data"]["short_code"]
        assert "already exists" in data2["message"]
    
    def test_shorten_url_with_expiration(self, client: TestClient, valid_api_key: str):
        """Test shortening URL with expiration date."""
        expires_at = (datetime.utcnow() + timedelta(days=30)).isoformat()
        
        response = client.post(
            "/shorten",
            json={
                "url": "https://www.example.com/expires",
                "expires_at": expires_at
            },
            headers={"x-api-key": valid_api_key}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["expires_at"] is not None
    
    def test_shorten_url_invalid_api_key(self, client: TestClient):
        """Test shortening URL with invalid API key."""
        response = client.post(
            "/shorten",
            json={"url": "https://www.example.com"},
            headers={"x-api-key": "invalid-key"}
        )
        
        assert response.status_code == 401
        data = response.json()
        assert data["success"] is False
        assert "Invalid API key" in data["message"]
    
    def test_shorten_url_missing_api_key(self, client: TestClient):
        """Test shortening URL without API key."""
        response = client.post(
            "/shorten",
            json={"url": "https://www.example.com"}
        )
        
        assert response.status_code == 401
        data = response.json()
        assert data["success"] is False
        assert "API key is required" in data["message"]
    
    def test_shorten_invalid_url(self, client: TestClient, valid_api_key: str, invalid_urls: list):
        """Test shortening invalid URLs."""
        for invalid_url in invalid_urls:
            response = client.post(
                "/shorten",
                json={"url": invalid_url},
                headers={"x-api-key": valid_api_key}
            )
            
            # Should return 400 or 422 (validation error)
            assert response.status_code in [400, 422]


class TestRedirectEndpoint:
    """Test URL redirection endpoint."""
    
    def test_redirect_success(self, client: TestClient, valid_api_key: str):
        """Test successful redirection."""
        # First create a short URL
        response = client.post(
            "/shorten",
            json={"url": "https://www.example.com/redirect-test"},
            headers={"x-api-key": valid_api_key}
        )
        assert response.status_code == 200
        short_code = response.json()["data"]["short_code"]
        
        # Test redirection
        response = client.get(f"/{short_code}", follow_redirects=False)
        assert response.status_code == 302
        assert response.headers["location"] == "https://www.example.com/redirect-test"
    
    def test_redirect_increments_click_count(self, client: TestClient, valid_api_key: str):
        """Test that redirection increments click count."""
        # Create a short URL
        response = client.post(
            "/shorten",
            json={"url": "https://www.example.com/click-test"},
            headers={"x-api-key": valid_api_key}
        )
        short_code = response.json()["data"]["short_code"]
        
        # Check initial stats
        response = client.get(f"/stats/{short_code}")
        initial_count = response.json()["data"]["click_count"]
        
        # Redirect (increment count)
        client.get(f"/{short_code}", follow_redirects=False)
        
        # Check updated stats
        response = client.get(f"/stats/{short_code}")
        new_count = response.json()["data"]["click_count"]
        
        assert new_count == initial_count + 1
    
    def test_redirect_not_found(self, client: TestClient):
        """Test redirection with non-existent short code."""
        response = client.get("/nonexistent", follow_redirects=False)
        assert response.status_code == 404
        
        data = response.json()
        assert data["success"] is False
        assert "not found" in data["message"].lower()
    
    def test_redirect_invalid_short_code(self, client: TestClient):
        """Test redirection with invalid short code format."""
        invalid_codes = ["ab", "a" * 20, "abc-123", "abc@123"]
        
        for code in invalid_codes:
            response = client.get(f"/{code}", follow_redirects=False)
            assert response.status_code == 404
    
    def test_redirect_expired_url(self, client: TestClient, valid_api_key: str):
        """Test redirection to expired URL."""
        # Create URL with past expiration
        expires_at = (datetime.utcnow() - timedelta(days=1)).isoformat()
        
        response = client.post(
            "/shorten",
            json={
                "url": "https://www.example.com/expired",
                "expires_at": expires_at
            },
            headers={"x-api-key": valid_api_key}
        )
        short_code = response.json()["data"]["short_code"]
        
        # Try to redirect
        response = client.get(f"/{short_code}", follow_redirects=False)
        assert response.status_code == 410  # Gone
        
        data = response.json()
        assert data["success"] is False
        assert "expired" in data["message"].lower()


class TestStatsEndpoint:
    """Test URL statistics endpoint."""
    
    def test_get_stats_success(self, client: TestClient, valid_api_key: str):
        """Test successful stats retrieval."""
        # Create a short URL
        response = client.post(
            "/shorten",
            json={"url": "https://www.example.com/stats-test"},
            headers={"x-api-key": valid_api_key}
        )
        short_code = response.json()["data"]["short_code"]
        
        # Get stats
        response = client.get(f"/stats/{short_code}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        
        stats = data["data"]
        assert stats["short_code"] == short_code
        assert stats["original_url"] == "https://www.example.com/stats-test"
        assert stats["click_count"] == 0
        assert "created_at" in stats
        assert "is_expired" in stats
    
    def test_get_stats_not_found(self, client: TestClient):
        """Test stats for non-existent short code."""
        response = client.get("/stats/nonexistent")
        assert response.status_code == 404
        
        data = response.json()
        assert data["success"] is False
        assert "not found" in data["message"].lower()
    
    def test_get_stats_invalid_short_code(self, client: TestClient):
        """Test stats with invalid short code format."""
        response = client.get("/stats/invalid@code")
        assert response.status_code == 404


class TestEndToEndWorkflow:
    """Test complete end-to-end workflows."""
    
    def test_complete_workflow(self, client: TestClient, valid_api_key: str):
        """Test complete workflow: create -> redirect -> stats."""
        original_url = "https://www.example.com/e2e-test"
        
        # 1. Create short URL
        response = client.post(
            "/shorten",
            json={"url": original_url},
            headers={"x-api-key": valid_api_key}
        )
        assert response.status_code == 200
        short_code = response.json()["data"]["short_code"]
        
        # 2. Check initial stats
        response = client.get(f"/stats/{short_code}")
        assert response.status_code == 200
        assert response.json()["data"]["click_count"] == 0
        
        # 3. Redirect multiple times
        for _ in range(3):
            response = client.get(f"/{short_code}", follow_redirects=False)
            assert response.status_code == 302
            assert response.headers["location"] == original_url
        
        # 4. Check updated stats
        response = client.get(f"/stats/{short_code}")
        assert response.status_code == 200
        assert response.json()["data"]["click_count"] == 3
    
    def test_multiple_urls_workflow(self, client: TestClient, valid_api_key: str, sample_urls: list):
        """Test workflow with multiple URLs."""
        short_codes = []
        
        # Create multiple short URLs
        for url in sample_urls:
            response = client.post(
                "/shorten",
                json={"url": url},
                headers={"x-api-key": valid_api_key}
            )
            assert response.status_code == 200
            short_codes.append(response.json()["data"]["short_code"])
        
        # Verify all short codes are unique
        assert len(set(short_codes)) == len(short_codes)
        
        # Test redirection for each
        for i, short_code in enumerate(short_codes):
            response = client.get(f"/{short_code}", follow_redirects=False)
            assert response.status_code == 302
            assert response.headers["location"] == sample_urls[i]