export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL || "/ai/v1",
  RAG_SERVICE_URL: import.meta.env.VITE_RAG_SERVICE_URL || "/rag/v1",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "http://localhost:8000",
  APP_NAME: import.meta.env.VITE_APP_NAME || "ACAD-Assist",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
