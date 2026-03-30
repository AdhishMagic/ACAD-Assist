import { apiClient } from "@/shared/lib/http/axios";
import { delay, shouldFallbackToMock } from "@/shared/lib/http/apiMode";
import { mockGlobalSearchResults } from "@/shared/mocks/system.mock";

export const searchAPI = {
  globalSearch: async (query) => {
    if (!query) return { results: [] };
    try {
      const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      if (!shouldFallbackToMock(error)) throw error;
      await delay(400);
      const q = query.toLowerCase();
      return {
        results: mockGlobalSearchResults.filter(
          (item) => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
        ),
      };
    }
  }
};
