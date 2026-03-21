import api from "./axios";

const MOCK_STORAGE_KEY = "acad_assist_mock_courses";

const DEFAULT_MOCK_COURSES = [
  {
    id: 101,
    title: "Learning How to Learn",
    description: "Study techniques, memory tools, and how to plan your practice.",
    instructor_name: "ACAD-Assist",
  },
  {
    id: 102,
    title: "Academic Writing Basics",
    description: "Structure, citations, paraphrasing, and avoiding plagiarism.",
    instructor_name: "ACAD-Assist",
  },
  {
    id: 103,
    title: "Exam Preparation Toolkit",
    description: "Revision strategy, time management, and past-paper practice.",
    instructor_name: "ACAD-Assist",
  },
];

function asAxiosResponse(data, status = 200) {
  return {
    data,
    status,
    statusText: status === 200 ? "OK" : "ERROR",
    headers: {},
    config: {},
  };
}

function shouldFallbackToMock(error) {
  // Network error, backend down, CORS, proxy not running, etc.
  if (!error || !error.response) return true;
  const status = error.response?.status;
  return status === 404 || status === 502 || status === 503 || status === 504;
}

function loadMockCourses() {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (!raw) return [...DEFAULT_MOCK_COURSES];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [...DEFAULT_MOCK_COURSES];
  } catch {
    return [...DEFAULT_MOCK_COURSES];
  }
}

function saveMockCourses(courses) {
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(courses));
  } catch {
    // ignore
  }
}

export const coursesApi = {
  getAll: async (params) => {
    try {
      return await api.get("/courses/", { params });
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      const results = loadMockCourses();
      return asAxiosResponse({ results });
    }
  },

  getById: async (id) => {
    try {
      return await api.get(`/courses/${id}/`);
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      const course = loadMockCourses().find((c) => String(c.id) === String(id));
      if (!course) {
        return asAxiosResponse({ detail: "Course not found" }, 404);
      }
      return asAxiosResponse(course);
    }
  },

  create: async (data) => {
    try {
      return await api.post("/courses/", data);
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      const courses = loadMockCourses();
      const now = Date.now();
      const newCourse = {
        id: now,
        title: data?.title || data?.name || "New Course",
        description: data?.description || "",
        instructor_name: data?.instructor_name || "You",
        created_at: new Date(now).toISOString(),
      };
      const updated = [newCourse, ...courses];
      saveMockCourses(updated);
      return asAxiosResponse(newCourse, 201);
    }
  },

  update: async (id, data) => {
    try {
      return await api.patch(`/courses/${id}/`, data);
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      const courses = loadMockCourses();
      const idx = courses.findIndex((c) => String(c.id) === String(id));
      if (idx === -1) return asAxiosResponse({ detail: "Course not found" }, 404);
      const updatedCourse = { ...courses[idx], ...data, id: courses[idx].id };
      const updated = [...courses];
      updated[idx] = updatedCourse;
      saveMockCourses(updated);
      return asAxiosResponse(updatedCourse);
    }
  },

  delete: async (id) => {
    try {
      return await api.delete(`/courses/${id}/`);
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      const courses = loadMockCourses();
      const updated = courses.filter((c) => String(c.id) !== String(id));
      saveMockCourses(updated);
      return asAxiosResponse({ success: true });
    }
  },

  enroll: (id) => api.post(`/courses/${id}/enroll/`),
  getModules: (courseId) => api.get(`/courses/${courseId}/modules/`),
  getLessons: (courseId, moduleId) =>
    api.get(`/courses/${courseId}/modules/${moduleId}/lessons/`),
};
