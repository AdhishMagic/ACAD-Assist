import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, X, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProjectSubmissionPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const acceptedExtensions = useMemo(() => new Set(['pdf', 'docx', 'zip']), []);
  const acceptAttr = useMemo(() => '.pdf,.docx,.zip', []);
  const maxBytes = 50 * 1024 * 1024;

  const getExt = (name) => {
    const safe = (name || '').toLowerCase();
    if (!safe.includes('.')) return '';
    return safe.split('.').pop();
  };

  const formatBytes = (bytes) => {
    if (!Number.isFinite(bytes)) return '';
    const mb = bytes / 1024 / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} KB`;
  };

  const addFiles = (incoming) => {
    const incomingFiles = Array.from(incoming || []);
    if (incomingFiles.length === 0) return;

    const nextAccepted = [];
    const rejected = [];

    for (const f of incomingFiles) {
      const ext = getExt(f.name);

      if (!acceptedExtensions.has(ext)) {
        rejected.push(`${f.name} (unsupported type)`);
        continue;
      }

      if (f.size > maxBytes) {
        rejected.push(`${f.name} (too large)`);
        continue;
      }

      nextAccepted.push(f);
    }

    if (rejected.length > 0) {
      setFileError(`Some files were rejected: ${rejected.slice(0, 3).join(', ')}${rejected.length > 3 ? '…' : ''}`);
    } else {
      setFileError('');
    }

    if (nextAccepted.length > 0) {
      setFiles((prev) => {
        const existingKeys = new Set(prev.map((p) => `${p.name}:${p.size}:${p.lastModified}`));
        const deduped = nextAccepted.filter((f) => !existingKeys.has(`${f.name}:${f.size}:${f.lastModified}`));
        return [...prev, ...deduped];
      });
    }
  };

  const handleBrowse = () => {
    setFileError('');
    fileInputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    addFiles(e.dataTransfer?.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder submission logic
    console.log("Submitted:", { title, description, files: files.map((f) => ({ name: f.name, size: f.size })) });
    alert("Project submitted successfully to HOD.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Project Submission</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Upload and submit your final projects for HOD approval.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input 
              id="title" 
              placeholder="Enter your project title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <textarea 
              id="description" 
              className="w-full flex min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe your project methodology and outcomes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Project Files</Label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptAttr}
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                // allow choosing the same file again
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
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/50'
              }`}
            >
              <Upload className="h-8 w-8 text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOCX, ZIP up to 50MB</p>
            </div>

            {fileError ? (
              <p className="text-sm text-destructive">{fileError}</p>
            ) : null}

            {files.length > 0 ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Selected files ({files.length})</p>
                <div className="space-y-2">
                  {files.map((f) => (
                    <div
                      key={`${f.name}-${f.size}-${f.lastModified}`}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/30"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{f.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(f.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          setFiles((prev) => prev.filter((x) => !(x.name === f.name && x.size === f.size && x.lastModified === f.lastModified)));
                        }}
                        aria-label={`Remove ${f.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <Button type="submit" className="w-full md:w-auto flex items-center gap-2">
            <Send className="h-4 w-4" />
            Submit for Review
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectSubmissionPage;
