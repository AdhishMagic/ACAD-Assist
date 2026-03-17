import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { systemAPI } from '../services/systemAPI';
import { FilePreview } from '../components/FilePreview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { EmptyState } from '../components/EmptyState';

export const FilePreviewPage = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const { data: file, isLoading, isError } = useQuery({
    queryKey: ['file', fileId],
    queryFn: () => systemAPI.getFilePreview(fileId),
    enabled: !!fileId
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 pt-6 px-4"
    >
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">File Preview</h1>
          <p className="text-gray-500">Viewing document details.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : isError || !file ? (
        <EmptyState 
          title="File not found" 
          description="The file you are looking for does not exist or has been removed."
          action={<Button onClick={() => navigate('/file-manager')}>Go to File Manager</Button>}
        />
      ) : (
        <FilePreview file={file} />
      )}
    </motion.div>
  );
};
