import { useQuery } from "@tanstack/react-query";

export function useOverdueCount() {
  return useQuery({
    queryKey: ["overdueCount"],
    queryFn: async () => {
      const r = await fetch("/api/admin/cases/overdue-count", {
        credentials: "include"
      });
      if (!r.ok) return { overdue_count: 0 };
      return r.json();
    },
    refetchInterval: 60000
  });
}
