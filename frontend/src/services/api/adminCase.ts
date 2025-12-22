export async function openCase({ severity, audit_ids, metadata }) {
  const res = await fetch("/api/admin/case/open", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ severity, audit_ids, metadata })
  });

  if (!res.ok) throw new Error("failed to open case");
  return res.json();
}
