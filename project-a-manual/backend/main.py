from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas
import crud
import models
from database import get_db, engine
from typing import List

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Notes API",
    description="A simple notes management API",
    version="1.0.0"
)

@app.post("/notes", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    return crud.create_note(db, note)

@app.get("/notes", response_model=List[schemas.NoteResponse])
def list_notes(db: Session = Depends(get_db)):
    return crud.get_notes(db)

@app.get("/notes/search", response_model=List[schemas.NoteResponse])
def search_notes(keyword: str, db: Session = Depends(get_db)):
    return crud.search_notes(db, keyword)

@app.get("/notes/{note_id}", response_model=schemas.NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = crud.get_note(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@app.put("/notes/{note_id}", response_model=schemas.NoteResponse)
def update_note(
    note_id: int,
    note_update: schemas.NoteUpdate,
    db: Session = Depends(get_db),
):
    note = crud.update_note(db, note_id, note_update)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@app.delete("/notes/{note_id}", status_code=204)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    success = crud.delete_note(db, note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)