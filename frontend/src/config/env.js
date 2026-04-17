// Properly read Vite environment variables
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const rawAiServiceUrl = import.meta.env.VITE_AI_SERVICE_URL;
const rawRagServiceUrl = import.meta.env.VITE_RAG_SERVICE_URL;
const rawSocketUrl = import.meta.env.VITE_SOCKET_URL;

// Normalize API base URL by removing /api/v1 suffix if present
const normalizeUrl = (url) => {
  if (!url) return null;
  return String(url).replace(/\/api\/v1\/?$/i, "").replace(/\/$/, "");
};

// Defaults for local development
const API_BASE_URL = normalizeUrl(rawApiBaseUrl) || "http://localhost:8000";
const AI_SERVICE_URL = rawAiServiceUrl || "http://localhost:8001/api/v1";
const RAG_SERVICE_URL = rawRagServiceUrl || "http://localhost:8002/api/v1";
const SOCKET_URL = normalizeUrl(rawSocketUrl) || API_BASE_URL;

export const env = {
  API_BASE_URL,
  AI_SERVICE_URL,
  RAG_SERVICE_URL,
  SOCKET_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME || "ACAD-Assist",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
