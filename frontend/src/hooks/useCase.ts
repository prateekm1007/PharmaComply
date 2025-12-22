import { useQuery } from "@tanstack/react-query";
import { fetchCase } from "../services/api/getCase";

export function useCase(caseId: string) {
  return useQuery({
    queryKey: ["case", caseId],
    queryFn: () => fetchCase(caseId),
    refetchInterval: 30000
  });
}
