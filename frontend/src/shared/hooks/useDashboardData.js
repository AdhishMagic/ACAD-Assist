import { useQuery } from "@tanstack/react-query";

export function useDashboardData(queryKey, queryFn) {
  return useQuery({
    queryKey: ["dashboard", ...[].concat(queryKey || [])],
    queryFn,
    staleTime: 2 * 60 * 1000,
  });
}
