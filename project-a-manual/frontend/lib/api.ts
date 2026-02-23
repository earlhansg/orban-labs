import { Note, NoteCreate, NoteUpdate } from '@/types/note';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const notesApi = {
  // Get all notes
  getNotes: (): Promise<Note[]> => {
    return fetchApi<Note[]>('/notes');
  },

  // Search notes by keyword
  searchNotes: (keyword: string): Promise<Note[]> => {
    const params = new URLSearchParams({ keyword });
    return fetchApi<Note[]>(`/notes/search?${params}`);
  },

  // Get a single note
  getNote: (id: number): Promise<Note> => {
    return fetchApi<Note>(`/notes/${id}`);
  },

  // Create a new note
  createNote: (note: NoteCreate): Promise<Note> => {
    return fetchApi<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  },

  // Update a note
  updateNote: (id: number, note: NoteUpdate): Promise<Note> => {
    return fetchApi<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  },

  // Delete a note
  deleteNote: (id: number): Promise<void> => {
    return fetchApi<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },
};