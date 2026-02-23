'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { notesApi } from '@/lib/api';
import { NoteCreate, NoteUpdate } from '@/types/note';

// Form state type for better error handling
export interface FormState {
  success: boolean;
  message: string;
  errors?: {
    title?: string[];
    body?: string[];
    tags?: string[];
  };
}

// Server action to create a new note
export async function createNote(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extract and validate form data
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const tagsString = formData.get('tags') as string;

    // Basic validation
    const errors: FormState['errors'] = {};
    
    if (!title?.trim()) {
      errors.title = ['Title is required'];
    } else if (title.length > 255) {
      errors.title = ['Title must be less than 255 characters'];
    }

    if (body && body.length > 10000) {
      errors.body = ['Body must be less than 10,000 characters'];
    }

    // Parse tags
    const tags = tagsString
      ? tagsString.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
      : [];

    if (tags.some(tag => tag.length > 50)) {
      errors.tags = ['Each tag must be less than 50 characters'];
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please fix the errors below',
        errors,
      };
    }

    // Create note data
    const noteData: NoteCreate = {
      title: title.trim(),
      body: body?.trim() || '',
      tags,
    };

    // Call API
    await notesApi.createNote(noteData);

    // Revalidate the notes page to show the new note
    revalidatePath('/notes');
    
    return {
      success: true,
      message: 'Note created successfully!',
    };
  } catch (error) {
    console.error('Failed to create note:', error);
    return {
      success: false,
      message: 'Failed to create note. Please try again.',
    };
  }
}

// Server action to update an existing note
export async function updateNote(
  noteId: number,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extract form data
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const tagsString = formData.get('tags') as string;

    // Basic validation
    const errors: FormState['errors'] = {};
    
    if (title !== null && !title?.trim()) {
      errors.title = ['Title is required'];
    } else if (title && title.length > 255) {
      errors.title = ['Title must be less than 255 characters'];
    }

    if (body && body.length > 10000) {
      errors.body = ['Body must be less than 10,000 characters'];
    }

    // Parse tags
    const tags = tagsString
      ? tagsString.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
      : [];

    if (tags.some(tag => tag.length > 50)) {
      errors.tags = ['Each tag must be less than 50 characters'];
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'Please fix the errors below',
        errors,
      };
    }

    // Create update data (only include fields that are provided)
    const updateData: NoteUpdate = {};
    
    if (title !== null) updateData.title = title.trim();
    if (body !== null) updateData.body = body?.trim() || '';
    if (tagsString !== null) updateData.tags = tags;

    // Call API
    await notesApi.updateNote(noteId, updateData);

    // Revalidate the notes page
    revalidatePath('/notes');
    revalidatePath(`/notes/${noteId}`);
    
    return {
      success: true,
      message: 'Note updated successfully!',
    };
  } catch (error) {
    console.error('Failed to update note:', error);
    return {
      success: false,
      message: 'Failed to update note. Please try again.',
    };
  }
}

// Server action to delete a note
export async function deleteNote(noteId: number): Promise<FormState> {
  try {
    await notesApi.deleteNote(noteId);
    
    // Revalidate and redirect
    revalidatePath('/notes');
    redirect('/notes');
  } catch (error) {
    console.error('Failed to delete note:', error);
    return {
      success: false,
      message: 'Failed to delete note. Please try again.',
    };
  }
}