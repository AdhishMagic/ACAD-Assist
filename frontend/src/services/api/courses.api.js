import api from "./axios";

export const coursesApi = {
  getAll: async (params) => {
    return await api.get("/courses/", { params });
  },

  getById: async (id) => {
    return await api.get(`/courses/${id}/`);
  },

  create: async (data) => {
    return await api.post("/courses/", data);
  },

  update: async (id, data) => {
    return await api.patch(`/courses/${id}/`, data);
  },

  delete: async (id) => {
    return await api.delete(`/courses/${id}/`);
  },

  enroll: (id) => api.post(`/courses/${id}/enroll/`),
  getModules: (courseId) => api.get(`/courses/${courseId}/modules/`),
  getLessons: (courseId, moduleId) =>
    api.get(`/courses/${courseId}/modules/${moduleId}/lessons/`),
};
