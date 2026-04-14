import { apiClient } from '@/shared/lib/http/axios';

function parseTags(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeNote(note = {}) {
  const subjectName = note?.subject_name || note?.subject?.name || note?.subject || 'General';
  const authorName = note?.created_by_name || note?.author_name || note?.uploaded_by_email || 'Unknown';
  const tags = parseTags(note?.tags);

  return {
    id: note?.id,
    title: note?.title || 'Untitled',
    content: note?.content || '',
    subject: subjectName,
    subjectId: note?.subject || null,
    subjectCode: note?.subject_code || null,
    tags,
    type: note?.type || note?.note_type || 'Lecture',
    author: authorName,
    createdAt: note?.created_at || note?.createdAt,
    updatedAt: note?.updated_at || note?.updatedAt,
    isPublished: Boolean(note?.is_published),
    status: note?.status || (note?.is_published ? 'published' : 'draft'),
    isBookmarked: Boolean(note?.is_bookmarked || false),
    fileUrl: note?.file_url || null,
    fileName: note?.file_name || null,
    fileType: note?.file_type || null,
    excerpt: (note?.content || '').slice(0, 220),
  };
}

function normalizeListResponse(payload) {
  if (Array.isArray(payload)) {
    return payload.map(normalizeNote);
  }

  const list = payload?.results || payload?.notes || [];
  return Array.isArray(list) ? list.map(normalizeNote) : [];
}

function buildTagParams(filters = {}) {
  const tags = Array.isArray(filters?.tags) ? filters.tags : [];
  if (tags.length === 0) {
    return undefined;
  }
  return tags.join(',');
}

export const notesAPI = {
  getAllNotes: async (params = {}) => {
    const response = await apiClient.get('/api/notes/', {
      params: {
        search: params?.search || undefined,
        sort: params?.sort || 'newest',
        subject: params?.filters?.subject || undefined,
        tags: buildTagParams(params?.filters),
      },
    });

    return { notes: normalizeListResponse(response.data) };
  },

  getMyNotes: async (params = {}) => {
    const response = await apiClient.get('/api/notes/my/', {
      params: {
        search: params?.search || undefined,
        sort: params?.sort || 'newest',
      },
    });

    return { notes: normalizeListResponse(response.data) };
  },

  createNote: async (payload) => {
    const formData = new FormData();
    const safeTitle = String(payload?.title || '').trim();
    const safeContent = String(payload?.content || '').trim();
    const noteType = payload?.type || payload?.note_type || 'Lecture';

    // Append ONLY required fields - NO DUPLICATES
    formData.append('title', safeTitle);
    formData.append('content', safeContent || safeTitle || 'Draft note');
    formData.append('note_type', noteType);
    formData.append('is_published', 'false');
    formData.append('subject', payload?.subject || '');

    const tags = Array.isArray(payload?.tags)
      ? payload.tags.map((tag) => String(tag || '').trim()).filter(Boolean)
      : [];
    formData.append('tags', JSON.stringify(tags));

    if (payload?.file) {
      formData.append('file', payload.file);
    }

    // LOG THE FINAL PAYLOAD
    const payloadArray = [...formData.entries()];
    const keyCount = {};
    payloadArray.forEach(([key, value]) => {
      keyCount[key] = (keyCount[key] || 0) + 1;
    });
    
    console.log('📋 FORMDATA PAYLOAD (notesAPI.createNote):', {
      entries: payloadArray.map(([k, v]) => [k, v instanceof File ? `File(${v.name})` : v]),
      duplicates: Object.entries(keyCount).filter(([_, count]) => count > 1).map(([k]) => k),
      hasDuplicates: Object.values(keyCount).some(c => c > 1)
    });
    console.log('🚀 POST /api/notes/ with cleaned payload above ↑');

    try {
      const response = await apiClient.post('/api/notes/', formData);
      console.log('✅ POST /api/notes/ SUCCESS:', {
        status: 201,
        noteId: response.data.id,
        title: response.data.title,
        tags: response.data.tags
      });
      return normalizeNote(response.data);
    } catch (error) {
      console.error('❌ POST /api/notes/ FAILED:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        errors: error?.response?.data
      });
      throw error;
    }
  },

  updateNote: async (noteId, payload) => {
    const formData = new FormData();

    if (payload?.title !== undefined) {
      formData.append('title', payload.title || '');
    }

    if (payload?.content !== undefined) {
      formData.append('content', payload.content || '');
    }

    if (payload?.type !== undefined) {
      const noteType = payload.type || 'Lecture';
      formData.append('note_type', noteType);
    }

    if (payload?.subject !== undefined) {
      formData.append('subject', payload.subject || '');
    }

    if (Array.isArray(payload?.tags)) {
      const tags = payload.tags.map((tag) => String(tag || '').trim()).filter(Boolean);
      formData.append('tags', JSON.stringify(tags));
    }

    if (payload?.file) {
      formData.append('file', payload.file);
    }

    // LOG THE FINAL PAYLOAD
    const payloadArray = [...formData.entries()];
    const keyCount = {};
    payloadArray.forEach(([key, value]) => {
      keyCount[key] = (keyCount[key] || 0) + 1;
    });
    
    console.log('📋 FORMDATA PAYLOAD (notesAPI.updateNote):', {
      noteId,
      entries: payloadArray.map(([k, v]) => [k, v instanceof File ? `File(${v.name})` : v]),
      duplicates: Object.entries(keyCount).filter(([_, count]) => count > 1).map(([k]) => k),
      hasDuplicates: Object.values(keyCount).some(c => c > 1)
    });
    console.log('🚀 PATCH /api/notes/' + noteId + '/ with cleaned payload above ↑');

    try {
      const response = await apiClient.patch(`/api/notes/${noteId}/`, formData);
      console.log('✅ PATCH /api/notes/' + noteId + '/ SUCCESS:', {
        status: 200,
        noteId: response.data.id
      });
      return normalizeNote(response.data);
    } catch (error) {
      console.error('❌ PATCH /api/notes/' + noteId + '/ FAILED:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        errors: error?.response?.data
      });
      throw error;
    }
  },

  publishNote: async (noteId) => {
    const response = await apiClient.patch(`/api/notes/${noteId}/publish/`);
    return normalizeNote(response.data);
  },

  getNotesBySubject: async (subjectId, params = {}) => {
    const response = await apiClient.get('/api/notes/', {
      params: {
        search: params?.search || undefined,
        sort: params?.sort || 'newest',
        subject: subjectId,
        tags: buildTagParams(params?.filters),
      },
    });

    return { notes: normalizeListResponse(response.data) };
  },

  getNoteById: async (noteId) => {
    const response = await apiClient.get(`/api/notes/${noteId}/`);
    return normalizeNote(response.data);
  },

  getSubjects: async () => {
    const response = await apiClient.get('/api/notes/subjects/');
    return Array.isArray(response.data) ? response.data : [];
  },

  toggleBookmark: async (noteId) => {
    const response = await apiClient.post(`/api/notes/${noteId}/bookmark/`);
    return normalizeNote(response.data);
  },

  getBookmarkedNotes: async (params = {}) => {
    const response = await apiClient.get('/api/notes/bookmarked/', {
      params: {
        search: params?.search || undefined,
        sort: params?.sort || 'newest',
      },
    });

    return { notes: normalizeListResponse(response.data) };
  },
};
