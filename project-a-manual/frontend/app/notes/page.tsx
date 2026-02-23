import { Suspense } from 'react';
import { notesApi } from '@/lib/api';
import { Note } from '@/types/note';
import { extractAllTags } from '@/lib/utils';
import { Metadata } from 'next';
import NotesPageClient from './notes-page-client';

export const metadata: Metadata = {
  title: 'Notes - Orban Labs',
  description: 'Browse and search your notes',
};

interface NotesPageProps {
  searchParams: Promise<{
    search?: string;
    tag?: string;
  }>;
}

async function getNotes(): Promise<Note[]> {
  try {
    return await notesApi.getNotes();
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return [];
  }
}

async function searchNotes(keyword: string): Promise<Note[]> {
  try {
    return await notesApi.searchNotes(keyword);
  } catch (error) {
    console.error('Failed to search notes:', error);
    return [];
  }
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const { search, tag } = params;

  // Fetch notes based on search parameter
  const notes = search ? await searchNotes(search) : await getNotes();
  
  // Extract all available tags for filtering
  const allTags = extractAllTags(notes);

  return (
    <Suspense fallback={<NotesLoadingSkeleton />}>
      <NotesPageClient 
        initialNotes={notes}
        availableTags={allTags}
        initialSearch={search || ''}
        initialTag={tag || ''}
      />
    </Suspense>
  );
}

function NotesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md flex-1 animate-pulse" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-full sm:w-48 animate-pulse" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            </div>
            <div className="flex gap-2 mb-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}