import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  ChevronRight,
  Download,
  ExternalLink,
  File,
  FileText,
  LayoutTemplate,
  PenTool,
  RefreshCw,
  Send,
  Save,
  Sparkles,
  Upload as UploadIcon,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NotesEditor from "@/features/teacher/components/NotesEditor";
import NotesPreview from "@/features/teacher/components/NotesPreview";
import TemplateBuilder from "@/features/teacher/components/TemplateBuilder";
import { createMaterial, getMaterialById, getMyMaterials, publishMaterial, updateMaterial } from "./api";

const EMPTY_EDITOR = "# New Study Material\n\nStart typing here...";
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "txt"];

function getExtension(name = "") {
  if (!name.includes(".")) return "";
  return name.split(".").pop().toLowerCase();
}

function getFileBadge(ext) {
  if (ext === "pdf") {
    return { label: "PDF", classes: "bg-red-100 text-red-700" };
  }
  if (ext === "doc" || ext === "docx") {
    return { label: "DOC", classes: "bg-blue-100 text-blue-700" };
  }
  return { label: "TXT", classes: "bg-amber-100 text-amber-700" };
}

export default function NotesStudio() {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const toastTimerRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(EMPTY_EDITOR);
  const [activeTab, setActiveTab] = useState("editor");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [latestMaterial, setLatestMaterial] = useState(null);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [materialsError, setMaterialsError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const selectedExt = useMemo(() => getExtension(selectedFile?.name || ""), [selectedFile]);
  const selectedBadge = useMemo(() => getFileBadge(selectedExt), [selectedExt]);

  const selectedPdfObjectUrl = useMemo(() => {
    if (!selectedFile || selectedExt !== "pdf") {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile, selectedExt]);

  useEffect(() => {
    return () => {
      if (selectedPdfObjectUrl) {
        URL.revokeObjectURL(selectedPdfObjectUrl);
      }
    };
  }, [selectedPdfObjectUrl]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  const loadMaterials = useCallback(async () => {
    setIsLoadingMaterials(true);
    setMaterialsError("");
    try {
      const data = await getMyMaterials();
      const normalized = Array.isArray(data) ? data : [];
      setMaterials(normalized);
      if (!latestMaterial && normalized.length > 0) {
        setLatestMaterial(normalized[0]);
      }
    } catch (error) {
      setMaterialsError(error?.response?.data?.detail || "Failed to load saved materials.");
    } finally {
      setIsLoadingMaterials(false);
    }
  }, [latestMaterial]);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  useEffect(() => {
    const materialIdFromState = location.state?.materialId;
    if (!materialIdFromState) {
      return;
    }

    const loadById = async () => {
      try {
        const material = await getMaterialById(materialIdFromState);
        startEditMaterial(material);
      } catch {
        showToast("error", "Failed to load selected note for editing.");
      }
    };

    loadById();
  }, [location.state]);

  const handleInsertTemplate = (templateContent) => {
    setContent((prev) => `${prev}\n\n${templateContent}`);
  };

  const onBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    const ext = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      showToast("error", "Only PDF, DOC, DOCX, and TXT files are supported.");
      return;
    }

    setSelectedFile(file);
    showToast("success", `Selected ${file.name}`);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const resetForm = () => {
    setTitle("");
    setContent(EMPTY_EDITOR);
    setSelectedFile(null);
    setEditingMaterialId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startEditMaterial = (item) => {
    setEditingMaterialId(item.id);
    setLatestMaterial(item);
    setTitle(item.title || "");
    setContent(item.content || "");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setActiveTab("editor");
    showToast("success", `Editing ${item.title}`);
  };

  const handleSaveMaterial = async () => {
    if (!title.trim()) {
      showToast("error", "Title is required.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingMaterialId) {
        const updated = await updateMaterial(editingMaterialId, {
          title: title.trim(),
          content,
          file: selectedFile,
        });

        setLatestMaterial(updated);
        setMaterials((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        showToast("success", "Material updated successfully.");
      } else {
        const created = await createMaterial({
          title: title.trim(),
          content,
          file: selectedFile,
        });

        setLatestMaterial(created);
        setMaterials((prev) => [created, ...prev.filter((item) => item.id !== created.id)]);
        resetForm();
        showToast("success", "Material saved successfully.");
      }
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.file?.[0] ||
        "Failed to save material.";
      showToast("error", message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishMaterial = async () => {
    if (!editingMaterialId) {
      showToast("error", "Open a saved note first before publishing.");
      return;
    }

    setIsPublishing(true);
    try {
      const published = await publishMaterial(editingMaterialId);
      setLatestMaterial(published);
      setMaterials((prev) => prev.map((item) => (item.id === published.id ? published : item)));
      showToast("success", "Material published. It is now visible in Explore Notes.");
    } catch (error) {
      showToast("error", error?.response?.data?.detail || "Failed to publish material.");
    } finally {
      setIsPublishing(false);
    }
  };

  const latestFileType = latestMaterial?.file_type || "";
  const latestFileUrl = latestMaterial?.file_url || null;
  const latestIsPdf = latestFileType === "pdf";
  const latestIsDoc = latestFileType === "doc" || latestFileType === "docx";
  const isCurrentlyPublished = latestMaterial?.status === "published";

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-12 h-full flex flex-col">
      {toast ? (
        <div
          className={`fixed top-5 right-5 z-50 rounded-lg border px-4 py-3 shadow-lg text-sm flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Notes Studio</h1>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold">Materials</span>
          </div>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter material title..."
            className="text-base font-medium border-0 border-b-2 border-transparent focus-visible:ring-0 focus-visible:border-primary rounded-none px-0 bg-transparent h-auto py-1 shadow-none"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-300" onClick={resetForm}>
            {editingMaterialId ? "Cancel" : "Clear"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 dark:text-gray-300"
            onClick={resetForm}
            title="Create new note"
          >
            <PenTool className="w-4 h-4" />
            + New
          </Button>
          {editingMaterialId ? (
            <Button
              onClick={handlePublishMaterial}
              disabled={isPublishing || isCurrentlyPublished}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {isPublishing ? "Publishing..." : isCurrentlyPublished ? "Published" : "Publish"}
            </Button>
          ) : null}
          <Button
            onClick={handleSaveMaterial}
            disabled={isSaving}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : editingMaterialId ? "Update" : "Save"}
          </Button>
        </div>
      </div>

      {editingMaterialId ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 px-3 py-2 text-sm flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          Edit mode is active. Saving will update this note.
          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${isCurrentlyPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {isCurrentlyPublished ? "Published" : "Draft"}
          </span>
        </div>
      ) : null}

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 shadow-sm">
          <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col w-full">
            <div className="border-b border-gray-200 dark:border-gray-800 px-3 py-1.5 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
              <TabsList className="bg-transparent space-x-2">
                <TabsTrigger
                  value="editor"
                  className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700 px-2 py-1.5"
                >
                  <PenTool className="w-3.5 h-3.5 mr-1.5" /> Compose
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-gray-200 dark:data-[state=active]:border-gray-700 px-2 py-1.5"
                >
                  <UploadIcon className="w-3.5 h-3.5 mr-1.5" /> Upload Files
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="editor" className="h-full m-0 p-0 border-0 outline-none flex flex-col md:flex-row min-w-0">
                <div className="w-full md:w-1/2 h-full border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 flex flex-col min-w-0">
                  <NotesEditor content={content} setContent={setContent} />
                </div>
                <div className="w-full md:w-1/2 h-full flex flex-col bg-gray-50/30 dark:bg-gray-900/30 min-w-0">
                  <div className="h-10 px-3 border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-2">Preview</span>
                    <span className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                      <Sparkles className="w-2.5 h-2.5 mr-1" /> Live Sync
                    </span>
                  </div>
                  <NotesPreview content={content} />
                </div>
              </TabsContent>

              <TabsContent value="upload" className="h-full w-full m-0 p-0 border-0 outline-none bg-gray-50/50 dark:bg-gray-950 overflow-auto">
                <div className="w-full max-w-3xl mx-auto p-6 space-y-5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={onFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={onBrowseClick}
                    className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary/50 rounded-xl p-10 text-center transition-colors"
                  >
                    <div className="mx-auto w-fit p-4 rounded-full bg-primary/10 mb-3">
                      <UploadIcon className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Select a file to upload</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Accepted: PDF, DOC, DOCX, TXT</p>
                  </button>

                  {selectedFile ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex items-center gap-3">
                          <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded font-semibold ${selectedBadge.classes}`}>{selectedBadge.label}</span>
                          <button
                            type="button"
                            onClick={removeSelectedFile}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            title="Remove selected file"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
            <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-indigo-500" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Smart Templates</h3>
            </div>
            <CardContent className="p-0">
              <TemplateBuilder onInsertTemplate={handleInsertTemplate} />
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
            <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <File className="w-4 h-4 text-sky-500" />
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Attachment Preview</h3>
            </div>
            <CardContent className="p-3 space-y-2.5">
              {!selectedFile && !latestMaterial?.file_url ? (
                <p className="text-sm text-gray-500">Select a file in Upload Files to preview or save first.</p>
              ) : null}

              {selectedFile && selectedExt === "pdf" && selectedPdfObjectUrl ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">Selected PDF</p>
                  <iframe
                    title="Selected PDF preview"
                    src={selectedPdfObjectUrl}
                    className="w-full h-56 border border-gray-200 dark:border-gray-800 rounded"
                  />
                </div>
              ) : null}

              {selectedFile && (selectedExt === "doc" || selectedExt === "docx") ? (
                <div className="space-y-2 rounded border border-gray-200 dark:border-gray-800 p-3">
                  <p className="text-xs font-medium text-gray-500 uppercase">Selected document</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">Preview not embedded for DOC/DOCX before upload.</p>
                </div>
              ) : null}

              {latestFileUrl && latestIsPdf ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">Saved PDF</p>
                  <a
                    href={latestFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Open saved PDF <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : null}

              {latestFileUrl && latestIsDoc ? (
                <div className="space-y-2 rounded border border-gray-200 dark:border-gray-800 p-3">
                  <p className="text-xs font-medium text-gray-500 uppercase">Saved document</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{latestMaterial?.file_path?.split("/").pop()}</p>
                  <a
                    href={latestFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    Download DOC/DOCX <Download className="w-4 h-4" />
                  </a>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
            <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Saved Materials</h3>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={loadMaterials} disabled={isLoadingMaterials}>
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMaterials ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <CardContent className="p-2.5">
              {isLoadingMaterials ? <p className="text-sm text-gray-500">Loading saved materials...</p> : null}
              {materialsError ? <p className="text-sm text-rose-600">{materialsError}</p> : null}
              {!isLoadingMaterials && !materialsError && materials.length === 0 ? (
                <p className="text-sm text-gray-500">No materials saved yet.</p>
              ) : null}

              {!isLoadingMaterials && !materialsError && materials.length > 0 ? (
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {materials.map((item) => {
                    const itemType = item.file_type || "txt";
                    const badge = getFileBadge(itemType);
                    const createdAt = item.created_at ? new Date(item.created_at).toLocaleString() : "";
                    const isSelected = latestMaterial?.id === item.id;

                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => startEditMaterial(item)}
                        className={`w-full text-left border rounded-lg p-2.5 transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 dark:border-gray-800 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{createdAt}</p>
                          </div>
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${item.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                              {item.status === "published" ? "Pub" : "Draft"}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${badge.classes}`}>{badge.label}</span>
                          </div>
                        </div>

                        {item.file_url ? (
                          <div className="mt-1.5 flex items-center justify-between">
                            <a
                              href={item.file_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="text-xs text-primary inline-flex items-center gap-0.5 hover:underline"
                            >
                              Open file <ChevronRight className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1.5">Text-only material</p>
                        )}

                        <p className="text-[10px] text-emerald-600 mt-1">Click to edit</p>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
