export async function denyReset(resetId: string) {
  const res = await fetch("/api/admin/approvals/deny", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reset_request_id: resetId }),
  });

  if (!res.ok) throw new Error("Deny failed");
  return res.json();
}
