export async function escalateRequest(resetId: string) {
  const res = await fetch("/api/admin/approvals/escalate", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reset_request_id: resetId }),
  });

  if (!res.ok) throw new Error("Escalation failed");
  return res.json();
}
