import { useQuery } from "@tanstack/react-query";

export async function fetchTimeline(caseId: string) {
  const res = await fetch(`/api/admin/case/${caseId}/timeline`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("failed to load timeline");
  return res.json();
}

export function useCaseTimeline(caseId: string) {
  return useQuery({
    queryKey: ["timeline", caseId],
    queryFn: () => fetchTimeline(caseId),
    refetchInterval: 15000
  });
}
