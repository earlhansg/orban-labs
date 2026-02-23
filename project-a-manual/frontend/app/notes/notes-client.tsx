'use client';

import { useState, useTransition, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Tag, Calendar, X, ExternalLink, Edit } from 'lucide-react';
import { Note } from '@/types/note';
import { formatDate } from '@/lib/utils';

interface NotesClientProps {
  initialNotes: Note[];
  availableTags: string[];
  initialSearch: string;
  initialTag: string;
  onEditNote?: (note: Note) => void;
}

export default function NotesClient({ 
  initialNotes, 
  availableTags, 
  initialSearch, 
  initialTag,
  onEditNote
}: NotesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedTag, setSelectedTag] = useState(initialTag);

  // Client-side filtering for immediate feedback (server handles actual search)
  const filteredNotes = useMemo(() => {
    let filtered = initialNotes;
    
    // If we have a selected tag, filter by it
    if (selectedTag) {
      filtered = filtered.filter(note => note.tags.includes(selectedTag));
    }
    
    return filtered;
  }, [initialNotes, selectedTag]);

  // Debounced URL update effect
  useEffect(() => {
    // Skip if values haven't changed from initial
    if (searchTerm === initialSearch && selectedTag === initialTag) {
      return;
    }

    const timeoutId = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Handle search parameter
        if (searchTerm.trim()) {
          params.set('search', searchTerm.trim());
        } else {
          params.delete('search');
        }
        
        // Handle tag parameter
        if (selectedTag) {
          params.set('tag', selectedTag);
        } else {
          params.delete('tag');
        }
        
        const newUrl = params.toString() ? `/notes?${params.toString()}` : '/notes';
        
        // Only navigate if URL actually changed
        const currentUrl = `/notes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        if (newUrl !== currentUrl) {
          router.push(newUrl);
        }
      });
    }, 300); // Reduced to 300ms for better UX

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedTag, initialSearch, initialTag, router, searchParams, startTransition]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleTagFilter = useCallback((tag: string) => {
    const newTag = tag === selectedTag ? '' : tag;
    setSelectedTag(newTag);
  }, [selectedTag]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedTag('');
    
    startTransition(() => {
      router.push('/notes');
    });
  }, [router, startTransition]);

  const hasActiveFilters = useMemo(() => 
    Boolean(searchTerm.trim() || selectedTag), 
    [searchTerm, selectedTag]
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            // disabled={isPending}
          />
        </div>

        {/* Tag Filter Dropdown */}
        <div className="relative">
          <select
            value={selectedTag}
            onChange={(e) => handleTagFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer"
            disabled={isPending}
          >
            <option value="">All tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Active filters:</span>
          {searchTerm.trim() && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              Search: "{searchTerm.trim()}"
            </span>
          )}
          {selectedTag && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              Tag: {selectedTag}
            </span>
          )}
        </div>
      )}

      {/* Notes Grid with Loading State */}
      <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        {filteredNotes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onTagClick={handleTagFilter}
                onEditNote={onEditNote}
                isLoading={isPending}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <Search className="h-12 w-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {hasActiveFilters 
                ? "Try adjusting your search or filter criteria."
                : "Create your first note to get started."
              }
            </p>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {isPending && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Updating...</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  onTagClick: (tag: string) => void;
  onEditNote?: (note: Note) => void;
  isLoading?: boolean;
}

function NoteCard({ note, onTagClick, onEditNote, isLoading = false }: NoteCardProps) {
  const truncatedBody = note.body.length > 150 
    ? note.body.substring(0, 150) + '...' 
    : note.body;

  return (
    <div className={`group relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ${
      isLoading ? 'pointer-events-none' : ''
    }`}>
      {/* Clickable overlay for the entire card */}
      {!isLoading && (
        <Link 
          href={`/notes/${note.id}`}
          className="absolute inset-0 z-10 rounded-lg"
          aria-label={`View note: ${note.title}`}
        />
      )}
      
      {/* Card content */}
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {note.title}
          </h3>
          {!isLoading && (
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              {onEditNote && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditNote(note);
                  }}
                  className="relative z-20 p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all rounded"
                  aria-label="Edit note"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )}
              <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
        
        {note.body && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
            {truncatedBody}
          </p>
        )}
        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                disabled={isLoading}
                className={`relative z-20 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-colors ${
                  isLoading 
                    ? 'cursor-not-allowed' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(note.created_at)}
        </div>
      </div>
    </div>
  );
}