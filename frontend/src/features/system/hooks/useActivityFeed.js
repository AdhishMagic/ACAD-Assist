import { useInfiniteQuery } from '@tanstack/react-query';
import { systemAPI } from '../services/systemAPI';

export const useActivityFeed = (filters) => {
  return useInfiniteQuery({
    queryKey: ['activityFeed', filters],
    queryFn: async ({ pageParam = 1 }) => {
      return await systemAPI.getActivityFeed({ ...filters, page: pageParam });
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.hasNextPage ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
