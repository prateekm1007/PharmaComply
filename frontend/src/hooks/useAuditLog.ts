import { useQuery } from "@tanstack/react-query";

export function useAuditLog(page = 1) {
  return useQuery({
    queryKey: ["auditLog", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/audit?page=${page}`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed audit log fetch");
      return res.json();
    }
  });
}
