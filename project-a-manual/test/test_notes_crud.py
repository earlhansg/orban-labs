import pytest
from datetime import datetime


class TestNotesCRUD:
    """Test suite for Notes CRUD operations"""

    def test_create_note_success(self, client, auth_headers, sample_note_data):
        """Test successful note creation"""
        response = client.post("/notes", json=sample_note_data, headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["title"] == sample_note_data["title"]
        assert data["body"] == sample_note_data["body"]
        assert data["tags"] == sample_note_data["tags"]
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data
        
        # Verify datetime format
        datetime.fromisoformat(data["created_at"].replace("Z", "+00:00"))
        datetime.fromisoformat(data["updated_at"].replace("Z", "+00:00"))

    def test_create_note_minimal_data(self, client, auth_headers):
        """Test note creation with minimal required data"""
        minimal_note = {"title": "Minimal Note"}
        response = client.post("/notes", json=minimal_note, headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["title"] == "Minimal Note"
        assert data["body"] == ""
        assert data["tags"] == []

    def test_create_note_empty_title_fails(self, client, auth_headers):
        """Test that empty title fails validation"""
        invalid_note = {"title": "", "body": "Test body"}
        response = client.post("/notes", json=invalid_note, headers=auth_headers)
        
        assert response.status_code == 422
        assert "title" in str(response.json())

    def test_create_note_missing_title_fails(self, client, auth_headers):
        """Test that missing title fails validation"""
        invalid_note = {"body": "Test body"}
        response = client.post("/notes", json=invalid_note, headers=auth_headers)
        
        assert response.status_code == 422

    def test_create_note_long_title_fails(self, client, auth_headers):
        """Test that overly long title fails validation"""
        invalid_note = {"title": "x" * 256, "body": "Test body"}
        response = client.post("/notes", json=invalid_note, headers=auth_headers)
        
        assert response.status_code == 422

    def test_create_note_with_tags_deduplication(self, client, auth_headers):
        """Test that duplicate tags are removed and normalized"""
        note_data = {
            "title": "Test Note",
            "body": "Test body",
            "tags": ["Test", "API", "test", "  API  ", "Sample"]
        }
        response = client.post("/notes", json=note_data, headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Tags should be deduplicated, lowercased, and trimmed
        assert data["tags"] == ["test", "api", "sample"]

    def test_create_note_long_tag_fails(self, client, auth_headers):
        """Test that overly long tag fails validation"""
        note_data = {
            "title": "Test Note",
            "tags": ["x" * 51]  # 51 characters, exceeds limit
        }
        response = client.post("/notes", json=note_data, headers=auth_headers)
        
        assert response.status_code == 422

    def test_get_all_notes_empty(self, client, auth_headers):
        """Test getting all notes when database is empty"""
        response = client.get("/notes", headers=auth_headers)
        
        assert response.status_code == 200
        assert response.json() == []

    def test_get_all_notes_with_data(self, client, auth_headers, create_sample_note):
        """Test getting all notes when database has data"""
        # create_sample_note fixture creates one note
        response = client.get("/notes", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == create_sample_note["id"]

    def test_get_note_by_id_success(self, client, auth_headers, create_sample_note):
        """Test getting a specific note by ID"""
        note_id = create_sample_note["id"]
        response = client.get(f"/notes/{note_id}", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == note_id
        assert data["title"] == create_sample_note["title"]

    def test_get_note_by_id_not_found(self, client, auth_headers):
        """Test getting a non-existent note returns 404"""
        response = client.get("/notes/999", headers=auth_headers)
        
        assert response.status_code == 404
        assert response.json()["detail"] == "Note not found"

    def test_update_note_success(self, client, auth_headers, create_sample_note, sample_note_update_data):
        """Test successful note update"""
        note_id = create_sample_note["id"]
        response = client.put(f"/notes/{note_id}", json=sample_note_update_data, headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == note_id
        assert data["title"] == sample_note_update_data["title"]
        assert data["body"] == sample_note_update_data["body"]
        assert data["tags"] == sample_note_update_data["tags"]
        
        # Updated timestamp should be different from created timestamp
        assert data["updated_at"] != data["created_at"]

    def test_update_note_partial(self, client, auth_headers, create_sample_note):
        """Test partial note update (only title)"""
        note_id = create_sample_note["id"]
        update_data = {"title": "Partially Updated Title"}
        
        response = client.put(f"/notes/{note_id}", json=update_data, headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["title"] == "Partially Updated Title"
        # Other fields should remain unchanged
        assert data["body"] == create_sample_note["body"]
        assert data["tags"] == create_sample_note["tags"]

    def test_update_note_not_found(self, client, auth_headers, sample_note_update_data):
        """Test updating a non-existent note returns 404"""
        response = client.put("/notes/999", json=sample_note_update_data, headers=auth_headers)
        
        assert response.status_code == 404
        assert response.json()["detail"] == "Note not found"

    def test_update_note_invalid_data(self, client, auth_headers, create_sample_note):
        """Test updating note with invalid data"""
        note_id = create_sample_note["id"]
        invalid_update = {"title": ""}  # Empty title should fail
        
        response = client.put(f"/notes/{note_id}", json=invalid_update, headers=auth_headers)
        
        assert response.status_code == 422

    def test_delete_note_success(self, client, auth_headers, create_sample_note):
        """Test successful note deletion"""
        note_id = create_sample_note["id"]
        response = client.delete(f"/notes/{note_id}", headers=auth_headers)
        
        assert response.status_code == 204
        assert response.content == b""
        
        # Verify note is actually deleted
        get_response = client.get(f"/notes/{note_id}", headers=auth_headers)
        assert get_response.status_code == 404

    def test_delete_note_not_found(self, client, auth_headers):
        """Test deleting a non-existent note returns 404"""
        response = client.delete("/notes/999", headers=auth_headers)
        
        assert response.status_code == 404
        assert response.json()["detail"] == "Note not found"

    def test_search_notes_empty_database(self, client, auth_headers):
        """Test searching notes in empty database"""
        response = client.get("/notes/search?keyword=test", headers=auth_headers)
        
        assert response.status_code == 200
        assert response.json() == []

    def test_search_notes_by_title(self, client, auth_headers, create_sample_note):
        """Test searching notes by title"""
        response = client.get("/notes/search?keyword=Test", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == create_sample_note["id"]

    def test_search_notes_by_body(self, client, auth_headers, create_sample_note):
        """Test searching notes by body content"""
        response = client.get("/notes/search?keyword=test note body", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == create_sample_note["id"]

    def test_search_notes_by_tags(self, client, auth_headers, create_sample_note):
        """Test searching notes by tags"""
        response = client.get("/notes/search?keyword=sample", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == create_sample_note["id"]

    def test_search_notes_case_insensitive(self, client, auth_headers, create_sample_note):
        """Test that search is case insensitive"""
        response = client.get("/notes/search?keyword=TEST", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1

    def test_search_notes_no_matches(self, client, auth_headers, create_sample_note):
        """Test searching with keyword that has no matches"""
        response = client.get("/notes/search?keyword=nonexistent", headers=auth_headers)
        
        assert response.status_code == 200
        assert response.json() == []

    def test_search_notes_without_keyword(self, client, auth_headers, create_sample_note):
        """Test search endpoint without keyword parameter"""
        response = client.get("/notes/search", headers=auth_headers)
        
        assert response.status_code == 200
        # Should return all notes when no keyword is provided
        data = response.json()
        assert len(data) == 1

    def test_multiple_notes_operations(self, client, auth_headers):
        """Test creating multiple notes and various operations"""
        # Create multiple notes
        notes_data = [
            {"title": "First Note", "body": "First body", "tags": ["first"]},
            {"title": "Second Note", "body": "Second body", "tags": ["second"]},
            {"title": "Third Note", "body": "Third body", "tags": ["third"]},
        ]
        
        created_notes = []
        for note_data in notes_data:
            response = client.post("/notes", json=note_data, headers=auth_headers)
            assert response.status_code == 200
            created_notes.append(response.json())
        
        # Get all notes
        response = client.get("/notes", headers=auth_headers)
        assert response.status_code == 200
        assert len(response.json()) == 3
        
        # Search for specific note
        response = client.get("/notes/search?keyword=Second", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["title"] == "Second Note"
        
        # Update one note
        note_id = created_notes[0]["id"]
        update_data = {"title": "Updated First Note"}
        response = client.put(f"/notes/{note_id}", json=update_data, headers=auth_headers)
        assert response.status_code == 200
        
        # Delete one note
        note_id = created_notes[1]["id"]
        response = client.delete(f"/notes/{note_id}", headers=auth_headers)
        assert response.status_code == 204
        
        # Verify final state
        response = client.get("/notes", headers=auth_headers)
        assert response.status_code == 200
        assert len(response.json()) == 2