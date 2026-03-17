import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { FILE_UPLOAD_CONFIG } from '../constants/systemConfig';

export const FileUploader = ({ onUpload, progress, isUploading }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0 && onUpload) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    maxSize: FILE_UPLOAD_CONFIG.MAX_SIZE_MB * 1024 * 1024,
    accept: FILE_UPLOAD_CONFIG.ACCEPTED_TYPES
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 font-medium">
          {isDragActive ? "Drop the files here..." : "Drag & drop files here, or click to select"}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Supports: PDF, Images, Text (Max {FILE_UPLOAD_CONFIG.MAX_SIZE_MB}MB)
        </p>
      </div>

      {isUploading && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 space-y-2"
        >
          <div className="flex justify-between text-sm font-medium">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          {/* Fallback to raw Tailwind progress if ShadCN not available in exact path */}
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </motion.div>
      )}

      {acceptedFiles.length > 0 && !isUploading && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
          <ul className="space-y-2">
            {acceptedFiles.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm">
                <div className="flex items-center space-x-3">
                  <FileIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">{file.name}</span>
                </div>
                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
