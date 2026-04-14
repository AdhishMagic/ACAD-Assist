import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiAPI } from '../services/aiAPI';

export const useAIChatHistory = () => {
  return useQuery({
    queryKey: ['ai-history'],
    queryFn: aiAPI.getHistory,
  });
};

export const useAIGeneratedNote = (id) => {
  return useQuery({
    queryKey: ['ai-generated-note', id],
    queryFn: () => aiAPI.getGeneratedNote(id),
    enabled: !!id,
  });
};

export const useAISendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ messages, file }) => aiAPI.chat(messages, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-history'] });
    },
  });
};

export const useAISaveNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiAPI.saveNote,
    onSuccess: () => {
      // Invalidate the bookmarked notes cache instead of the old AI saved notes
      queryClient.invalidateQueries({ queryKey: ['notes', 'bookmarked'] });
    },
  });
};
