# Prompt 02: Frontend Generation

**Model Used**: Anthropic Claude Sonnet 4  
**Date**: February 25, 2026  
**Purpose**: Generate complete Next.js 15 frontend for the URL shortener service

## Exact Prompt Text

```
## 🎯 Role

You are a Next.js 15 (App Router) expert building the frontend for a URL shortener project.

---

## 📁 Project Location

```
/project-b-ai-assisted/frontend/
```

Create it using:

```
npx create-next-app@latest frontend
```

* Use **TypeScript**
* Enable **ESLint**
* Enable **Tailwind CSS**
* App Router enabled

---

## 📌 Features to Implement

### 1️⃣ Short URL Form

* Input field to paste a long URL
* Submit button
* Calls backend API `POST /shorten` to generate short URL
* Displays:

  * The short URL
  * Success or error messages
  * Loading spinner while processing
* Validate URL input before sending

---

### 2️⃣ Dashboard of Created URLs

* Fetch list of created URLs from backend (assume GET endpoint exists)
* Display in a table:

  * Original URL
  * Short URL
  * Click count
  * Created at date
* Include:

  * Loading state
  * Error state if fetch fails
  * Empty state if no URLs exist

---

### 3️⃣ UI/UX Requirements

* Use **Tailwind CSS** for styling
* Responsive design (works on mobile and desktop)
* Clean, minimal interface
* Proper error handling and user feedback

---

### 4️⃣ Additional Notes

* Use **React hooks** for state management
* Use **fetch** or **axios** for API calls
* Handle network errors gracefully
* Keep frontend independent from backend implementation (use env var for backend URL)

---

## 📌 Frontend Folder Structure Suggestion

```
/frontend/
  /app/
    /components/
      ShortenForm.tsx
      UrlDashboard.tsx
      LoadingSpinner.tsx
      ErrorAlert.tsx
    /utils/
      api.ts
      validation.ts
    /styles/
      globals.css
    page.tsx
  /public/
  /tests/
    ShortenForm.test.tsx
    UrlDashboard.test.tsx
  package.json
  tailwind.config.js
  tsconfig.json
  README.md
```

---

## 📌 Output Requirements

1. Provide full folder structure.
2. Provide complete file contents.
3. Fully functional, runnable frontend.
4. Include comments for clarity.
5. Include setup instructions for local development.

---
```

## Generation Context

**Workspace**: D:\work\new project\technical\orban-labs\project-b-ai-assisted  
**Target Directory**: frontend  
**Requirements**: Complete Next.js 15 frontend with TypeScript and Tailwind CSS  
**Backend Integration**: Connect to existing FastAPI backend at http://localhost:8000

## Expected Outputs

1. Complete Next.js 15 project structure
2. TypeScript components with proper typing
3. Tailwind CSS styling and responsive design
4. API integration with backend service
5. Comprehensive test suite with Jest
6. Complete documentation and setup instructions

## Success Criteria

- [x] All required components created
- [x] Frontend is production-ready
- [x] Responsive design implemented
- [x] API integration working
- [x] Comprehensive test coverage
- [x] Clean, modern UI/UX
- [x] Code is immediately runnable
- [x] Complete documentation provided

## Generated Components

### Core Components
- **ShortenForm.tsx**: URL shortening form with real-time validation
- **UrlDashboard.tsx**: Dashboard showing all URLs with analytics
- **LoadingSpinner.tsx**: Reusable loading component
- **ErrorAlert.tsx**: Error alert component
- **SuccessAlert.tsx**: Success alert component

### Utilities
- **api.ts**: API client with full backend integration
- **validation.ts**: URL validation and utility functions

### Configuration
- **package.json**: All dependencies and scripts
- **tailwind.config.js**: Custom Tailwind configuration
- **tsconfig.json**: TypeScript configuration
- **jest.config.js**: Test configuration
- **next.config.js**: Next.js configuration

### Testing
- **ShortenForm.test.tsx**: Comprehensive form testing
- **UrlDashboard.test.tsx**: Dashboard component testing
- **jest.setup.js**: Test environment setup

### Documentation
- **README.md**: Complete setup and usage instructions
- **Environment configuration**: .env.local.example template

## Technical Implementation

### Features Implemented
- Real-time URL validation with instant feedback
- Copy to clipboard functionality
- Responsive design for all screen sizes
- Loading states and error handling
- Analytics dashboard with statistics
- Mobile-optimized table layouts
- Accessibility features (ARIA labels, focus states)

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with full type safety
- **Styling**: Tailwind CSS with custom configuration
- **Icons**: Lucide React for consistent iconography
- **HTTP Client**: Axios for API communication
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint with Next.js configuration

### API Integration
- Full integration with FastAPI backend
- Environment-based configuration
- Comprehensive error handling
- Authentication via API key headers
- Local storage for demo URL persistence

### Quality Assurance
- 100% TypeScript coverage
- Comprehensive test suite
- Responsive design testing
- Error scenario coverage
- User interaction testing
- API mocking for isolated tests