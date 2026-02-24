# Architecture Decision Records (ADRs)

## ADR-001: FastAPI + Next.js Stack
**Decision**: Use FastAPI for backend, Next.js for frontend
**Rationale**: 
- FastAPI: Fast development, automatic OpenAPI docs, type hints
- Next.js: React with SSR, excellent DX, built-in optimization

## ADR-002: SQLAlchemy ORM
**Decision**: Use SQLAlchemy with SQLite
**Rationale**: 
- ORM abstraction for database operations
- SQLite for simplicity in development/testing
- Easy migration to PostgreSQL later

## ADR-003: API Key Authentication
**Decision**: Simple API key in headers
**Rationale**: 
- Minimal auth for technical test
- Easy to implement and test
- Avoid OAuth complexity

## ADR-004: Comma-Separated Tags
**Decision**: Store tags as comma-separated text
**Rationale**: 
- Simple implementation
- Avoid many-to-many complexity
- Sufficient for basic tagging

## ADR-005: Modal-Based UI
**Decision**: Use modals for note creation/editing
**Rationale**: 
- Clean UX without page navigation
- Maintains context
- Responsive design friendly