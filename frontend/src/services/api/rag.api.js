import { ragClient } from "@/shared/lib/http/axios";

export const ragService = {
  query: (payload) => ragClient.post("/query/", payload),
  ingest: (formData) =>
    ragClient.post("/ingest/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  healthCheck: () => ragClient.get("/health/"),
};
