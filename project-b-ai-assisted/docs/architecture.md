# URL Shortener Service Architecture

## Requirements Understanding

The URL shortener service is designed to provide a simple, secure, and efficient way to create shortened URLs with the following core requirements:

1. **URL Shortening**: Convert long URLs into short, unique codes
2. **Redirection**: Redirect users from short codes to original URLs
3. **Analytics**: Track click counts and provide statistics
4. **Security**: API key-based authentication for URL creation
5. **Persistence**: Store URLs and metadata in a database
6. **Edge Case Handling**: Handle duplicates, expiration, and invalid requests

## Chosen Architecture

### Clean Architecture Approach

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

### Component Structure

- **Routes**: Handle HTTP requests and responses
- **Schemas**: Pydantic models for request/response validation
- **Models**: SQLAlchemy ORM models for database entities
- **Utils**: Business logic for URL validation and short code generation
- **Auth**: API key validation middleware
- **Database**: Connection management and session handling

## Why FastAPI Was Selected

### Technical Advantages

1. **Performance**: Built on Starlette and Pydantic, offering excellent performance
2. **Type Safety**: Native support for Python type hints with runtime validation
3. **Auto Documentation**: Automatic OpenAPI/Swagger documentation generation
4. **Async Support**: Native async/await support for better concurrency
5. **Modern Python**: Leverages modern Python features (3.6+ type hints)

### Development Benefits

1. **Developer Experience**: Excellent IDE support with auto-completion
2. **Validation**: Automatic request/response validation with clear error messages
3. **Testing**: Built-in testing support with TestClient
4. **Standards Compliance**: Full OpenAPI 3.0 compliance

### Alternatives Considered

- **Flask**: More lightweight but requires additional libraries for validation and documentation
- **Django**: Too heavyweight for this simple service, includes unnecessary features
- **Starlette**: Lower-level, would require more boilerplate code

## Database Design Decisions

### SQLite Choice

**Pros:**
- File-based, no separate database server required
- ACID compliance
- Sufficient for moderate traffic loads
- Easy deployment and backup
- Built into Python standard library

**Cons:**
- Limited concurrent write performance
- Not suitable for high-traffic production (would migrate to PostgreSQL)

### Schema Design

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

**Design Rationale:**
- `short_code` as unique identifier for fast lookups
- `original_url` indexed for duplicate detection
- `click_count` for analytics
- `expires_at` nullable for optional expiration
- Separate `id` as primary key for database integrity

## API Design Decisions

### RESTful Principles

1. **POST /shorten**: Create new short URL (follows REST convention for creation)
2. **GET /{short_code}**: Redirect to original URL (semantic and user-friendly)
3. **GET /stats/{short_code}**: Retrieve analytics (clear intent)

### Response Format Standardization

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Handling

- HTTP status codes follow RFC standards
- Consistent error response format
- Detailed error messages for debugging

## Authentication Approach

### API Key Authentication

**Chosen Method**: Header-based API key (`x-api-key`)

**Rationale:**
- Simple to implement and use
- Suitable for service-to-service communication
- No session management required
- Easy to rotate and manage

**Security Considerations:**
- API keys should be transmitted over HTTPS only
- Keys should be stored securely (environment variables)
- Consider rate limiting in production

**Alternatives Considered:**
- **JWT**: Overkill for this simple service
- **OAuth 2.0**: Too complex for the use case
- **Basic Auth**: Less secure, credentials in every request

## Edge Case Handling Strategy

### Duplicate URL Handling

**Strategy**: Return existing short code for duplicate URLs
**Rationale**: Prevents database bloat and provides consistent user experience

### Short Code Collision

**Strategy**: Regenerate with retry mechanism (max 5 attempts)
**Implementation**: Use cryptographically secure random generation

### URL Validation

**Strategy**: Multi-layer validation
1. Pydantic URL validation
2. Custom business logic validation
3. Optional reachability check (configurable)

### Expiration Handling

**Strategy**: Soft deletion approach
- Expired URLs return HTTP 410 (Gone)
- Data retained for analytics
- Cleanup job can be implemented separately

## Tradeoffs Considered

### Performance vs. Simplicity

**Chosen**: Simplicity with SQLite
**Tradeoff**: Limited concurrent write performance
**Mitigation**: Easy migration path to PostgreSQL

### Security vs. Usability

**Chosen**: Simple API key authentication
**Tradeoff**: Less sophisticated than OAuth
**Justification**: Appropriate for the service scope

### Storage vs. Performance

**Chosen**: Store full URLs in database
**Tradeoff**: More storage usage
**Benefit**: No external dependencies, better reliability

## Alternatives Rejected

### NoSQL Database (MongoDB, DynamoDB)

**Rejected Because:**
- Overkill for simple relational data
- SQL provides better consistency guarantees
- More complex deployment

### Microservices Architecture

**Rejected Because:**
- Service is simple enough for monolithic approach
- Unnecessary complexity for current requirements
- Easier deployment and maintenance as monolith

### Redis as Primary Storage

**Rejected Because:**
- In-memory storage not suitable for persistent URLs
- Would require additional persistence layer
- More complex backup and recovery

## Scalability Considerations

### Current Architecture Limitations

1. SQLite write concurrency
2. Single-instance deployment
3. No caching layer

### Migration Path for Scale

1. **Database**: SQLite → PostgreSQL
2. **Caching**: Add Redis for frequently accessed URLs
3. **Load Balancing**: Multiple application instances
4. **CDN**: Geographic distribution for redirects

## Monitoring and Observability

### Logging Strategy

- Structured logging with JSON format
- Request/response logging
- Error tracking with stack traces
- Performance metrics (response times)

### Health Checks

- Database connectivity check
- Application health endpoint
- Dependency status monitoring

## Security Considerations

### Input Validation

- URL format validation
- SQL injection prevention (ORM)
- XSS prevention in responses

### Rate Limiting

- API key-based rate limiting
- IP-based rate limiting for public endpoints
- Configurable limits per environment

### Data Protection

- No sensitive data in URLs
- Secure API key storage
- HTTPS enforcement in production

## Testing Strategy

### Unit Tests

- URL validation logic
- Short code generation
- Authentication middleware
- Database operations

### Integration Tests

- Full API endpoint testing
- Database integration
- Error scenario testing
- Performance testing

### Test Data Management

- Isolated test database
- Fixture-based test data
- Cleanup after tests