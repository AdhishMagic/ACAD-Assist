import React from 'react';
import { useFileUpload } from '../hooks/useFileUpload';
import { FileUploader } from '../components/FileUploader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

export const FileUploadManagerPage = () => {
  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  const handleUpload = async (file) => {
    try {
      await uploadFile(file);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pt-6 px-4"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">File Manager</h1>
        <p className="text-gray-500">Centralized system for all your uploads and documents.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New File</CardTitle>
          <CardDescription>Drag and drop your files here to upload them to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploader 
            onUpload={handleUpload} 
            isUploading={isUploading} 
            progress={uploadProgress} 
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
