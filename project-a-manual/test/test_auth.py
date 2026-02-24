import pytest
from fastapi.testclient import TestClient


class TestAuthentication:
    """Test suite for API authentication"""

    def test_valid_api_key_access(self, client, auth_headers, sample_note_data):
        """Test that valid API key allows access to protected endpoints"""
        response = client.post("/notes", json=sample_note_data, headers=auth_headers)
        assert response.status_code == 200
        assert "id" in response.json()

    def test_invalid_api_key_denied(self, client, invalid_auth_headers, sample_note_data):
        """Test that invalid API key is denied access"""
        response = client.post("/notes", json=sample_note_data, headers=invalid_auth_headers)
        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid or missing API key"

    def test_missing_api_key_denied(self, client, sample_note_data):
        """Test that missing API key is denied access"""
        response = client.post("/notes", json=sample_note_data)
        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid or missing API key"

    def test_empty_api_key_denied(self, client, sample_note_data):
        """Test that empty API key is denied access"""
        headers = {"X-API-Key": ""}
        response = client.post("/notes", json=sample_note_data, headers=headers)
        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid or missing API key"

    def test_case_sensitive_api_key_header(self, client, valid_api_key, sample_note_data):
        """Test that API key header is case-insensitive (FastAPI handles this)"""
        headers = {"x-api-key": valid_api_key}  # lowercase header
        response = client.post("/notes", json=sample_note_data, headers=headers)
        assert response.status_code == 200

    def test_auth_required_for_all_note_endpoints(self, client, sample_note_data):
        """Test that all note endpoints require authentication"""
        endpoints_and_methods = [
            ("GET", "/notes"),
            ("POST", "/notes"),
            ("GET", "/notes/1"),
            ("PUT", "/notes/1"),
            ("DELETE", "/notes/1"),
            ("GET", "/notes/search?keyword=test"),
        ]

        for method, endpoint in endpoints_and_methods:
            if method == "GET":
                response = client.get(endpoint)
            elif method == "POST":
                response = client.post(endpoint, json=sample_note_data)
            elif method == "PUT":
                response = client.put(endpoint, json=sample_note_data)
            elif method == "DELETE":
                response = client.delete(endpoint)

            assert response.status_code == 401, f"Endpoint {method} {endpoint} should require auth"
            assert response.json()["detail"] == "Invalid or missing API key"

    def test_www_authenticate_header_present(self, client, sample_note_data):
        """Test that WWW-Authenticate header is present in 401 responses"""
        response = client.post("/notes", json=sample_note_data)
        assert response.status_code == 401
        assert "WWW-Authenticate" in response.headers
        assert response.headers["WWW-Authenticate"] == "ApiKey"