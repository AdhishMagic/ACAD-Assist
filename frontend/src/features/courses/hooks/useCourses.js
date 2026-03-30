import { useQuery } from "@tanstack/react-query";
import { coursesApi } from "@/services/api";

export function useCourses(params) {
  return useQuery({
    queryKey: ["courses", params || {}],
    queryFn: async () => {
      const response = await coursesApi.getAll(params);
      return response.data?.results || [];
    },
  });
}
