import api from "./axios";

export const coursesApi = {
  getAll: (params) => api.get("/courses/", { params }),
  getById: (id) => api.get(`/courses/${id}/`),
  create: (data) => api.post("/courses/", data),
  update: (id, data) => api.patch(`/courses/${id}/`, data),
  delete: (id) => api.delete(`/courses/${id}/`),
  enroll: (id) => api.post(`/courses/${id}/enroll/`),
  getModules: (courseId) => api.get(`/courses/${courseId}/modules/`),
  getLessons: (courseId, moduleId) =>
    api.get(`/courses/${courseId}/modules/${moduleId}/lessons/`),
};
