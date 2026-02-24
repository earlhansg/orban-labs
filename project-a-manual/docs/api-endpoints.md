# API Endpoints

## Authentication
All require `X-API-Key` header.

## Endpoints

### Notes CRUD
```
GET /notes/          # List all notes
GET /notes/{id}      # Get specific note
POST /notes/         # Create note
PUT /notes/{id}      # Update note
DELETE /notes/{id}   # Delete note
```

### Request/Response Schema
```typescript
Note {
  id: number
  title: string
  body: string
  tags: string
  created_at: datetime
  updated_at: datetime
}

CreateNote {
  title: string
  body: string
  tags: string
}
```

## CORS
- Allowed origins: localhost:3000, 127.0.0.1:3000
- All methods and headers allowed