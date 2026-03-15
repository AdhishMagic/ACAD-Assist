import { useQuery } from "@tanstack/react-query";
import { searchAPI } from "../services/searchAPI";
import { useState, useEffect } from "react";

// Hook for debouncing input values
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const useGlobalSearch = (query) => {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchAPI.globalSearch(debouncedQuery),
    enabled: !!debouncedQuery,
    staleTime: 60000,
  });
};
