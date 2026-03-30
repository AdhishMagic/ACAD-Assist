import { aiClient } from "@/shared/lib/http/axios";

export const aiService = {
  chat: (payload) => aiClient.post("/chat/", payload),
  summarize: (payload) => aiClient.post("/summarize/", payload),
  generateEmbeddings: (payload) => aiClient.post("/embeddings/", payload),
  healthCheck: () => aiClient.get("/health/"),
};
