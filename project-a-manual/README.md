# Project A Manual

A full-stack application with FastAPI backend and Next.js frontend for managing notes.

## Project Structure

```
project-a-manual/
├── backend/           # FastAPI backend
├── frontend/          # Next.js frontend
└── test/             # Test files
```

## Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **npm** or **yarn** (for frontend package management)

## Getting Started

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the backend server:**
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8001
   ```

The backend API will be available at: `http://127.0.0.1:8001`

**API Documentation:** `http://127.0.0.1:8001/docs` (Swagger UI)

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

The frontend application will be available at: `http://localhost:3000`

## Available Scripts

### Backend
- `uvicorn main:app --reload --host 127.0.0.1 --port 8001` - Start development server with hot reload
- `python -m pytest` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server implementation
- **Pytest** - Testing framework

### Frontend
- **Next.js 16** - React framework with server-side rendering
- **React 19** - JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Development Workflow

1. **Start the backend server** (runs on port 8001)
2. **Start the frontend server** (runs on port 3000)
3. The frontend will communicate with the backend API

## API Endpoints

The backend provides RESTful API endpoints for managing notes. Visit `http://127.0.0.1:8001/docs` for interactive API documentation.

## Environment Configuration

### Backend
Create a `.env` file in the backend directory if needed for environment variables.

### Frontend
Create a `.env.local` file in the frontend directory for environment variables:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
```