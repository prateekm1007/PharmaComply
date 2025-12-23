import { useQuery } from "@tanstack/react-query";

export async function fetchAuditLog() {
  const res = await fetch("/api/admin/audit-log", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch audit log");
  return res.json();
}

export function useAuditLog() {
  return useQuery({
    queryKey: ["auditLog"],
    queryFn: fetchAuditLog,
    refetchInterval: 10000,
  });
}
