import { useQuery } from "@tanstack/react-query";

export function useAnalytics(queryKey, queryFn, options = {}) {
  return useQuery({
    queryKey: ["analytics", ...[].concat(queryKey || [])],
    queryFn,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
