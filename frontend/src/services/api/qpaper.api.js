import api from "./axios";

export const qpaperApi = {
  generate: (payload) => api.post("/qpaper/generate/", payload),
  getAll: (params) => api.get("/qpaper/", { params }),
  getById: (id) => api.get(`/qpaper/${id}/`),
  delete: (id) => api.delete(`/qpaper/${id}/`),
  export: (id, format) => api.get(`/qpaper/${id}/export/?format=${format}`, { responseType: "blob" }),
};
