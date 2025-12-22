export async function fetchResetDetail(id: string) {
  const res = await fetch(`/api/admin/approvals/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch reset detail");
  return res.json();
}
