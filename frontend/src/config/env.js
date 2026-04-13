const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/";
const normalizedApiBaseUrl = String(rawApiBaseUrl).replace(/\/api\/v1\/?$/i, "") || "/";

export const env = {
  API_BASE_URL: normalizedApiBaseUrl,
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL || "/ai/v1",
  RAG_SERVICE_URL: import.meta.env.VITE_RAG_SERVICE_URL || "/rag/v1",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || normalizedApiBaseUrl,
  APP_NAME: import.meta.env.VITE_APP_NAME || "ACAD-Assist",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
