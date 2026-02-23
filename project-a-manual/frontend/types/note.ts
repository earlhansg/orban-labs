export interface Note {
  id: number;
  title: string;
  body: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface NoteCreate {
  title: string;
  body: string;
  tags: string[];
}

export interface NoteUpdate {
  title?: string;
  body?: string;
  tags?: string[];
}

export interface NotesSearchParams {
  keyword?: string;
  tag?: string;
}