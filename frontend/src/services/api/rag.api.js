import axios from "axios";

const ragApi = axios.create({
  baseURL: import.meta.env.VITE_RAG_SERVICE_URL || "/rag/v1",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export const ragService = {
  query: (payload) => ragApi.post("/query/", payload),
  ingest: (formData) =>
    ragApi.post("/ingest/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  healthCheck: () => ragApi.get("/health/"),
};
