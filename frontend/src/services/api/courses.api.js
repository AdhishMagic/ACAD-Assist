import api from "./axios";
import { isMockMode, shouldFallbackToMock } from "@/shared/lib/http/apiMode";
import { asAxiosResponse } from "@/shared/lib/http/mockResponses";
import { MOCK_COURSES_STORAGE_KEY, mockCoursesSeed } from "@/shared/mocks/courses.mock";

function loadMockCourses() {
  try {
    const raw = localStorage.getItem(MOCK_COURSES_STORAGE_KEY);
    if (!raw) return [...mockCoursesSeed];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return [...mockCoursesSeed];
  } catch {
    return [...mockCoursesSeed];
  }
}

function saveMockCourses(courses) {
  try {
    localStorage.setItem(MOCK_COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch {
    // ignore
  }
}

export const coursesApi = {
  getAll: async (params) => {
    if (isMockMode) {
      const results = loadMockCourses();
      return asAxiosResponse({ results });
    }

    try {
      return await api.get("/courses/", { params });
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      const results = loadMockCourses();
      return asAxiosResponse({ results });
    }
  },

  getById: async (id) => {
    if (isMockMode) {
      const course = loadMockCourses().find((c) => String(c.id) === String(id));
      if (!course) {
        return asAxiosResponse({ detail: "Course not found" }, 404);
      }
      return asAxiosResponse(course);
    }

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
    if (isMockMode) {
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
    if (isMockMode) {
      const courses = loadMockCourses();
      const idx = courses.findIndex((c) => String(c.id) === String(id));
      if (idx === -1) return asAxiosResponse({ detail: "Course not found" }, 404);
      const updatedCourse = { ...courses[idx], ...data, id: courses[idx].id };
      const updated = [...courses];
      updated[idx] = updatedCourse;
      saveMockCourses(updated);
      return asAxiosResponse(updatedCourse);
    }

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
    if (isMockMode) {
      const courses = loadMockCourses();
      const updated = courses.filter((c) => String(c.id) !== String(id));
      saveMockCourses(updated);
      return asAxiosResponse({ success: true });
    }

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
