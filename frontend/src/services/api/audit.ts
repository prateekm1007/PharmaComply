export async function fetchAuditLog({ cursor }: { cursor?: string }) {
  const url = cursor
    ? `/api/admin/audit-log?cursor=${encodeURIComponent(cursor)}`
    : "/api/admin/audit-log";

  const res = await fetch(url, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("audit log fetch failed");
  return res.json(); // must match backend contract
}
