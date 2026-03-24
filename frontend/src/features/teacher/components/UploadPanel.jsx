import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPanel = ({ onUploadSuccess }) => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);

  const acceptedExtensions = useMemo(
    () => new Set(['pdf', 'jpeg', 'jpg', 'png', 'gif', 'webp', 'txt', 'md', 'markdown', 'doc', 'docx', 'ppt', 'pptx']),
    []
  );

  const acceptAttr = useMemo(
    () => '.pdf,.jpeg,.jpg,.png,.gif,.webp,.txt,.md,.markdown,.doc,.docx,.ppt,.pptx',
    []
  );

  const isAccepted = useCallback(
    (file) => {
      const name = file?.name || '';
      const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
      return acceptedExtensions.has(ext);
    },
    [acceptedExtensions]
  );

  const addFiles = useCallback(
    (incomingFiles) => {
      const incoming = Array.isArray(incomingFiles) ? incomingFiles : [];
      const accepted = incoming.filter(isAccepted);
      const rejected = incoming.filter((f) => !isAccepted(f));

      if (rejected.length > 0) {
        const first = rejected[0];
        setRejectionMessage(
          `Unsupported file type: ${first.name}. Please upload PDF, images, TXT/MD, DOC/DOCX, or PPT/PPTX.`
        );
      } else {
        setRejectionMessage('');
      }

      if (accepted.length === 0) return;
      setFiles((prev) => [...prev, ...accepted]);
      setUploadComplete(false);
    },
    [isAccepted]
  );

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleBrowse = () => {
    inputRef.current?.click();
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
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptAttr}
        className="hidden"
        onChange={(e) => {
          const selectedFiles = Array.from(e.target.files || []);
          addFiles(selectedFiles);
          e.target.value = '';
        }}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={handleBrowse}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleBrowse();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragActive(false);
          addFiles(Array.from(e.dataTransfer.files || []));
        }}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-200 ease-in-out flex flex-col items-center justify-center min-h-[250px]
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-900/50'}`}
      >
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {isDragActive ? "Drop the files here" : "Drag & drop files here"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Supported files: PDF, Images, TXT/MD, DOC/DOCX, PPT/PPTX
        </p>

        <Button type="button" variant="outline" className="mt-4" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleBrowse();
        }}>
          Browse files
        </Button>
      </div>

      {rejectionMessage ? (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3">
          {rejectionMessage}
        </div>
      ) : null}

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
