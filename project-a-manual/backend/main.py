from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import schemas
import crud
import models
from database import get_db, engine
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# API Key configuration
API_KEY = os.getenv("API_KEY", "your-secret-api-key-here")

# Initialize FastAPI app
app = FastAPI(
    title="Notes API",
    description="A simple notes management API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication dependency
async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    if not x_api_key or x_api_key != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    return x_api_key

# Health check endpoint (no authentication required)
@app.get("/health")
def health_check():
    """Health check endpoint to verify the API is running"""
    return {"status": "healthy", "message": "Notes API is running"}

@app.post("/notes", response_model=schemas.NoteResponse)
def create_note(
    note: schemas.NoteCreate, 
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    return crud.create_note(db, note)

@app.get("/notes", response_model=List[schemas.NoteResponse])
def list_notes(
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    return crud.get_notes(db)

@app.get("/notes/search", response_model=List[schemas.NoteResponse])
def search_notes(
    keyword: str, 
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    return crud.search_notes(db, keyword)

@app.get("/notes/{note_id}", response_model=schemas.NoteResponse)
def get_note(
    note_id: int, 
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    note = crud.get_note(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@app.put("/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(
    note_id: int,
    note_update: schemas.NoteUpdate,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    note = crud.update_note(db, note_id, note_update)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@app.delete("/notes/{note_id}", status_code=204)
def delete_note(
    note_id: int, 
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    success = crud.delete_note(db, note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)