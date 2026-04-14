import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  ChevronRight,
  Edit3,
  ExternalLink,
  File,
  FileText,
  LayoutTemplate,
  PenTool,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Upload as UploadIcon,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UploadPanel from '../components/UploadPanel';
import NotesEditor from '../components/NotesEditor';
import NotesPreview from '../components/NotesPreview';
import TemplateBuilder from '../components/TemplateBuilder';
import { createMaterial, listMaterials, publishMaterial } from '@/features/materials/api';

const EMPTY_EDITOR = '# New Study Material\n\nStart typing here...';

function getFileType(value = '') {
  const ext = String(value).split('.').pop().toLowerCase();
  return ext || 'txt';
}

function getFileBadge(fileType) {
  if (fileType === 'pdf') return { label: 'PDF', classes: 'bg-red-100 text-red-700' };
  if (fileType === 'doc' || fileType === 'docx') return { label: 'DOC', classes: 'bg-blue-100 text-blue-700' };
  if (fileType === 'zip') return { label: 'ZIP', classes: 'bg-slate-100 text-slate-700' };
  return { label: 'TXT', classes: 'bg-amber-100 text-amber-700' };
}

export default function NotesStudioPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(EMPTY_EDITOR);
  const [activeTab, setActiveTab] = useState('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [materialsError, setMaterialsError] = useState('');
  const [latestSavedMaterial, setLatestSavedMaterial] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('success');

  const showStatus = useCallback((type, message) => {
    setStatusType(type);
    setStatusMessage(message);
    window.clearTimeout(showStatus._timer);
    showStatus._timer = window.setTimeout(() => setStatusMessage(''), 3000);
  }, []);

  const loadMaterials = useCallback(async () => {
    setIsLoadingMaterials(true);
    setMaterialsError('');
    try {
      const data = await listMaterials();
      setMaterials(Array.isArray(data) ? data : []);
    } catch (error) {
      setMaterialsError(error?.response?.data?.detail || 'Unable to load saved notes.');
    } finally {
      setIsLoadingMaterials(false);
    }
  }, []);

  useEffect(() => {
    console.log('UPLOAD PANEL MOUNTED');
    loadMaterials();
    return () => window.clearTimeout(showStatus._timer);
  }, [loadMaterials, showStatus]);

  const handleInsertTemplate = (templateContent) => {
    setContent((prev) => `${prev}\n\n${templateContent}`);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showStatus('error', 'Please enter a title.');
      return;
    }

    setIsSaving(true);
    try {
      const created = await createMaterial({ title: title.trim(), content, file: null });
      setMaterials((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
      setLatestSavedMaterial(created);
      setTitle('');
      setContent(EMPTY_EDITOR);
      showStatus('success', 'Notes saved successfully.');
    } catch (error) {
      showStatus('error', error?.response?.data?.detail || 'Failed to save notes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!latestSavedMaterial?.id) {
      showStatus('error', 'Save a document first before publishing.');
      return;
    }

    setIsPublishing(true);
    try {
      const published = await publishMaterial(latestSavedMaterial.id);
      setLatestSavedMaterial(published);
      setMaterials((prev) => prev.map((item) => (item.id === published.id ? published : item)));
      showStatus('success', 'Document published successfully.');
    } catch (error) {
      showStatus('error', error?.response?.data?.detail || 'Failed to publish document.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUploadSuccess = ({ file, result }) => {
    const fileType = getFileType(result?.file_type || file?.name || '');
    const badge = getFileBadge(fileType);

    const nextMaterial = {
      id: result?.file_id || result?.id || file?.name,
      title: result?.title_suggestion || file?.name || 'Uploaded file',
      content: result?.extracted_content || '',
      file_url: result?.file_url,
      file_type: fileType,
      file_path: result?.storage_path || file?.name || '',
      status: result?.is_editable ? 'draft' : 'uploaded',
      created_at: result?.created_at || new Date().toISOString(),
      badge,
    };

    setLatestSavedMaterial(nextMaterial);

    if (result?.is_editable && result?.extracted_content) {
      setTitle(result.title_suggestion || file?.name || '');
      setContent(result.extracted_content);
      setActiveTab('editor');
      showStatus('success', `${file?.name || 'Document'} parsed and opened in the editor.`);
    } else {
      showStatus('success', `${file?.name || 'File'} uploaded successfully.`);
    }

    loadMaterials();
  };

  const latestFileType = latestSavedMaterial?.file_type || '';
  const latestFileUrl = latestSavedMaterial?.file_url || null;
  const latestIsPdf = latestFileType === 'pdf';
  const latestIsDoc = latestFileType === 'doc' || latestFileType === 'docx';
  const latestBadge = useMemo(() => getFileBadge(latestFileType), [latestFileType]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-12 h-full flex flex-col">
      {statusMessage ? (
        <div
          className={`fixed top-5 right-5 z-50 rounded-lg border px-4 py-3 shadow-lg text-sm flex items-center gap-2 ${
            statusType === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {statusType === 'success' ? <Sparkles className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMessage}</span>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Notes Studio</h1>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold">Beta</span>
          </div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter material title..."
            className="text-lg font-medium border-0 border-b-2 border-transparent focus-visible:ring-0 focus-visible:border-primary rounded-none px-0 bg-transparent h-auto py-1 shadow-none"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="text-gray-600 dark:text-gray-300" onClick={() => { setTitle(''); setContent(EMPTY_EDITOR); }}>
            Cancel
          </Button>
          {latestSavedMaterial && latestSavedMaterial.status !== 'published' ? (
            <Button onClick={handlePublish} disabled={isPublishing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          ) : null}
          <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Material'}
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-950 shadow-sm">
          <Tabs value={activeTab === 'upload' ? 'upload' : 'editor'} onValueChange={setActiveTab} className="h-full flex flex-col w-full">
            <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
              <TabsList className="bg-transparent space-x-2">
                <TabsTrigger value="editor" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700">
                  <PenTool className="w-4 h-4 mr-2" /> Compose
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700">
                  <UploadIcon className="w-4 h-4 mr-2" /> Upload Files
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              {activeTab === 'upload' ? (
                <div className="flex-1 min-h-0 h-full w-full m-0 p-0 border-0 outline-none bg-gray-50/50 dark:bg-gray-950 overflow-auto">
                  <div className="w-full max-w-3xl mx-auto p-6 min-h-[400px] flex flex-col items-center justify-center">
                    <UploadPanel onUploadSuccess={handleUploadSuccess} />
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-h-0 h-full m-0 p-0 border-0 outline-none flex flex-col md:flex-row min-w-0">
                  <div className="w-full md:w-1/2 h-full border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 flex flex-col min-w-0">
                    <NotesEditor content={content} setContent={setContent} />
                  </div>
                  <div className="w-full md:w-1/2 h-full flex flex-col bg-gray-50/30 dark:bg-gray-900/30 min-w-0">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/50 flex items-center justify-between">
                       <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-2">Preview</span>
                      <span className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                        <Sparkles className="w-3 h-3 mr-1" /> Live Sync
                      </span>
                    </div>
                    <NotesPreview content={content} />
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Smart Templates</h3>
            </div>
            <CardContent className="p-0">
              <TemplateBuilder onInsertTemplate={handleInsertTemplate} />
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800/50 shadow-sm bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="p-4 border-b border-purple-100 dark:border-purple-800/50 flex items-center gap-2 relative z-10">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">AI Assistance</h3>
            </div>
            <CardContent className="p-4 space-y-3 relative z-10">
              <p className="text-sm text-purple-700/80 dark:text-purple-300/80 mb-4">
                Boost your materials with AI. Select text in the editor or generate full sections.
              </p>

              <Button variant="secondary" className="w-full justify-start bg-white dark:bg-gray-900 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800/50 shadow-sm transition-colors text-gray-700 dark:text-gray-300">
                <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                Generate Explanations
              </Button>

              <Button variant="secondary" className="w-full justify-start bg-white dark:bg-gray-900 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800/50 shadow-sm transition-colors text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4 mr-2 text-purple-500" />
                Summarize Notes
              </Button>

              <Button variant="secondary" className="w-full justify-start bg-white dark:bg-gray-900 hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800/50 shadow-sm transition-colors text-gray-700 dark:text-gray-300">
                <HelpCircle className="w-4 h-4 mr-2 text-purple-500" />
                Generate Practice Questions
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Saved Notes</h3>
              </div>
              <Button variant="outline" size="sm" onClick={loadMaterials} disabled={isLoadingMaterials}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingMaterials ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <CardContent className="p-3 space-y-2 max-h-72 overflow-y-auto">
              {isLoadingMaterials ? <p className="text-sm text-gray-500">Loading saved notes...</p> : null}
              {materialsError ? <p className="text-sm text-red-600 dark:text-red-400">{materialsError}</p> : null}
              {!isLoadingMaterials && !materialsError && materials.length === 0 ? <p className="text-sm text-gray-500">No saved notes yet.</p> : null}

              {materials.map((material) => {
                const fileType = getFileType(material.file_type || material.file_path || 'txt');
                const badge = getFileBadge(fileType);
                const createdAt = material.created_at ? new Date(material.created_at).toLocaleString() : '';

                return (
                  <div key={material.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{material.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{createdAt}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${badge.classes}`}>{badge.label}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${material.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {material.status === 'published' ? 'Pub' : 'Draft'}
                      </span>
                    </div>
                    {material.file_url ? (
                      <a
                        href={material.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Open File <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <p className="mt-2 text-xs text-gray-500">Text-only note</p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {latestSavedMaterial ? (
            <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <File className="w-5 h-5 text-sky-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Latest Upload</h3>
              </div>
              <CardContent className="p-3 space-y-2.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">{latestSavedMaterial.title}</p>
                <p className="text-xs text-gray-500">{latestSavedMaterial.file_type?.toUpperCase() || latestBadge.label}</p>
                {latestFileUrl ? (
                  <a href={latestFileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    Open uploaded file <ExternalLink className="w-4 h-4" />
                  </a>
                ) : null}
                {latestIsPdf ? <p className="text-xs text-gray-500">PDF stored directly. No editing needed.</p> : null}
                {latestIsDoc ? <p className="text-xs text-gray-500">Editable document loaded into the composer.</p> : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const HelpCircle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);
