import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveReset, denyReset } from "../services/api/approvals";

export function useApprovalActions() {
  const qc = useQueryClient();

  const approve = useMutation({
    mutationFn: approveReset,
    onSuccess: () => {
      qc.invalidateQueries(["approvalQueue"]);
      qc.invalidateQueries(["resetDetail"]);
    }
  });

  const deny = useMutation({
    mutationFn: denyReset,
    onSuccess: () => {
      qc.invalidateQueries(["approvalQueue"]);
      qc.invalidateQueries(["resetDetail"]);
    }
  });

  return { approve, deny };
}
