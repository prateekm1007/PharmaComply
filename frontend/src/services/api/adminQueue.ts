import { http } from "./http"

export function fetchApprovalQueue() {
  return http("/api/admin/approvals/queue")
}
