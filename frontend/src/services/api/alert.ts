export async function ackAlert(alertId: string) {
  return fetch("/api/admin/alert/ack", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ alert_id: alertId })
  });
}

export async function createIncident(alertId: string) {
  return fetch("/api/admin/incident/create", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ alert_id: alertId })
  }).then(r => r.json());
}
