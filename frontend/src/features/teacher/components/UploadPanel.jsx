import React, { useEffect, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { apiClient } from '@/shared/lib/http/axios';

const UploadPanel = ({ onUploadSuccess }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    console.log('UPLOAD PANEL MOUNTED');
  }, []);

  const handleUploadClick = () => {
    console.log('BUTTON CLICKED');
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('FILE SELECTED:', file.name);

    setUploading(true);
    setUploadError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient.post('/api/files/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      console.log('UPLOAD RESPONSE RECEIVED', res.data);
      setUploadProgress(100);
      setUploadedFile(res.data);
      if (onUploadSuccess) {
        onUploadSuccess({ file, result: res.data });
      }
      e.target.value = '';
    } catch (error) {
      setUploadError(error?.response?.data?.detail || error?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm relative">
      <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors w-full">
        <Upload className="w-10 h-10 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Upload your notes</h3>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">Support for PDF, DOCX, TXT. Files will be parsed and added to your studio.</p>
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="block w-full max-w-md text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:file:bg-blue-600 dark:hover:file:bg-blue-700 cursor-pointer focus:outline-none"
        />
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <p>Status: {uploading ? 'Uploading' : uploadedFile ? 'Done' : 'Idle'}</p>
        {uploadedFile ? <p>File: {uploadedFile.name || uploadedFile.original_name || 'Unknown'}</p> : null}
        {uploadedFile?.title_suggestion ? <p>Template: {uploadedFile.title_suggestion}</p> : null}
        {uploadError ? <p className="text-red-600">Error: {uploadError}</p> : null}
      </div>
    </div>
  );
};

export default UploadPanel;
