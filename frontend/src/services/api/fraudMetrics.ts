import { http } from "./http"

export function fetchFraudMetrics(days = 30) {
  return http(`/api/admin/fraud-metrics?days=${days}`)
}
