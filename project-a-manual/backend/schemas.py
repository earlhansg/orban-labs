from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime


class NoteBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Note title")
    body: str = Field(default="", description="Note body content")
    tags: List[str] = Field(default=[], description="List of tags")

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, v):
        cleaned = []
        for tag in v:
            tag = tag.strip().lower()
            if tag:
                if len(tag) > 50:
                    raise ValueError(f"Tag '{tag}' exceeds 50 characters")
                cleaned.append(tag)
        return list(dict.fromkeys(cleaned))  # deduplicate, preserve order


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    body: Optional[str] = None
    tags: Optional[List[str]] = None

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, v):
        if v is None:
            return v
        cleaned = []
        for tag in v:
            tag = tag.strip().lower()
            if tag:
                if len(tag) > 50:
                    raise ValueError(f"Tag '{tag}' exceeds 50 characters")
                cleaned.append(tag)
        return list(dict.fromkeys(cleaned))


class NoteResponse(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, v):
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        return v