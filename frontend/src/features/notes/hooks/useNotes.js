import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesAPI } from '../services/notesAPI';

export const useNotes = (params = {}) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => notesAPI.getAllNotes(params),
  });
};

export const useMyNotes = (params = {}) => {
  return useQuery({
    queryKey: ['notes', 'my', params],
    queryFn: () => notesAPI.getMyNotes(params),
  });
};

export const useSubjectNotes = (subjectId, params = {}) => {
  return useQuery({
    queryKey: ['notes', 'subject', subjectId, params],
    queryFn: () => notesAPI.getNotesBySubject(subjectId, params),
    enabled: !!subjectId,
  });
};

export const useNoteDetails = (noteId) => {
  return useQuery({
    queryKey: ['note', noteId],
    queryFn: () => notesAPI.getNoteById(noteId),
    enabled: !!noteId,
  });
};

export const useNoteSubjects = () => {
  return useQuery({
    queryKey: ['notes', 'subjects'],
    queryFn: () => notesAPI.getSubjects(),
  });
};

export const useBookmarkedNotes = (params = {}) => {
  return useQuery({
    queryKey: ['notes', 'bookmarked', params],
    queryFn: () => notesAPI.getBookmarkedNotes(params),
  });
};

export const useBookmarkNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (noteId) => notesAPI.toggleBookmark(noteId),
    onSuccess: () => {
      // Invalidate relevant queries to refresh bookmark state across the app
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note'] });
      queryClient.invalidateQueries({ queryKey: ['notes', 'bookmarked'] });
    }
  });
};
