export async function approveReset({ id, comment }) {
  const metadata = {
    userAgent: navigator.userAgent,
    clientTimestamp: new Date().toISOString(),
  };

  const res = await fetch(`/api/admin/approvals/${id}/approve`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment, metadata })
  });

  if (!res.ok) throw new Error("Approve failed");
  return res.json();
}

export async function denyReset({ id, comment }) {
  const metadata = {
    userAgent: navigator.userAgent,
    clientTimestamp: new Date().toISOString(),
  };

  const res = await fetch(`/api/admin/approvals/${id}/deny`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment, metadata })
  });

  if (!res.ok) throw new Error("Deny failed");
  return res.json();
}
