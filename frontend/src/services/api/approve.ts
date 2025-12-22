export async function approveReset(resetId: string) {
  const res = await fetch("/api/admin/approvals/approve", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reset_request_id: resetId }),
  });

  if (!res.ok) throw new Error("Approval failed");
  return res.json();
}
