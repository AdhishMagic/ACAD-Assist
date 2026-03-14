import axios from "axios";

const aiApi = axios.create({
  baseURL: import.meta.env.VITE_AI_SERVICE_URL || "/ai/v1",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export const aiService = {
  chat: (payload) => aiApi.post("/chat/", payload),
  summarize: (payload) => aiApi.post("/summarize/", payload),
  generateEmbeddings: (payload) => aiApi.post("/embeddings/", payload),
  healthCheck: () => aiApi.get("/health/"),
};
