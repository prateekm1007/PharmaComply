import { http } from "./http"

export function submitReset(payload: {
  amount: number
  reason: string
  organization_id: string
}) {
  return http("/api/admin/reset", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
