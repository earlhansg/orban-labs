# URL Shortener Service - AI-Assisted Development

A production-ready URL shortener service built with FastAPI, demonstrating AI-assisted software engineering practices and clean architecture principles.

## 📁 Project Structure

```
project-b-ai-assisted/
├── docs/                    # Architecture documentation and AI usage tracking
│   ├── architecture.md      # Detailed architectural decisions and rationale
│   └── ai-usage-log.md     # Complete log of AI assistance used
├── prompts/                 # All prompts used for AI generation
│   └── 01-project-structure.md
├── backend/                 # FastAPI backend implementation
│   ├── app/                # Application source code
│   │   ├── main.py         # FastAPI application entry point
│   │   ├── models.py       # SQLAlchemy database models
│   │   ├── database.py     # Database configuration and session management
│   │   ├── schemas.py      # Pydantic request/response models
│   │   ├── routes.py       # API route handlers
│   │   ├── auth.py         # Authentication middleware
│   │   ├── utils.py        # Utility functions
│   │   └── config.py       # Configuration management
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example       # Environment configuration template
│   └── README.md          # Backend setup and usage instructions
└── tests/                  # Comprehensive test suite
    ├── conftest.py        # Test configuration and fixtures
    ├── test_main.py       # Integration tests for API endpoints
    ├── test_utils.py      # Unit tests for utility functions
    ├── test_auth.py       # Authentication tests
    ├── test_models.py     # Database model tests
    ├── pytest.ini        # Test configuration
    └── requirements.txt   # Test dependencies
```

## 🎯 Project Overview

This URL shortener service demonstrates:

- **Clean Architecture**: Clear separation of concerns with dependency injection
- **Production Readiness**: Comprehensive error handling, validation, and testing
- **AI-Assisted Development**: Complete documentation of AI usage and prompts
- **Security**: API key authentication and input validation
- **Scalability**: Database design optimized for performance

## 🚀 Quick Start

### 1. Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API key
```

### 3. Run the Service

```bash
uvicorn app.main:app --reload
```

The service will be available at `http://localhost:8000`

### 4. Test the API

```bash
# Create a short URL
curl -X POST "http://localhost:8000/shorten" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-here" \
  -d '{"url": "https://www.example.com"}'

# Use the short URL (replace abc123 with actual short code)
curl -L "http://localhost:8000/abc123"

# Get statistics
curl "http://localhost:8000/stats/abc123"
```

## 🧪 Running Tests

```bash
cd tests
pip install -r requirements.txt
pytest --cov=app --cov-report=html
```

## 📚 Documentation

### Architecture Documentation

- **[Architecture Decisions](docs/architecture.md)**: Comprehensive architectural documentation including technology choices, design decisions, and tradeoffs
- **[AI Usage Log](docs/ai-usage-log.md)**: Complete tracking of AI assistance used in development

### API Documentation

- **Interactive Docs**: `http://localhost:8000/docs` (Swagger UI)
- **Alternative Docs**: `http://localhost:8000/redoc` (ReDoc)
- **Backend README**: [backend/README.md](backend/README.md)

### Prompts Documentation

All prompts used for AI generation are stored in the `prompts/` folder with:
- Exact prompt text
- Model name used (Anthropic Claude Sonnet 4)
- Generation context

## 🏗️ Architecture Highlights

### Clean Architecture Implementation

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

### Key Features

- **URL Shortening**: Secure creation of short URLs with collision handling
- **Smart Redirection**: HTTP 302 redirects with click tracking
- **Analytics**: Comprehensive statistics and usage tracking
- **Security**: API key authentication for protected endpoints
- **Edge Cases**: Duplicate handling, expiration support, validation

### Technology Stack

- **Backend**: FastAPI with Python 3.11+
- **Database**: SQLAlchemy ORM with SQLite
- **Validation**: Pydantic for request/response validation
- **Testing**: pytest with comprehensive coverage
- **Documentation**: Auto-generated OpenAPI/Swagger docs

## 🤖 AI-Assisted Development

This project showcases effective AI-assisted engineering:

### AI Usage Highlights

- **Complete Generation**: Entire project generated from a single comprehensive prompt
- **Production Quality**: No manual modifications required
- **Best Practices**: Clean architecture, comprehensive testing, security
- **Documentation**: Thorough architectural documentation and AI usage tracking

### Lessons Learned

1. **Detailed Prompts**: Specific requirements lead to better outputs
2. **Constraints**: Clear constraints prevent scope creep
3. **Quality Requirements**: Specifying production-ready requirements improves code quality
4. **Documentation**: AI can generate comprehensive technical documentation

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///./url_shortener.db` |
| `API_KEY` | Authentication API key | `your-secret-api-key-here` |
| `SHORT_CODE_LENGTH` | Default short code length | `6` |
| `DEBUG` | Enable debug mode | `false` |

### Security Considerations

- Use strong API keys in production
- Enable HTTPS for production deployment
- Consider rate limiting for public endpoints
- Migrate to PostgreSQL for production scale

## 📊 Testing Strategy

### Test Coverage

- **Unit Tests**: Utility functions, authentication, models
- **Integration Tests**: Full API endpoint testing
- **Edge Cases**: Error scenarios, expiration, validation
- **End-to-End**: Complete workflows from creation to analytics

### Test Categories

```bash
pytest -m unit          # Unit tests only
pytest -m integration   # Integration tests only
pytest --cov=app        # With coverage report
```

## 🚀 Deployment

### Production Checklist

- [ ] Configure production database (PostgreSQL)
- [ ] Set strong API key
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Implement backup strategy
- [ ] Set up health checks

### Docker Deployment

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/app/ ./app/
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 Contributing

1. Follow clean architecture principles
2. Add comprehensive tests for new features
3. Update documentation
4. Document any AI assistance used

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:

1. Check the [backend README](backend/README.md) for setup instructions
2. Review the [architecture documentation](docs/architecture.md)
3. Examine the [AI usage log](docs/ai-usage-log.md) for development context
4. Run the test suite to verify functionality

---

**Note**: This project demonstrates AI-assisted software engineering practices. All AI usage is documented in the `docs/ai-usage-log.md` file for transparency and learning purposes.