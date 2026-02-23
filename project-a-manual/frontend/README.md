# Orban Labs Notes Frontend

A modern Next.js frontend for the Notes API with search and tagging functionality.

## Features

- 📝 Browse all notes in a responsive grid layout
- 🔍 Real-time search functionality
- 🏷️ Filter notes by tags
- 🎨 Clean, modern UI with dark mode support
- ⚡ Server-side rendering with Next.js App Router
- 🔄 Optimistic updates and loading states

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Server Components** - For optimal performance

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.local.example .env.local
```

3. Update the API URL in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/
│   ├── notes/
│   │   ├── page.tsx          # Notes listing page (Server Component)
│   │   ├── notes-client.tsx  # Client-side search/filter logic
│   │   ├── loading.tsx       # Loading UI
│   │   └── error.tsx         # Error boundary
│   ├── layout.tsx            # Root layout with navigation
│   └── page.tsx              # Home page
├── components/
│   └── navigation.tsx        # Navigation component
├── lib/
│   ├── api.ts               # API client functions
│   └── utils.ts             # Utility functions
└── types/
    └── note.ts              # TypeScript interfaces
```

## API Integration

The frontend communicates with the FastAPI backend through a typed API client (`lib/api.ts`) that provides:

- `getNotes()` - Fetch all notes
- `searchNotes(keyword)` - Search notes by keyword
- `getNote(id)` - Get single note
- `createNote(note)` - Create new note
- `updateNote(id, note)` - Update existing note
- `deleteNote(id)` - Delete note

## Performance Features

- **Server Components** - Initial page load is server-rendered
- **Suspense Boundaries** - Graceful loading states
- **Error Boundaries** - Robust error handling
- **Optimistic Updates** - Immediate UI feedback
- **URL State Management** - Search and filter state in URL

## Usage

### Searching Notes
- Use the search bar to find notes by title, body, or tags
- Search is performed server-side for optimal performance

### Filtering by Tags
- Use the tag dropdown to filter notes by specific tags
- Tags are extracted from all available notes

### Combining Search and Filters
- Search and tag filters can be used together
- URL parameters preserve state for sharing and bookmarking

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)
