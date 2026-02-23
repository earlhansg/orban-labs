import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { notesApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const note = await notesApi.getNote(parseInt(id));
    return {
      title: `${note.title} - Orban Labs`,
      description: note.body.substring(0, 160) || 'View and edit this note',
    };
  } catch {
    return {
      title: 'Note Not Found - Orban Labs',
      description: 'The requested note could not be found',
    };
  }
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;
  const noteId = parseInt(id);

  if (isNaN(noteId)) {
    notFound();
  }

  try {
    const note = await notesApi.getNote(noteId);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header with back link */}
        <div className="mb-8">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {note.title}
              </h1>
              
              {/* Note metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {formatDate(note.created_at)}
                </div>
                {note.updated_at !== note.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Updated {formatDate(note.updated_at)}
                  </div>
                )}
              </div>

              {/* Tags */}
              {note.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Note Content */}
        <div className="max-w-4xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Content
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {note.body ? (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {note.body}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No content provided for this note.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch note:', error);
    notFound();
  }
}