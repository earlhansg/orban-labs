'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Save, Tag, FileText } from 'lucide-react';
import { createNote, updateNote, FormState } from '@/lib/actions';
import { Note } from '@/types/note';

interface NoteFormModalProps {
  note?: Note; // If provided, we're editing; if not, we're creating
  onCancel: () => void;
  onSuccess: () => void;
}

const initialState: FormState = {
  success: false,
  message: '',
};

export default function NoteFormModal({ note, onCancel, onSuccess }: NoteFormModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = Boolean(note);

  // Use the appropriate server action based on whether we're editing or creating
  const action = isEditing 
    ? updateNote.bind(null, note!.id)
    : createNote;

  const [state, formAction, isPending] = useActionState(action, initialState);

  // Handle successful submission
  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  // Convert tags array to comma-separated string for the input
  const tagsString = note?.tags?.join(', ') || '';

  return (
    <div className="p-6">
      <form ref={formRef} action={formAction} className="space-y-6">
        {/* Title Field */}
        <div>
          <label 
            htmlFor="title" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={note?.title || ''}
            required
            maxLength={255}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter note title..."
            autoFocus
          />
          {state.errors?.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {state.errors.title[0]}
            </p>
          )}
        </div>

        {/* Body Field */}
        <div>
          <label 
            htmlFor="body" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Content
          </label>
          <textarea
            id="body"
            name="body"
            rows={8}
            defaultValue={note?.body || ''}
            maxLength={10000}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed resize-vertical"
            placeholder="Write your note content here..."
          />
          {state.errors?.body && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {state.errors.body[0]}
            </p>
          )}
        </div>

        {/* Tags Field */}
        <div>
          <label 
            htmlFor="tags" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </div>
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            defaultValue={tagsString}
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter tags separated by commas (e.g., work, important, ideas)"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Separate multiple tags with commas. Tags will be automatically lowercased.
          </p>
          {state.errors?.tags && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {state.errors.tags[0]}
            </p>
          )}
        </div>

        {/* Status Message */}
        {state.message && (
          <div className={`p-3 rounded-md ${
            state.success 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {state.message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditing ? 'Update Note' : 'Create Note'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}