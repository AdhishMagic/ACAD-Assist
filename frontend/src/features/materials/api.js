import apiClient from "@/shared/lib/http/axios";

function parseTags(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeNote(item = {}) {
  return {
    id: item.id,
    title: item.title || "Untitled",
    content: item.content || "",
    subject: item.subject_name || item.subject || "General",
    tags: parseTags(item.tags),
    note_type: item.note_type || item.type || "Lecture",
    file_url: item.file_url || null,
    file_path: item.file_name || null,
    file_type: item.file_type || "txt",
    status: item.status || (item.is_published ? "published" : "draft"),
    created_at: item.created_at,
    updated_at: item.updated_at,
    uploaded_by_email: item.created_by_email,
    author_name: item.created_by_name,
    is_public: Boolean(item.is_published),
    is_published: Boolean(item.is_published),
  };
}

function toFormData({ title, content, file, subject, tags, type }) {
  const formData = new FormData();
  const safeTitle = (title || "").trim();
  const safeContent = String(content || "").trim();
  const normalizedTags = Array.isArray(tags)
    ? tags.map((tag) => String(tag || "").trim()).filter(Boolean)
    : [];
  const noteType = type || "Lecture";

  // Append ONLY the required fields - NO DUPLICATES
  formData.append("title", safeTitle);
  formData.append("content", safeContent || safeTitle || "Draft note");
  formData.append("note_type", noteType);
  formData.append("is_published", "false");
  formData.append("subject", subject || "");
  formData.append("tags", JSON.stringify(normalizedTags));

  if (file) {
    formData.append("file", file);
  }

  // LOG THE FINAL PAYLOAD - Verify no duplicates, no undefined values
  const payloadArray = [...formData.entries()];
  const keyCount = {};
  payloadArray.forEach(([key, value]) => {
    keyCount[key] = (keyCount[key] || 0) + 1;
  });
  
  console.log("📋 FINAL FORMDATA PAYLOAD:", {
    entries: payloadArray.map(([k, v]) => [
      k, 
      v instanceof File ? `File(${v.name})` : v
    ]),
    keys: Object.keys(keyCount),
    duplicates: Object.entries(keyCount).filter(([_, count]) => count > 1).map(([k]) => k),
    hasDuplicates: Object.values(keyCount).some(c => c > 1),
    fieldCount: keyCount
  });

  return formData;
}

export async function createMaterial({ title, content, file, subject, tags, type }) {
  const formData = toFormData({ title, content, file, subject, tags, type });
  
  console.log("🚀 POST /api/notes/ with payload above ↑");
  
  try {
    const { data } = await apiClient.post("/api/notes/", formData);
    console.log("✅ POST /api/notes/ SUCCESS:", {
      status: 201,
      noteId: data.id,
      title: data.title,
      tags: data.tags,
      note_type: data.note_type,
      is_published: data.is_published
    });
    return normalizeNote(data);
  } catch (error) {
    console.error("❌ POST /api/notes/ FAILED:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      errors: error?.response?.data,
      config: {
        title,
        content,
        subject,
        tags,
        type,
        file: file ? `File(${file.name})` : null
      }
    });
    throw error;
  }
}

export async function updateMaterial(id, { title, content, file, subject, tags, type }) {
  const formData = toFormData({ title, content, file, subject, tags, type });

  console.log("🚀 PATCH /api/notes/" + id + "/ with payload above ↑");
  
  try {
    const { data } = await apiClient.patch(`/api/notes/${id}/`, formData);
    console.log("✅ PATCH /api/notes/" + id + "/ SUCCESS:", {
      status: 200,
      noteId: data.id,
      title: data.title
    });
    return normalizeNote(data);
  } catch (error) {
    console.error("❌ PATCH /api/notes/" + id + "/ FAILED:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      errors: error?.response?.data,
      id,
      config: {
        title,
        content,
        subject,
        tags,
        type,
        file: file ? `File(${file.name})` : null
      }
    });
    throw error;
  }
}

export async function getMyMaterials() {
  const { data } = await apiClient.get("/api/notes/my/");
  return (Array.isArray(data) ? data : []).map(normalizeNote);
}

export async function getMaterialById(id) {
  const { data } = await apiClient.get(`/api/notes/${id}/`);
  return normalizeNote(data);
}

export async function publishMaterial(id) {
  const { data } = await apiClient.patch(`/api/notes/${id}/publish/`);
  return normalizeNote(data);
}

function normalizeTemplate(item = {}) {
  return {
    id: item.id,
    title: item.title || "",
    pattern_json: item.pattern_json || { sections: [] },
    created_at: item.created_at,
  };
}

function normalizeExam(item = {}) {
  const lessonRangeValue = item.lesson_range;
  const normalizedLessonRange =
    lessonRangeValue && typeof lessonRangeValue === "object"
      ? lessonRangeValue.legacy_text
        || (Array.isArray(lessonRangeValue.selected_units) ? lessonRangeValue.selected_units.join(" -> ") : "")
        || `${lessonRangeValue.start_unit || ""}${lessonRangeValue.end_unit ? ` -> ${lessonRangeValue.end_unit}` : ""}`.trim()
      : (item.lesson_range ?? "");

  return {
    id: item.id ?? item.exam_id ?? null,
    title: item.title || item.exam_json?.title || "",
    subject: item.subject || "",
    lesson_range: normalizedLessonRange,
    difficulty: item.difficulty || "",
    template: item.template?.id ?? item.template ?? null,
    exam_json: item.exam_json || { sections: [] },
    status: item.status || "draft",
    created_at: item.created_at,
  };
}

export async function createTemplate(payload) {
  const { data } = await apiClient.post("/api/exam/templates/", payload);
  return normalizeTemplate(data);
}

export const createExamTemplate = createTemplate;

export async function generateExam(payload) {
  const { data } = await apiClient.post("/api/exam/generate/", payload);
  return {
    exam_id: data?.exam_id ?? data?.id ?? null,
    exam_json: data?.exam_json || { sections: [] },
  };
}

export async function getExam(id) {
  const { data } = await apiClient.get(`/api/exam/${id}/`);
  return normalizeExam(data);
}

export async function updateExam(id, payload) {
  const { data } = await apiClient.put(`/api/exam/${id}/`, payload);
  return normalizeExam(data);
}

export async function publishExam(id) {
  const { data } = await apiClient.post(`/api/exam/${id}/publish/`);
  return {
    status: data?.status || "published",
  };
}

export async function getPublicMaterials() {
  const { data } = await apiClient.get("/api/notes/");
  return (Array.isArray(data) ? data : []).map(normalizeNote);
}

// Backward compatible aliases used by existing components.
export const listMaterials = getMyMaterials;
export const getMaterial = getMaterialById;

export async function listMaterialsLibrary() {
  const { data } = await apiClient.get("/api/notes/");
  return (Array.isArray(data) ? data : []).map(normalizeNote);
}

export async function listBookmarkedMaterials() {
  const { data } = await apiClient.get("/api/notes/bookmarked/");
  return (Array.isArray(data) ? data : []).map(normalizeNote);
}

export async function bookmarkMaterial(id) {
  const { data } = await apiClient.post(`/api/notes/${id}/bookmark/`);
  return normalizeNote(data);
}

export async function unbookmarkMaterial(id) {
  const { data } = await apiClient.post(`/api/notes/${id}/bookmark/`);
  return normalizeNote(data);
}
