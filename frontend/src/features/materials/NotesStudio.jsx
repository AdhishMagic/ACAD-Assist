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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import NotesEditor from "@/features/teacher/components/NotesEditor";
import NotesPreview from "@/features/teacher/components/NotesPreview";
import TemplateBuilder from "@/features/teacher/components/TemplateBuilder";
import {
  createMaterial,
  createExamTemplate,
  generateExam,
  getExam,
  getMaterialById,
  getMyMaterials,
  publishExam,
  publishMaterial,
  updateExam,
  updateMaterial,
} from "./api";

const EMPTY_EDITOR = "# New Study Material\n\nStart typing here...";
const ALLOWED_EXTENSIONS = ["pdf", "docx"];
const NOTE_TYPES = ["Lecture", "Exam Prep", "Assignment", "Reference", "Summary"];
const EXAM_DIFFICULTIES = ["easy", "medium", "hard"];
const EMPTY_TEMPLATE = { sections: [] };
const EMPTY_EXAM_STATE = {
  template: {
    id: null,
    file: null,
    fileName: "",
    pattern: {
      sections: [],
    },
  },
  config: {
    subject: "",
    lesson_range: "",
    difficulty: "medium",
  },
  examData: {
    exam_id: null,
    title: "",
    sections: [],
    status: "draft",
  },
  loading: false,
  error: null,
};

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

function createSection(index) {
  return {
    title: `Section ${index}`,
    questions: [],
  };
}

function createQuestion(index) {
  return {
    text: `Question ${index}`,
    options: [],
  };
}

function normalizeExamData(data = {}) {
  return {
    exam_id: data.exam_id ?? data.id ?? null,
    title: data.title ?? data.exam_json?.title ?? "",
    sections: Array.isArray(data.sections)
      ? data.sections
      : Array.isArray(data.exam_json?.sections)
        ? data.exam_json.sections
        : [],
    status: data.status || "draft",
  };
}

