import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function extractAllTags(notes: Array<{ tags: string[] }>): string[] {
  const allTags = notes.flatMap(note => note.tags);
  return Array.from(new Set(allTags)).sort();
}

export function filterNotesByTag(notes: Array<{ tags: string[] }>, tag: string) {
  if (!tag) return notes;
  return notes.filter(note => note.tags.includes(tag));
}