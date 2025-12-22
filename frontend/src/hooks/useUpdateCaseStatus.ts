import { useMutation } from "@tanstack/react-query";
import { updateCaseStatus } from "../services/api/updateCaseStatus";

export function useUpdateCaseStatus(caseId: string) {
  return useMutation({
    mutationFn: (status) => updateCaseStatus(caseId, status)
  });
}
