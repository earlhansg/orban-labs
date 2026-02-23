'use client';

import { useState } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Note } from '@/types/note';
import NotesClient from './notes-client';
import Modal from '@/components/modal';
import NoteFormModal from '@/components/note-form-modal';

interface NotesPageClientProps {
  initialNotes: Note[];
  availableTags: string[];
  initialSearch: string;
  initialTag: string;
}

export default function NotesPageClient({
  initialNotes,
  availableTags,
  initialSearch,
  initialTag,
}: NotesPageClientProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // The page will automatically refresh due to revalidatePath in the server action
  };

  const handleEditSuccess = () => {
    setEditingNote(null);
    // The page will automatically refresh due to revalidatePath in the server action
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Notes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse and search your notes collection
            </p>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Create Note
          </button>
        </div>
      </div>

      {/* Notes List */}
      <NotesClient 
        initialNotes={initialNotes}
        availableTags={availableTags}
        initialSearch={initialSearch}
        initialTag={initialTag}
        onEditNote={handleEditNote}
      />

      {/* Create Note Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Note"
        size="lg"
      >
        <NoteFormModal
          onCancel={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </Modal>

      {/* Edit Note Modal */}
      <Modal
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        title="Edit Note"
        size="lg"
      >
        {editingNote && (
          <NoteFormModal
            note={editingNote}
            onCancel={() => setEditingNote(null)}
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>
    </div>
  );
}