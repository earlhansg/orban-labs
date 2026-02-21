from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
from datetime import datetime, timezone

def _tags_to_str(tags: List[str]) -> str:
    return ",".join(tags)

def create_note(db: Session, note: schemas.NoteCreate):
    db_note = models.Note(
        title=note.title,
        body=note.body,
        tags=_tags_to_str(note.tags),
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_note(db: Session, note_id: int):
    return db.query(models.Note).filter(models.Note.id == note_id).first()

def get_notes(db: Session, skip: int = 0, limit: int = 50):
    return db.query(models.Note).offset(skip).limit(limit).all()

def update_note(db: Session, note_id: int, note_update: schemas.NoteUpdate):
    db_note = get_note(db, note_id)
    if not db_note:
        return None

    update_data = note_update.model_dump(exclude_unset=True)

    if "tags" in update_data:
        update_data["tags"] = _tags_to_str(update_data["tags"])

    for field, value in update_data.items():
        setattr(db_note, field, value)

    db_note.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(db_note)
    return db_note