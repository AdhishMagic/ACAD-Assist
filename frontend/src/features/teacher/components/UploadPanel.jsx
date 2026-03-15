import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPanel = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setUploadComplete(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    }
  });

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      if (onUploadSuccess) onUploadSuccess(files);
      setTimeout(() => {
        setFiles([]);
        setUploadComplete(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-200 ease-in-out flex flex-col items-center justify-center min-h-[250px]
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-900/50'}`}
      >
        <input {...getInputProps()} />
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {isDragActive ? "Drop the files here" : "Drag & drop files here"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Supported files: PDF, PPTX, DOCX, Images, and Markdown files
        </p>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Ready to upload ({files.length})</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {files.map((file, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`${file.name}-${idx}`} 
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium truncate text-gray-700 dark:text-gray-200">
                      {file.name}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(file); }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            <Button 
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white" 
              onClick={handleUpload}
              disabled={isUploading || uploadComplete}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  Uploading...
                </span>
              ) : uploadComplete ? (
                <span className="flex items-center gap-2 text-green-100">
                  <CheckCircle2 className="w-4 h-4" /> Uploaded Successfully
                </span>
              ) : (
                'Upload Materials'
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadPanel;
