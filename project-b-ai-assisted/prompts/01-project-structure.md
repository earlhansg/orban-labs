# Prompt 01: Project Structure and Complete Implementation

**Model Used**: Anthropic Claude Sonnet 4  
**Date**: February 25, 2026  
**Purpose**: Generate complete URL shortener service with backend, tests, and documentation

## Exact Prompt Text

```
## 🎯 Role

You are a senior Python backend engineer building a production-ready URL shortener service.

---

# 📁 REQUIRED PROJECT STRUCTURE

You MUST generate the following structure exactly:

```
/project-b-ai-assisted/
  /docs/        → planning notes + AI usage log
  /prompts/     → every prompt used, with model name
  /backend/     → FastAPI backend implementation
  /tests/       → unit + integration tests
```

⚠️ Do NOT create a frontend folder.
⚠️ Do NOT omit any required folder.

---

# 📌 Documentation Requirements (`/docs/`)

### 1️⃣ architecture.md

Include:

* Requirements understanding
* Chosen architecture
* Why FastAPI was selected
* Database design decisions
* API design decisions
* Authentication approach
* Edge case handling strategy
* Tradeoffs considered
* Alternatives rejected

---

### 2️⃣ ai-usage-log.md

Include:

* Each AI prompt used
* Model name
* What was generated
* What was manually modified
* Why modifications were made

---

# 📌 `/prompts/` Folder

Store every prompt used to generate this project.

File naming format:

```
01-project-structure.md
02-backend-generation.md
03-tests-generation.md
```

Each file must contain:

* The exact prompt text
* The model name used

---

# 📌 Backend Requirements (`/backend/`)

## Tech Stack

* Python 3.11+
* FastAPI
* SQLAlchemy ORM
* SQLite (file-based DB)
* Pydantic
* Uvicorn
* python-dotenv for environment variables
* pytest for testing

---

## Required Features

### 1️⃣ Create Short URL (Protected)

**POST /shorten**

* Requires header: `x-api-key`
* Validate URL
* Prevent duplicate long URLs
* Generate unique 6–8 character short code
* Persist to SQLite
* Return structured JSON

---

### 2️⃣ Redirect (Public)

**GET /{short_code}**

* If valid → increment click_count → HTTP 302 redirect
* If not found → 404
* If expired → 410

---

### 3️⃣ Stats Endpoint

**GET /stats/{short_code}**

Returns:

* short_code
* original_url
* click_count
* created_at
* expires_at

---

# 📌 Edge Cases to Handle

* Duplicate URLs → return existing short code
* Invalid URLs → 400
* Missing short code → 404
* Expired short code → 410
* Invalid or missing API key → 401
* Short code collision → regenerate safely

---

# 📌 Database Schema

Table: `urls`

| Column       | Type     | Constraints     |
| ------------ | -------- | --------------- |
| id           | Integer  | PK              |
| short_code   | String   | Unique, Indexed |
| original_url | String   | Indexed         |
| click_count  | Integer  | Default 0       |
| created_at   | DateTime | Default now     |
| expires_at   | DateTime | Nullable        |

---

# 📌 Backend Folder Structure

```
/backend/
  /app/
    main.py
    models.py
    database.py
    schemas.py
    routes.py
    auth.py
    utils.py
    config.py
  requirements.txt
  README.md
```

---

# 📌 Testing Requirements (`/tests/`)

Include:

### Unit Tests

* URL validation
* Short code generation
* API key validation

### Integration Tests

* POST /shorten
* GET redirect
* GET stats
* Expired link scenario

Use pytest and FastAPI TestClient.

---

# 📌 Output Requirements

1. Provide complete folder tree.
2. Provide full file contents.
3. No pseudo-code.
4. Code must be runnable.
5. Include setup instructions.
6. Follow clean architecture principles.
7. Use dependency injection for DB session.

---

# 🔥 Why This Version Is Strong

This version:

* Is backend-focused only
* Forces documentation maturity
* Shows AI-assisted engineering workflow
* Demonstrates architecture thinking
* Looks like a real take-home submission

---
```

## Generation Context

**Workspace**: D:\work\new project\technical\orban-labs  
**Target Directory**: project-b-ai-assisted  
**Requirements**: Complete backend service with no frontend components  

## Expected Outputs

1. Complete project folder structure
2. FastAPI backend implementation
3. SQLAlchemy database models
4. Comprehensive test suite
5. Architectural documentation
6. AI usage tracking
7. Setup and deployment instructions

## Success Criteria

- [ ] All required folders created
- [ ] Backend is production-ready
- [ ] All edge cases handled
- [ ] Comprehensive test coverage
- [ ] Clean architecture implemented
- [ ] Documentation is thorough
- [ ] Code is immediately runnable