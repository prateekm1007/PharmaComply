export async function registerViewer(requestId: string, viewerId: string) {
  return fetch(`/api/admin/approvals/${requestId}/lock`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ viewerId }),
  });
}

export async function unregisterViewer(requestId: string, viewerId: string) {
  return fetch(`/api/admin/approvals/${requestId}/unlock`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ viewerId }),
  });
}
