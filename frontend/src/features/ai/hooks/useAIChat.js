import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiAPI } from '../services/aiAPI';

export const useAIChatHistory = () => {
  return useQuery({
    queryKey: ['ai-history'],
    queryFn: aiAPI.getHistory,
  });
};

export const useAIConversation = (conversationId) => {
  return useQuery({
    queryKey: ['ai-conversation', conversationId],
    queryFn: () => aiAPI.getConversation(conversationId),
    enabled: Boolean(conversationId),
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
    mutationFn: (payload) => aiAPI.chat(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-history'] });
    },
  });
};

export const useAICreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title) => aiAPI.createConversation(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-history'] });
    },
  });
};

export const useAIRenameConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, title }) => aiAPI.renameConversation(conversationId, title),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['ai-history'] });
      queryClient.invalidateQueries({ queryKey: ['ai-conversation', vars?.conversationId] });
    },
  });
};

export const useAIDeleteConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId) => aiAPI.deleteConversation(conversationId),
    onSuccess: (_data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['ai-history'] });
      queryClient.removeQueries({ queryKey: ['ai-conversation', conversationId] });
    },
  });
};

export const useAISendFeedback = () => {
  return useMutation({
    mutationFn: (payload) => aiAPI.sendFeedback(payload),
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
