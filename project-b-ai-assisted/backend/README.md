# URL Shortener Service

A production-ready URL shortener service built with FastAPI, featuring secure API key authentication, comprehensive analytics, and robust error handling.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, unique codes (6-8 characters)
- **Secure Redirection**: Fast HTTP 302 redirects with click tracking
- **Analytics**: Detailed statistics including click counts and creation timestamps
- **API Key Authentication**: Secure endpoint protection for URL creation
- **Edge Case Handling**: Duplicate detection, expiration support, collision resolution
- **Production Ready**: Comprehensive error handling, logging, and validation

## 🏗️ Architecture

The service follows clean architecture principles with clear separation of concerns:

```
┌─────────────────┐
│   API Layer     │  ← FastAPI routes, request/response handling
├─────────────────┤
│ Business Logic  │  ← URL validation, short code generation, auth
├─────────────────┤
│ Data Access     │  ← SQLAlchemy models, database operations
├─────────────────┤
│   Database      │  ← SQLite storage
└─────────────────┘
```

## 📋 Requirements

- Python 3.11+
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

## 🛠️ Installation

### 1. Clone and Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Database
DATABASE_URL=sqlite:///./url_shortener.db

# Authentication
API_KEY=your-secret-api-key-here

# Application
DEBUG=false
```

### 3. Run the Application

```bash
# Development mode
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The service will be available at `http://localhost:8000`

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-25T10:30:00Z",
  "version": "1.0.0"
}
```

#### 2. Create Short URL (Protected)
```http
POST /shorten
Content-Type: application/json
x-api-key: your-secret-api-key-here

{
  "url": "https://www.example.com/very/long/url",
  "expires_at": "2026-12-31T23:59:59Z"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "short_code": "abc123",
    "original_url": "https://www.example.com/very/long/url",
    "short_url": "http://localhost:8000/abc123",
    "created_at": "2026-02-25T10:30:00Z",
    "expires_at": "2026-12-31T23:59:59Z"
  },
  "message": "URL shortened successfully"
}
```

#### 3. Redirect (Public)
```http
GET /{short_code}
```

**Responses:**
- `302 Found`: Redirects to original URL
- `404 Not Found`: Short code doesn't exist
- `410 Gone`: Short URL has expired

#### 4. Get Statistics
```http
GET /stats/{short_code}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "short_code": "abc123",
    "original_url": "https://www.example.com/very/long/url",
    "click_count": 42,
    "created_at": "2026-02-25T10:30:00Z",
    "expires_at": "2026-12-31T23:59:59Z",
    "is_expired": false
  }
}
```

## 🧪 Testing

### Run Tests

```bash
# Install test dependencies
pip install -r tests/requirements.txt

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test categories
pytest -m unit          # Unit tests only
pytest -m integration   # Integration tests only
```

### Test Coverage

The test suite includes:

- **Unit Tests**: URL validation, short code generation, authentication
- **Integration Tests**: Full API endpoint testing with database
- **Edge Cases**: Duplicates, expiration, invalid inputs, error scenarios

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./url_shortener.db` | Database connection string |
| `API_KEY` | `your-secret-api-key-here` | API key for authentication |
| `SHORT_CODE_LENGTH` | `6` | Default short code length |
| `MAX_SHORT_CODE_LENGTH` | `8` | Maximum short code length |
| `MAX_URL_LENGTH` | `2048` | Maximum URL length |
| `DEBUG` | `false` | Enable debug mode |

### Security Considerations

1. **API Key**: Use a strong, unique API key in production
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **Database**: Use PostgreSQL for production instead of SQLite

## 🚀 Deployment

### Docker Deployment

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app/ ./app/
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Checklist

- [ ] Set strong API key
- [ ] Configure production database (PostgreSQL)
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up backup strategy
- [ ] Configure environment variables
- [ ] Set up health checks

## 📊 Database Schema

```sql
CREATE TABLE urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code VARCHAR(8) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    click_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NULL
);

CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_original_url ON urls(original_url);
```

## 🔍 Monitoring

### Health Checks

The service provides a health check endpoint at `/health` that returns:
- Service status
- Current timestamp
- Application version

### Logging

The application logs:
- Request/response information
- Error details with stack traces
- Performance metrics
- Authentication attempts

## 🤝 Contributing

1. Follow PEP 8 style guidelines
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database locked error**: Ensure only one instance is running
2. **Permission denied**: Check file permissions for database file
3. **Import errors**: Ensure virtual environment is activated
4. **Port already in use**: Change port in uvicorn command

### Support

For issues and questions:
1. Check the logs for error details
2. Verify environment configuration
3. Ensure all dependencies are installed
4. Check database connectivity