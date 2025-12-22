import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAuditLog } from "../services/api/audit";

export function useAuditLog() {
  return useInfiniteQuery({
    queryKey: ["auditLog"],
    queryFn: ({ pageParam }) => fetchAuditLog({ cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage?.next_cursor ?? undefined,
    refetchInterval: 30000, // 30s refresh to detect fraud
  });
}
