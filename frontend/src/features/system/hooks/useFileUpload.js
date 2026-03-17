import { useMutation, useQueryClient } from '@tanstack/react-query';
import { systemAPI } from '../services/systemAPI';
import { useState } from 'react';

export const useFileUpload = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: (file) => systemAPI.uploadFile(file, setUploadProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setUploadProgress(0);
    },
    onError: () => {
      setUploadProgress(0);
    }
  });

  return {
    uploadFile: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadProgress,
    error: uploadMutation.error
  };
};
