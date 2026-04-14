import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, FileText, Loader2, PencilLine, Search, UploadCloud } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { RichTextEditor } from '../components/RichTextEditor';
import { systemAPI } from '../services/systemAPI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const EDITABLE_EXTENSIONS = new Set(['docx', 'txt']);
const SUPPORTED_EXTENSIONS = new Set(['pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg', 'zip']);

function getFileExtension(file) {
  return String(file?.name || '').split('.').pop().toLowerCase();
}

function classifyFile(file) {
  const extension = getFileExtension(file);
  if (!extension || !SUPPORTED_EXTENSIONS.has(extension)) {
    return { extension, flow: 'unsupported' };
  }

  if (extension === 'pdf') {
    return { extension, flow: 'pdf' };
  }

  if (EDITABLE_EXTENSIONS.has(extension)) {
    return { extension, flow: 'editable' };
  }

  return { extension, flow: 'attachment' };
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatBytes(sizeBytes = 0) {
  if (!sizeBytes) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = sizeBytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDate(value) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

function normalizeNotesResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.notes)) return data.notes;
  return [];
}

function FlowBadge({ flow }) {
  const label = flow === 'editable' ? 'Editable' : flow === 'pdf' ? 'PDF' : 'Attachment';
  const className =
    flow === 'editable'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : flow === 'pdf'
        ? 'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300'
        : 'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300';

  return <Badge variant="outline" className={cn('rounded-full px-3 py-1', className)}>{label}</Badge>;
}

