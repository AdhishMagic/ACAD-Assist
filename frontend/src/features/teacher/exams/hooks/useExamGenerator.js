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

// Hook for generating the exam paper
export const useGenerateExam = () => {
  return useMutation({
    mutationFn: (config) => examAPI.generateExam(config),
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
