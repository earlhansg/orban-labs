# Setup Guide

## Prerequisites
- Python 3.8+
- Node.js 18+
- npm/yarn

## Backend Setup
```bash
cd backend/
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

## Frontend Setup
```bash
cd frontend/
npm install
npm run dev
# Runs on http://localhost:3000
```

## Environment Variables
Create `.env` in backend/:
```
API_KEY=your-secret-api-key-here
```

## Testing
```bash
cd test/
pytest
```

## Database
- SQLite database auto-created on first run
- Located at `./sql_app.db` in backend directory
- Tables created automatically via SQLAlchemy