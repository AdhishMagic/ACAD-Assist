import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
  Approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
  Rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  'Revision Requested': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
};

export function MaterialDetailsDialog({ open, onOpenChange, material }) {
  if (!material) return null;

  const attachments = Array.isArray(material.attachments) ? material.attachments : [];
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
  }, [open, material?.id]);

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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between gap-3">
            <span className="leading-snug">{material.title}</span>
            <Badge variant="outline" className={statusColors[material.status] || ''}>
              {material.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Review submission details and attachments before taking action.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="text-muted-foreground">Teacher</div>
              <div className="font-medium text-right">{material.teacher}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-muted-foreground">Course</div>
              <div className="font-medium text-right">{material.course}</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-muted-foreground">Submission date</div>
              <div className="font-medium text-right">{material.date}</div>
            </div>
            {material.materialType && (
              <div className="flex items-center justify-between gap-4">
                <div className="text-muted-foreground">Type</div>
                <div className="font-medium text-right">{material.materialType}</div>
              </div>
            )}
            {material.description && (
              <div className="pt-2">
                <div className="text-muted-foreground mb-1">Description</div>
                <div className="rounded-md border bg-muted/30 p-3 whitespace-pre-wrap">
                  {material.description}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium">Material (Open / Preview)</div>
            {!attachments.length ? (
              <div className="text-sm text-muted-foreground rounded-md border p-3">
                No attachments available.
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
                  <div className="max-h-[260px] overflow-auto rounded-md border bg-muted/30 p-3 whitespace-pre-wrap text-sm">
                    {textLoading ? 'Loading preview…' : textContent}
                  </div>
                ) : ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(selectedType) ? (
                  <div className="rounded-md border bg-muted/30 p-3">
                    <img src={selectedUrl} alt={selectedAttachment.name} className="max-h-[260px] w-full object-contain" />
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <iframe
                      title={selectedAttachment.name}
                      src={selectedUrl}
                      className="w-full h-[260px] bg-background"
                    />
                  </div>
                )}
              </div>
            )}

            {material.previewText && (
              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Quick preview</div>
                <div className="max-h-[260px] overflow-auto rounded-md border bg-muted/30 p-3 whitespace-pre-wrap text-sm">
                  {material.previewText}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