export function FileUploadManagerPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('upload');
  const [searchInput, setSearchInput] = useState('');
  const deferredSearch = useDeferredValue(searchInput);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorState, setEditorState] = useState({ noteId: null, fileId: null, title: '', content: '', isPublished: false });
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('success');

  const notesQuery = useQuery({
    queryKey: ['saved-notes', deferredSearch],
    queryFn: async () => systemAPI.getSavedNotes(deferredSearch ? { search: deferredSearch } : {}),
  });

  const uploadMutation = useMutation({
    mutationFn: (file) => systemAPI.uploadFile(file, (progress) => setUploadSummary((current) => ({ ...(current || {}), progress }))),
    onSuccess: (data, file) => {
      const flow = classifyFile(file).flow;
      const summary = {
        id: data.file_id || data.id,
        name: data.original_name || file.name,
        type: data.file_type || classifyFile(file).extension,
        flow,
        fileUrl: data.file_url,
        extractedContent: data.extracted_content || '',
        titleSuggestion: data.title_suggestion || '',
        sizeBytes: data.size_bytes || file.size,
        progress: 100,
      };

      setUploadSummary(summary);
      setActiveTab('saved');
      queryClient.invalidateQueries({ queryKey: ['saved-notes'] });

      if (data.is_editable && data.extracted_content) {
        setEditorState({
          noteId: null,
          fileId: data.file_id || data.id,
          title: data.title_suggestion || '',
          content: data.extracted_content,
          isPublished: false,
        });
        setEditorOpen(true);
        setStatusMessage('Editable content extracted. Review the document in the editor.');
        setStatusType('success');
        return;
      }

      setEditorOpen(false);
      setStatusMessage(flow === 'pdf' ? 'PDF uploaded successfully.' : 'Attachment uploaded successfully.');
      setStatusType('success');
    },
    onError: (error) => {
      setUploadSummary(null);
      setStatusMessage(error?.response?.data?.detail || error?.response?.data?.file?.[0] || 'Upload failed.');
      setStatusType('error');
    },
  });

  const saveNoteMutation = useMutation({
    mutationFn: (payload) => systemAPI.saveNote(payload),
    onSuccess: async (data) => {
      setEditorOpen(false);
      setEditorState({ noteId: null, fileId: null, title: '', content: '', isPublished: false });
      setStatusMessage(data?.is_published ? 'Note published successfully.' : 'Draft saved successfully.');
      setStatusType('success');
      await queryClient.invalidateQueries({ queryKey: ['saved-notes'] });
    },
    onError: (error) => {
      setStatusMessage(error?.response?.data?.detail || 'Unable to save note.');
      setStatusType('error');
    },
  });

  useEffect(() => {
    if (!statusMessage) return undefined;
    const timeout = window.setTimeout(() => setStatusMessage(''), 4500);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  const notes = useMemo(() => normalizeNotesResponse(notesQuery.data), [notesQuery.data]);

  const handleFileSelect = (file) => {
    const classification = classifyFile(file);
    if (classification.flow === 'unsupported') {
      setStatusMessage('Only PDF, DOCX, TXT, PNG, JPG, JPEG, and ZIP files are allowed.');
      setStatusType('error');
      return;
    }

    setStatusMessage(`Detected ${classification.flow === 'editable' ? 'editable document' : classification.flow === 'pdf' ? 'PDF' : 'attachment'}: ${file.name}`);
    setStatusType('success');
    setUploadSummary({
      id: null,
      name: file.name,
      type: classification.extension,
      flow: classification.flow,
      fileUrl: null,
      extractedContent: '',
      titleSuggestion: '',
      sizeBytes: file.size,
      progress: 0,
    });
    uploadMutation.mutate(file);
  };

  const openNoteEditor = (note) => {
    setEditorState({
      noteId: note.id,
      fileId: note.file_id || note.file?.id,
      title: note.title || '',
      content: note.content || '',
      isPublished: Boolean(note.is_published),
    });
    setEditorOpen(true);
  };

  const submitNote = (isPublished) => {
    if (!editorState.fileId) {
      setStatusMessage('A file must be uploaded before saving a note.');
      setStatusType('error');
      return;
    }

    saveNoteMutation.mutate({
      note_id: editorState.noteId || undefined,
      file_id: editorState.fileId,
      title: editorState.title,
      content: editorState.content,
      is_published: isPublished,
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <UploadCloud className="h-3.5 w-3.5" /> Upload pipeline
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Upload Files</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          PDFs and attachments are stored directly. DOCX and TXT files are parsed into editable note content, then saved as drafts or published notes.
        </p>
      </div>

      {statusMessage ? (
        <div
          className={cn(
            'rounded-lg border px-4 py-3 text-sm',
            statusType === 'error'
              ? 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300'
              : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
          )}
        >
          {statusMessage}
        </div>
      ) : null}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="saved">Saved Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>New Upload</CardTitle>
              <CardDescription>
                Choose one file. The backend validates size and file type before storing it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploader onUpload={handleFileSelect} isUploading={uploadMutation.isPending} progress={uploadSummary?.progress || 0} />

              {uploadMutation.isPending ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>Uploading to backend storage</span>
                    <span>{uploadSummary?.progress || 0}%</span>
                  </div>
                  <Progress value={uploadSummary?.progress || 0} />
                </div>
              ) : null}

              {uploadSummary ? (
                <div className="grid gap-4 rounded-lg border bg-muted/20 p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">{uploadSummary.name}</h3>
                      <FlowBadge flow={uploadSummary.flow} />
                      <Badge variant="secondary" className="rounded-full">{String(uploadSummary.type || '').toUpperCase()}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>{formatBytes(uploadSummary.sizeBytes)}</span>
                      <span>{uploadSummary.fileUrl ? 'Stored on server' : 'Pending editor action'}</span>
                    </div>
                  </div>
                  {uploadSummary.fileUrl ? (
                    <Button variant="outline" onClick={() => window.open(uploadSummary.fileUrl, '_blank', 'noopener,noreferrer')}>
                      Open file
                    </Button>
                  ) : null}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border/60">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="rounded-md bg-sky-500/10 p-2 text-sky-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">PDF</p>
                      <p className="text-sm text-muted-foreground">Stored directly with preview support.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-600">
                      <PencilLine className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">DOCX / TXT</p>
                      <p className="text-sm text-muted-foreground">Parsed into an editor for draft or publish flows.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="rounded-md bg-slate-500/10 p-2 text-slate-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Other files</p>
                      <p className="text-sm text-muted-foreground">Uploaded as attachments with no editing step.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="mt-6 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <CardTitle>Saved Notes</CardTitle>
                  <CardDescription>Search, edit, draft, or publish notes generated from uploaded documents.</CardDescription>
                </div>
                <div className="w-full md:max-w-sm">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="Search titles or note content"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {notesQuery.isLoading ? (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading saved notes...
                </div>
              ) : notes.length > 0 ? (
                notes.map((note) => (
                  <div key={note.id} className="rounded-lg border bg-background p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-foreground">{note.title}</h3>
                          <Badge variant={note.is_published ? 'default' : 'secondary'} className="rounded-full">
                            {note.is_published ? 'Published' : 'Draft'}
                          </Badge>
                          <Badge variant="outline" className="rounded-full">
                            {String(note.file_type || '').toUpperCase() || 'FILE'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span>{note.file_name || 'Attached file'}</span>
                          <span>{formatDate(note.updated_at || note.created_at)}</span>
                        </div>
                        <p className="max-w-3xl text-sm text-muted-foreground">{stripHtml(note.content).slice(0, 220) || 'No preview available.'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {note.file_url ? (
                          <Button variant="outline" onClick={() => window.open(note.file_url, '_blank', 'noopener,noreferrer')}>
                            Open file
                          </Button>
                        ) : null}
                        <Button onClick={() => openNoteEditor(note)}>
                          <PencilLine className="h-4 w-4" /> Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed bg-muted/10 px-4 py-10 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">No saved notes yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Upload a DOCX or TXT file to extract editable content and create a note.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editorState.noteId ? 'Edit Note' : 'Review Extracted Content'}</DialogTitle>
            <DialogDescription>
              Save the extracted document as a draft or publish it as a public note.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                value={editorState.title}
                onChange={(event) => setEditorState((current) => ({ ...current, title: event.target.value }))}
                placeholder="Note title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Content</label>
              <RichTextEditor
                value={editorState.content}
                onChange={(content) => setEditorState((current) => ({ ...current, content }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setEditorOpen(false)} disabled={saveNoteMutation.isPending}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => submitNote(false)} disabled={saveNoteMutation.isPending}>
              {saveNoteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save Draft
            </Button>
            <Button onClick={() => submitNote(true)} disabled={saveNoteMutation.isPending}>
              {saveNoteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Publish
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
