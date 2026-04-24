import { useMutation, useQuery } from '@tanstack/react-query';
import { examAPI } from '../services/examAPI';

// Hook for uploading material
export const useUploadMaterial = () => {
  return useMutation({
    mutationFn: (formData) => examAPI.uploadMaterial(formData),
  });
};

// Hook for saving/updating a JSON template
export const useSaveTemplate = () => {
  return useMutation({
    mutationFn: (templateData) => examAPI.saveTemplate(templateData),
  });
};

export const useExamTemplates = () => {
  return useQuery({
    queryKey: ['examTemplates'],
    queryFn: () => examAPI.getTemplates(),
  });
};

export const useExamDrafts = (params = {}) => {
  return useQuery({
    queryKey: ['examDrafts', params],
    queryFn: () => examAPI.getExamDrafts(params),
  });
};

// Hook for generating the exam paper
export const useGenerateExam = () => {
  return useMutation({
    mutationFn: (config) => examAPI.generateExam(config),
  });
};

export const useUpdateExam = () => {
  return useMutation({
    mutationFn: (params) => examAPI.updateExam(params),
  });
};

export const usePolishExamWithAI = () => {
  return useMutation({
    mutationFn: (params) => examAPI.polishExamWithAI(params),
  });
};

// Hook to fetch an exam preview by ID
export const useExamPreview = (examId) => {
  return useQuery({
    queryKey: ['examPreview', examId],
    queryFn: () => examAPI.getExamPreview(examId),
    enabled: !!examId,
  });
};

// Hook for exporting the exam
export const useExportExam = () => {
  return useMutation({
    mutationFn: (params) => examAPI.exportExam(params),
  });
};
