import React, { useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Upload, Send, X, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { projectAPI } from '../services/projectAPI';

const ProjectSubmissionPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

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

  const { data: myProjects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['student-my-projects'],
    queryFn: projectAPI.getMyProjects,
  });

  const submitMutation = useMutation({
    mutationFn: projectAPI.submitProject,
    onSuccess: () => {
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setFileError('');
      queryClient.invalidateQueries({ queryKey: ['student-my-projects'] });
    },
  });

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
      setSelectedFile(nextAccepted[0]);
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
    if (!selectedFile) {
      setFileError('Please choose one file to submit.');
      return;
    }

    submitMutation.mutate({
      title,
      description,
      file: selectedFile,
    });
  };

  const statusLabel = (status) => {
    const normalized = String(status || 'pending').toLowerCase();
    if (normalized === 'approved') return 'Approved';
    if (normalized === 'rejected') return 'Rejected';
    return 'Pending';
  };

  const statusClass = (status) => {
    const normalized = String(status || 'pending').toLowerCase();
    if (normalized === 'approved') return 'bg-green-100 text-green-800 border-green-200';
    if (normalized === 'rejected') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

            {selectedFile ? (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">Selected file</p>
                <div className="space-y-2">
                  <div
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(selectedFile.size)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                      }}
                      aria-label={`Remove ${selectedFile.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {submitMutation.isError ? (
            <p className="text-sm text-destructive">{submitMutation.error?.message || 'Submission failed. Please try again.'}</p>
          ) : null}

          {submitMutation.isSuccess ? (
            <p className="text-sm text-green-600">Project submitted successfully and marked as pending.</p>
          ) : null}

          <Button type="submit" className="w-full md:w-auto flex items-center gap-2" disabled={submitMutation.isPending}>
            <Send className="h-4 w-4" />
            {submitMutation.isPending ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Submissions</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Real-time status from backend records.
        </p>

        {isLoadingProjects ? (
          <p className="text-sm text-gray-500 mt-4">Loading submissions...</p>
        ) : myProjects.length === 0 ? (
          <p className="text-sm text-gray-500 mt-4">No submissions yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {myProjects.map((project) => (
              <div key={project.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{project.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Submitted: {new Date(project.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className={statusClass(project.status)}>
                    {statusLabel(project.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">{project.description}</p>
                {project.reviewed_at ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Reviewed by {project.reviewed_by_name || 'HOD'} on {new Date(project.reviewed_at).toLocaleString()}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProjectSubmissionPage;
