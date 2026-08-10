import axios from "axios";

const getToken = () => localStorage.getItem("access_token") || localStorage.getItem("token");

const createClient = (baseURL) => {
  const client = axios.create({ baseURL });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

export const apiClient = createClient(import.meta.env.VITE_API_BASE_URL || "");
export const aiClient = createClient(import.meta.env.VITE_AI_SERVICE_URL || "/ai");
export const ragClient = createClient(import.meta.env.VITE_RAG_SERVICE_URL || "/rag");

export default apiClient;
