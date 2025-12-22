import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { QueueResponse, QueueItem } from '@/types/queue';

export function useQueue(limit = 50) {
  const query = useQuery({
    queryKey: ['approval-queue', { limit }],
    queryFn: async () => {
      const { data } = await api.get<QueueResponse>(
        `/api/admin/approvals/queue?limit=${limit}`
      );
      return data;
    },
    // Poll every 5s to keep lock states and new items fresh
    refetchInterval: 5000,
    // Don't refetch if window hidden to save bandwidth/DB
    refetchOnWindowFocus: true,
    // Keep data fresh
    staleTime: 2000,
    retry: false,
  });

  return {
    queue: query.data?.queue || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    error: query.error
  };
}
