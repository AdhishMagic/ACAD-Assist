import { apiClient } from "@/shared/lib/http/axios";

export const searchAPI = {
  globalSearch: async (query) => {
    if (!query) return { results: [] };
    const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};
