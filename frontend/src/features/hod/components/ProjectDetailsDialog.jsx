import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  Approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  Rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

export function ProjectDetailsDialog({ open, onOpenChange, project }) {
  if (!project) return null;

  const attachments = Array.isArray(project.attachments) ? project.attachments : [];
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [textLoading, setTextLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedAttachment(null);
      setTextContent('');
      setTextLoading(false);
      return;
    }
    setSelectedAttachment(attachments[0] || null);
  }, [open, project?.id]);

  const selectedType = (selectedAttachment?.type || '').toLowerCase();
  const selectedUrl = selectedAttachment?.url || '';

  const canInlinePreview = useMemo(() => {
    if (!selectedUrl) return false;
    return ['html', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'txt', 'md'].includes(selectedType);
  }, [selectedType, selectedUrl]);

  useEffect(() => {
    let isCancelled = false;
    const loadText = async () => {
      if (!open) return;
      if (!selectedUrl) return;
      if (!['txt', 'md'].includes(selectedType)) {
        setTextContent('');
        setTextLoading(false);
        return;
      }
      try {
        setTextLoading(true);
        const res = await fetch(selectedUrl);
        const text = await res.text();
        if (!isCancelled) setTextContent(text);
      } catch {
        if (!isCancelled) setTextContent('Failed to load text preview.');
      } finally {
        if (!isCancelled) setTextLoading(false);
      }
    };

    loadText();
    return () => {
      isCancelled = true;
    };
  }, [open, selectedType, selectedUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between gap-3">
            <span className="leading-snug">{project.title}</span>
            <Badge variant="outline" className={statusColors[project.status] || ''}>
              {project.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Review the project report/files before approving or rejecting.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="text-muted-foreground">Student</div>
              <div className="font-medium text-right">{project.student}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-muted-foreground">Submission date</div>
              <div className="font-medium text-right">{project.date}</div>
            </div>
            {project.description && (
              <div className="pt-2">
                <div className="text-muted-foreground mb-1">Description</div>
                <div className="rounded-md border bg-muted/30 p-3 whitespace-pre-wrap">
                  {project.description}
                </div>
              </div>
            )}
            {Array.isArray(project.techStack) && project.techStack.length > 0 && (
              <div className="pt-2">
                <div className="text-muted-foreground mb-2">Tech stack</div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium">Project Files</div>
            {!attachments.length ? (
              <div className="text-sm text-muted-foreground rounded-md border p-3">
                No files attached.
              </div>
            ) : (
              <div className="space-y-2">
                {attachments.map((att) => (
                  <div key={att.name} className="flex items-center justify-between gap-3 rounded-md border p-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{att.name}</div>
                      {att.type && <div className="text-xs text-muted-foreground">{att.type.toUpperCase()}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={selectedAttachment?.url === att.url ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedAttachment(att)}
                        disabled={!att.url}
                        title="Preview inside dialog"
                      >
                        Preview
                      </Button>
                      <Button asChild variant="outline" size="sm" disabled={!att.url}>
                        <a href={att.url || '#'} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedAttachment && (
              <div className="pt-2">
                <div className="text-sm font-medium mb-2">
                  Preview: <span className="font-normal text-muted-foreground">{selectedAttachment.name}</span>
                </div>
                {!canInlinePreview ? (
                  <div className="text-sm text-muted-foreground rounded-md border p-3">
                    Preview not available for this file type. Use “Open”.
                  </div>
                ) : selectedType === 'txt' || selectedType === 'md' ? (
                  <div className="max-h-[320px] overflow-auto rounded-md border bg-muted/30 p-3 whitespace-pre-wrap text-sm">
                    {textLoading ? 'Loading preview…' : textContent}
                  </div>
                ) : ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(selectedType) ? (
                  <div className="rounded-md border bg-muted/30 p-3">
                    <img src={selectedUrl} alt={selectedAttachment.name} className="max-h-[320px] w-full object-contain" />
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <iframe
                      title={selectedAttachment.name}
                      src={selectedUrl}
                      className="w-full h-[320px] bg-background"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
