# Orban Labs Technical Test

This repository contains two full-stack applications demonstrating different development approaches and technical implementations.

## Projects Overview

### Project A: Manual Development - Notes Management System
**Stack**: FastAPI + Next.js + SQLite  
**Approach**: Traditional manual development with comprehensive documentation

A full-stack notes management application featuring:
- **Backend**: FastAPI with SQLAlchemy ORM, API key authentication
- **Frontend**: Next.js 15 with TypeScript, modal-based UI, server actions
- **Features**: CRUD operations for notes, tagging system, search functionality
- **Architecture**: Clean separation with documented ADRs, comprehensive testing

**Key Highlights**:
- Manual implementation showcasing traditional development workflow
- Detailed architecture decision records (ADRs)
- Comprehensive test coverage with pytest
- Production-ready authentication and validation

### Project B: AI-Assisted Development - URL Shortener Service
**Stack**: FastAPI + Next.js + SQLite  
**Approach**: AI-assisted development with documented AI usage

A production-ready URL shortener service featuring:
- **Backend**: FastAPI with clean architecture, analytics tracking
- **Frontend**: Next.js 15 with Tailwind CSS, responsive dashboard
- **Features**: URL shortening, click analytics, API key authentication, duplicate handling
- **Architecture**: Clean architecture principles, comprehensive error handling

**Key Highlights**:
- AI-assisted development with complete usage documentation
- Modern tech stack (Next.js 15, Tailwind CSS)
- Production-ready features (analytics, security, validation)
- Documented prompts and AI interaction logs

## Technical Comparison

| Aspect | Project A (Manual) | Project B (AI-Assisted) |
|--------|-------------------|-------------------------|
| **Development Time** | Traditional pace | Accelerated with AI |
| **Code Quality** | Manual review & refinement | AI-generated + human oversight |
| **Documentation** | Comprehensive manual docs | AI-generated + curated |
| **Testing** | Full pytest suite | Comprehensive test coverage |
| **Architecture** | Traditional planning | AI-assisted architecture design |
| **UI/UX** | Custom modal-based design | Modern Tailwind components |

## Repository Structure

```
orban-labs/
├── project-a-manual/          # Traditional development approach
│   ├── backend/               # FastAPI notes API
│   ├── frontend/              # Next.js notes interface
│   ├── test/                  # Comprehensive test suite
│   └── docs/                  # Architecture & API documentation
└── project-b-ai-assisted/     # AI-assisted development
    ├── backend/               # FastAPI URL shortener
    ├── frontend/              # Next.js dashboard
    ├── tests/                 # Backend test suite
    ├── prompts/               # AI prompts used
    └── docs/                  # Architecture & AI usage logs
```

Both projects demonstrate production-ready full-stack applications with different development methodologies, showcasing the evolution of modern software development practices.