export default function NotesStudio() {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const examTemplateInputRef = useRef(null);
  const toastTimerRef = useRef(null);

  const [studioMode, setStudioMode] = useState("materials");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(EMPTY_EDITOR);
  const [subject, setSubject] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [noteType, setNoteType] = useState("Lecture");
  const [activeTab, setActiveTab] = useState("editor");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [latestMaterial, setLatestMaterial] = useState(null);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [publishedExams, setPublishedExams] = useState([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(true);
  const [materialsError, setMaterialsError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [examState, setExamState] = useState(EMPTY_EXAM_STATE);

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
    setSubject("");
    setTagsInput("");
    setNoteType("Lecture");
    setSelectedFile(null);
    setEditingMaterialId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetExamState = () => {
    setExamState(EMPTY_EXAM_STATE);
    if (examTemplateInputRef.current) {
      examTemplateInputRef.current.value = "";
    }
  };

  const setExamLoading = (loading) => {
    setExamState((prev) => ({
      ...prev,
      loading,
    }));
  };

  const setExamError = (error) => {
    setExamState((prev) => ({
      ...prev,
      error,
    }));
  };

  const startEditMaterial = (item) => {
    setEditingMaterialId(item.id);
    setLatestMaterial(item);
    setTitle(item.title || "");
    setContent(item.content || "");
    setSubject(item.subject || "");
    setTagsInput(Array.isArray(item.tags) ? item.tags.join(", ") : "");
    setNoteType(item.note_type || "Lecture");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setActiveTab("editor");
    setStudioMode("materials");
    showToast("success", `Editing ${item.title}`);
  };

  const handleSaveMaterial = async () => {
    if (!subject.trim()) {
      showToast("error", "Subject is required.");
      return;
    }

    if (!title.trim()) {
      showToast("error", "Title is required.");
      return;
    }

    const parsedTags = tagsInput
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    setIsSaving(true);
    try {
      if (editingMaterialId) {
        const updated = await updateMaterial(editingMaterialId, {
          title: title.trim(),
          content,
          subject,
          tags: parsedTags,
          type: noteType,
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
          subject,
          tags: parsedTags,
          type: noteType,
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
    const parsedTags = tagsInput
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (!subject.trim()) {
      showToast("error", "Subject is required.");
      return;
    }

    if (!title.trim()) {
      showToast("error", "Title is required.");
      return;
    }

    setIsPublishing(true);
    try {
      let noteId = editingMaterialId;

      if (!noteId) {
        const created = await createMaterial({
          title: title.trim(),
          content,
          subject,
          tags: parsedTags,
          type: noteType,
          file: selectedFile,
        });
        noteId = created.id;
        setEditingMaterialId(created.id);
      } else {
        await updateMaterial(noteId, {
          title: title.trim(),
          content,
          subject,
          tags: parsedTags,
          type: noteType,
          file: selectedFile,
        });
      }

      const published = await publishMaterial(noteId);
      setLatestMaterial(published);
      setMaterials((prev) => [published, ...prev.filter((item) => item.id !== published.id)]);
      showToast("success", "Material published. It is now visible in Explore Notes.");
    } catch (error) {
      showToast("error", error?.response?.data?.detail || "Failed to publish material.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExamConfigChange = (field, value) => {
    setExamState((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [field]: value,
      },
    }));
  };

  const handleExamTemplateBrowse = () => {
    examTemplateInputRef.current?.click();
  };

  const handleExamTemplateChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (getExtension(file.name) !== "pdf") {
      showToast("error", "Only PDF templates are supported for exam generation.");
      return;
    }

    setExamState((prev) => ({
      ...prev,
      error: null,
      template: {
        ...prev.template,
        file,
        fileName: file.name,
      },
    }));
    showToast("success", `Selected ${file.name}`);
  };

  const handleUploadTemplate = async () => {
    if (!examState.template.file) {
      showToast("error", "Select a PDF template first.");
      return;
    }

    setExamLoading(true);
    setExamError(null);
    try {
      const created = await createExamTemplate({
        title: examState.template.fileName.replace(/\.pdf$/i, "") || "Exam Template",
        pattern_json: EMPTY_TEMPLATE,
      });

      setExamState((prev) => ({
        ...prev,
        loading: false,
        error: null,
        template: {
          ...prev.template,
          id: created.id,
          pattern: created.pattern_json || { sections: [] },
        },
      }));
      showToast("success", "Template mock uploaded successfully.");
    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to create exam template.";
      setExamState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
      showToast("error", error?.response?.data?.detail || "Failed to create exam template.");
    }
  };

  const handleGenerateExam = async () => {
    if (!examState.template.id) {
      showToast("error", "Upload a template before generating an exam.");
      return;
    }

    setExamLoading(true);
    setExamError(null);
    try {
      const generated = await generateExam({
        subject: examState.config.subject,
        lesson_range: examState.config.lesson_range,
        difficulty: examState.config.difficulty,
        template: examState.template.id,
      });

      let nextExamData = normalizeExamData(generated);

      try {
        const detail = await getExam(generated.exam_id);
        nextExamData = normalizeExamData(detail);
      } catch {
        // Keep the generated payload as the local source of truth when detail fetch is unavailable.
      }

      setExamState((prev) => ({
        ...prev,
        loading: false,
        error: null,
        examData: nextExamData,
      }));
      showToast("success", "Exam draft generated.");
    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to generate exam.";
      setExamState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
      showToast("error", message);
    }
  };

  const updateExamSections = (updater) => {
    setExamState((prev) => ({
      ...prev,
      examData: {
        ...prev.examData,
        sections: updater(prev.examData.sections || []),
      },
    }));
  };

  const handleExamTitleChange = (value) => {
    setExamState((prev) => ({
      ...prev,
      examData: {
        ...prev.examData,
        title: value,
      },
    }));
  };

  const handleAddSection = () => {
    updateExamSections((sections) => [...sections, createSection(sections.length + 1)]);
  };

  const handleSectionTitleChange = (sectionIndex, value) => {
    updateExamSections((sections) =>
      sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              title: value,
            }
          : section
      )
    );
  };

  const handleAddQuestion = (sectionIndex) => {
    updateExamSections((sections) =>
      sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              questions: [...(Array.isArray(section.questions) ? section.questions : []), createQuestion((section.questions || []).length + 1)],
            }
          : section
      )
    );
  };

  const handleQuestionTextChange = (sectionIndex, questionIndex, value) => {
    updateExamSections((sections) =>
      sections.map((section, currentSectionIndex) => {
        if (currentSectionIndex !== sectionIndex) {
          return section;
        }

        return {
          ...section,
          questions: (section.questions || []).map((question, currentQuestionIndex) =>
            currentQuestionIndex === questionIndex
              ? {
                  ...question,
                  text: value,
                }
              : question
          ),
        };
      })
    );
  };

  const handleDeleteQuestion = (sectionIndex, questionIndex) => {
    updateExamSections((sections) =>
      sections.map((section, currentSectionIndex) => {
        if (currentSectionIndex !== sectionIndex) {
          return section;
        }

        return {
          ...section,
          questions: (section.questions || []).filter((_, currentQuestionIndex) => currentQuestionIndex !== questionIndex),
        };
      })
    );
  };

  const handleAddOption = (sectionIndex, questionIndex) => {
    updateExamSections((sections) =>
      sections.map((section, currentSectionIndex) => {
        if (currentSectionIndex !== sectionIndex) {
          return section;
        }

        return {
          ...section,
          questions: (section.questions || []).map((question, currentQuestionIndex) =>
            currentQuestionIndex === questionIndex
              ? {
                  ...question,
                  options: [...(Array.isArray(question.options) ? question.options : []), `Option ${(question.options || []).length + 1}`],
                }
              : question
          ),
        };
      })
    );
  };

  const handleOptionChange = (sectionIndex, questionIndex, optionIndex, value) => {
    updateExamSections((sections) =>
      sections.map((section, currentSectionIndex) => {
        if (currentSectionIndex !== sectionIndex) {
          return section;
        }

        return {
          ...section,
          questions: (section.questions || []).map((question, currentQuestionIndex) => {
            if (currentQuestionIndex !== questionIndex) {
              return question;
            }

            return {
              ...question,
              options: (question.options || []).map((option, currentOptionIndex) =>
                currentOptionIndex === optionIndex ? value : option
              ),
            };
          }),
        };
      })
    );
  };

  const handleSaveExam = async () => {
    if (!examState.examData.exam_id) {
      showToast("error", "Generate an exam before saving changes.");
      return;
    }

    if (!examState.template.id) {
      showToast("error", "Template information is missing.");
      return;
    }

    setExamLoading(true);
    setExamError(null);
    try {
      const updated = await updateExam(examState.examData.exam_id, {
        subject: examState.config.subject,
        lesson_range: examState.config.lesson_range,
        difficulty: examState.config.difficulty,
        template: examState.template.id,
        exam_json: {
          title: examState.examData.title,
          sections: examState.examData.sections,
        },
        status: examState.examData.status || "draft",
      });

      setExamState((prev) => ({
        ...prev,
        loading: false,
        error: null,
        examData: normalizeExamData(updated),
      }));
      showToast("success", "Exam changes saved.");
    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to save exam changes.";
      setExamState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
      showToast("error", message);
    }
  };

  const handlePublishExam = async () => {
    if (!examState.examData.exam_id) {
      showToast("error", "Generate and save an exam before publishing.");
      return;
    }

    setExamLoading(true);
    setExamError(null);
    try {
      const response = await publishExam(examState.examData.exam_id);
      setExamState((prev) => {
        const nextState = {
          ...prev,
          loading: false,
          error: null,
          examData: {
            ...prev.examData,
            status: response.status || "published",
          },
        };

        setPublishedExams((current) => {
          const nextExamEntry = {
            id: nextState.examData.exam_id,
            title: nextState.examData.title || `${nextState.config.subject || "Untitled"} Exam`,
            subject: nextState.config.subject || "General",
            type: "exam_paper",
            status: nextState.examData.status,
            created_at: new Date().toISOString(),
            examData: nextState.examData,
            config: nextState.config,
            template: nextState.template,
          };

          return [nextExamEntry, ...current.filter((item) => item.id !== nextExamEntry.id)];
        });

        return nextState;
      });
      showToast("success", "Exam published successfully.");
    } catch (error) {
      const message = error?.response?.data?.detail || "Failed to publish exam.";
      setExamState((prev) => ({
        ...prev,
        loading: false,
        error: message,
      }));
      showToast("error", message);
    }
  };

  const latestFileType = latestMaterial?.file_type || "";
  const latestFileUrl = latestMaterial?.file_url || null;
  const latestIsPdf = latestFileType === "pdf";
  const latestIsDoc = latestFileType === "doc" || latestFileType === "docx";
  const isCurrentlyPublished = latestMaterial?.status === "published";
  const examSections = Array.isArray(examState.examData.sections) ? examState.examData.sections : [];
  const isExamPublished = examState.examData.status === "published";
  const studioItems = [
    ...publishedExams.map((item) => ({
      ...item,
      itemType: "exam",
    })),
    ...materials.map((item) => ({
      ...item,
      itemType: "note",
    })),
  ];

  const handleOpenPublishedExam = (item) => {
    setStudioMode("exam");
    setExamState((prev) => ({
      ...prev,
      template: item.template || prev.template,
      config: item.config || prev.config,
      examData: item.examData || prev.examData,
      loading: false,
      error: null,
    }));
    showToast("success", `Loaded ${item.title}`);
  };

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

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Notes Studio</h1>
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-semibold">Materials</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage study materials and build exam drafts from the same workspace.
            </p>
          </div>

          <Tabs value={studioMode} onValueChange={setStudioMode} className="w-full md:w-auto">
            <TabsList className="bg-gray-100 dark:bg-gray-900">
              <TabsTrigger value="materials">Notes Studio</TabsTrigger>
              <TabsTrigger value="exam">Exam Generator</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {studioMode === "materials" ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter material title..."
                className="text-base font-medium border-0 border-b-2 border-transparent focus-visible:ring-0 focus-visible:border-primary rounded-none px-0 bg-transparent h-auto py-1 shadow-none"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                <Input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Subject"
                  className="h-9"
                />
                <Input
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  placeholder="Tags (comma separated)"
                  className="h-9"
                />
                <select
                  value={noteType}
                  onChange={(event) => setNoteType(event.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {NOTE_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
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
              <Button
                onClick={handlePublishMaterial}
                disabled={isPublishing || isCurrentlyPublished}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {isPublishing ? "Publishing..." : isCurrentlyPublished ? "Published" : "Publish"}
              </Button>
              <Button
                onClick={handleSaveMaterial}
                disabled={isSaving}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : editingMaterialId ? "Update Draft" : "Save as Draft"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Exam Generator</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    isExamPublished
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {isExamPublished ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload a mock template, configure the paper, generate a draft, then edit sections locally.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Button variant="outline" size="sm" onClick={resetExamState}>
                Clear
              </Button>
              <Button
                onClick={handleGenerateExam}
                disabled={examState.loading || !examState.template.id}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {examState.loading && !examState.examData.exam_id ? "Generating..." : "Generate Exam"}
              </Button>
              <Button
                onClick={handleSaveExam}
                disabled={examState.loading || !examState.examData.exam_id}
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <Save className="w-4 h-4 mr-2" />
                {examState.loading && examState.examData.exam_id ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handlePublishExam}
                disabled={examState.loading || !examState.examData.exam_id || isExamPublished}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {examState.loading && examState.examData.exam_id && !isExamPublished ? "Publishing..." : isExamPublished ? "Published" : "Publish"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {studioMode === "materials" ? (
        editingMaterialId ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 px-3 py-2 text-sm flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit mode is active. Saving will update this note.
            <span
              className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                isCurrentlyPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {isCurrentlyPublished ? "Published" : "Draft"}
            </span>
          </div>
        ) : (
          <div className="rounded-md border border-amber-200 bg-amber-50 text-amber-800 px-3 py-2 text-sm">
            New notes are saved as drafts until you publish.
          </div>
        )
      ) : (
        <div className="rounded-md border border-sky-200 bg-sky-50 text-sky-800 px-3 py-2 text-sm">
          Follow the four steps below: upload template, configure exam, generate, then preview and edit locally.
        </div>
      )}

      {studioMode === "exam" && examState.error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 text-rose-700 px-3 py-2 text-sm">
          {examState.error}
        </div>
      ) : null}

      {studioMode === "materials" ? (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          <div className="lg:col-span-8 flex flex-col h-full overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 shadow-sm">
            <Tabs
              defaultValue="editor"
              value={activeTab === "upload" ? "upload" : "editor"}
              onValueChange={setActiveTab}
              className="h-full flex flex-col w-full"
            >
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

              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                {activeTab === "upload" ? (
                  <div className="flex-1 min-h-0 h-full w-full m-0 p-0 border-0 outline-none bg-gray-50/50 dark:bg-gray-950 overflow-auto">
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
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Accepted: PDF, DOCX</p>
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
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 h-full m-0 p-0 border-0 outline-none flex flex-col md:flex-row min-w-0">
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
                  </div>
                )}
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
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMaterials ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              <CardContent className="p-2.5">
                {isLoadingMaterials ? <p className="text-sm text-gray-500">Loading saved materials...</p> : null}
                {materialsError ? <p className="text-sm text-rose-600">{materialsError}</p> : null}
                {!isLoadingMaterials && !materialsError && studioItems.length === 0 ? (
                  <p className="text-sm text-gray-500">No materials saved yet.</p>
                ) : null}

                {!isLoadingMaterials && !materialsError && studioItems.length > 0 ? (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {studioItems.map((item) => {
                      if (item.itemType === "exam") {
                        const createdAt = item.created_at ? new Date(item.created_at).toLocaleString() : "";

                        return (
                          <button
                            type="button"
                            key={`exam-${item.id}`}
                            onClick={() => handleOpenPublishedExam(item)}
                            className="w-full text-left border rounded-lg p-2.5 transition-colors border-gray-200 dark:border-gray-800 hover:border-primary/50"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">{item.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{createdAt}</p>
                                <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                                  {item.subject || "General"} | Exam Paper
                                </p>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-700">
                                  Published
                                </span>
                                <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-sky-100 text-sky-700">
                                  Exam
                                </span>
                              </div>
                            </div>

                            <p className="text-[10px] text-sky-600 mt-1">Click to open exam preview</p>
                          </button>
                        );
                      }

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
                              <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                                {item.subject || "General"} | {item.note_type || "Lecture"}
                              </p>
                            </div>
                            <div className="flex items-center gap-0.5 flex-shrink-0">
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                                  item.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                }`}
                              >
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
      ) : (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          <div className="lg:col-span-8 flex flex-col gap-4 overflow-y-auto">
            <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-900">Step 1</span>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Template Upload</h3>
              </div>
              <CardContent className="p-4 space-y-4">
                <input
                  ref={examTemplateInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleExamTemplateChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={handleExamTemplateBrowse}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary/50 rounded-xl p-8 text-center transition-colors"
                >
                  <div className="mx-auto w-fit p-3 rounded-full bg-primary/10 mb-3">
                    <UploadIcon className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">Select exam template PDF</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mock only. No real file upload is performed.</p>
                </button>

                {examState.template.file ? (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{examState.template.fileName}</p>
                      <p className="text-xs text-gray-500">{(examState.template.file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button size="sm" onClick={handleUploadTemplate} disabled={examState.loading}>
                      {examState.loading && !examState.template.id ? "Uploading..." : "Upload Template"}
                    </Button>
                  </div>
                ) : null}

                {examState.template.id ? (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Mock JSON Preview</p>
                    <pre className="text-xs overflow-auto rounded bg-gray-50 dark:bg-gray-900 p-3">
                      {JSON.stringify({ pattern: examState.template.pattern }, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-900">Step 2</span>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Exam Configuration</h3>
              </div>
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  value={examState.config.subject}
                  onChange={(event) => handleExamConfigChange("subject", event.target.value)}
                  placeholder="Subject"
                />
                <Input
                  value={examState.config.lesson_range}
                  onChange={(event) => handleExamConfigChange("lesson_range", event.target.value)}
                  placeholder="Lesson Range"
                />
                <select
                  value={examState.config.difficulty}
                  onChange={(event) => handleExamConfigChange("difficulty", event.target.value)}
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {EXAM_DIFFICULTIES.map((item) => (
                    <option key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-900">Step 3</span>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Generate Exam</h3>
              </div>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate a draft using the selected template and current configuration.
                </p>
                <Button onClick={handleGenerateExam} disabled={examState.loading || !examState.template.id}>
                  {examState.loading && !examState.examData.exam_id ? "Generating..." : "Generate Exam"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-900">Step 4</span>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Preview & Edit</h3>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddSection} disabled={!examState.examData.exam_id}>
                  + Add Section
                </Button>
              </div>
              <CardContent className="p-4 space-y-4">
                {!examState.examData.exam_id ? (
                  <p className="text-sm text-gray-500">No exam generated yet</p>
                ) : null}

                {examState.examData.exam_id ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Exam Title</p>
                      <Input
                        value={examState.examData.title || ""}
                        onChange={(event) => handleExamTitleChange(event.target.value)}
                        placeholder="Exam title"
                      />
                    </div>

                    {examSections.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-4 text-sm text-gray-500">
                        No sections yet. Use <span className="font-medium text-gray-700 dark:text-gray-200">Add Section</span> to start editing.
                      </div>
                    ) : null}

                    {examSections.map((section, sectionIndex) => (
                      <div key={section.id || `section-${sectionIndex}`} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-3">
                        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
                          <Input
                            value={section.title || ""}
                            onChange={(event) => handleSectionTitleChange(sectionIndex, event.target.value)}
                            placeholder={`Section ${sectionIndex + 1}`}
                          />
                          <Button variant="outline" size="sm" onClick={() => handleAddQuestion(sectionIndex)}>
                            + Add Question
                          </Button>
                        </div>

                        {(section.questions || []).length === 0 ? (
                          <p className="text-sm text-gray-500">No questions added to this section yet.</p>
                        ) : null}

                        {(section.questions || []).map((question, questionIndex) => (
                          <div key={question.id || `question-${sectionIndex}-${questionIndex}`} className="rounded-md border border-gray-200 dark:border-gray-800 p-3 space-y-3 bg-gray-50/60 dark:bg-gray-900/40">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-medium text-gray-500 uppercase">
                                Question {questionIndex + 1}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteQuestion(sectionIndex, questionIndex)}
                              >
                                Delete
                              </Button>
                            </div>

                            <Textarea
                              value={question.text || ""}
                              onChange={(event) => handleQuestionTextChange(sectionIndex, questionIndex, event.target.value)}
                              placeholder="Enter question text"
                              className="min-h-[90px]"
                            />

                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-medium text-gray-500 uppercase">Options</p>
                                <Button variant="outline" size="sm" onClick={() => handleAddOption(sectionIndex, questionIndex)}>
                                  + Add Option
                                </Button>
                              </div>

                              {(question.options || []).length === 0 ? (
                                <p className="text-sm text-gray-500">No options added for this question.</p>
                              ) : null}

                              {(question.options || []).map((option, optionIndex) => (
                                <Input
                                  key={`option-${sectionIndex}-${questionIndex}-${optionIndex}`}
                                  value={option || ""}
                                  onChange={(event) =>
                                    handleOptionChange(sectionIndex, questionIndex, optionIndex, event.target.value)
                                  }
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto">
            <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
              <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-indigo-500" />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Generator Summary</h3>
              </div>
              <CardContent className="p-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><span className="font-medium">Template:</span> {examState.template.fileName || "Not uploaded"}</p>
                <p><span className="font-medium">Subject:</span> {examState.config.subject || "Not set"}</p>
                <p><span className="font-medium">Lesson Range:</span> {examState.config.lesson_range || "Not set"}</p>
                <p><span className="font-medium">Difficulty:</span> {examState.config.difficulty || "Not set"}</p>
                <p><span className="font-medium">Exam ID:</span> {examState.examData.exam_id || "Not generated"}</p>
                <p><span className="font-medium">Sections:</span> {examSections.length}</p>
                <p><span className="font-medium">Loading:</span> {examState.loading ? "Yes" : "No"}</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950">
              <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Exam JSON Preview</h3>
              </div>
              <CardContent className="p-3">
                <pre className="text-xs overflow-auto rounded bg-gray-50 dark:bg-gray-900 p-3 max-h-[420px]">
                  {JSON.stringify(
                    {
                      exam_id: examState.examData.exam_id,
                      title: examState.examData.title,
                      sections: examSections,
                    },
                    null,
                    2
                  )}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
