export async function updateCaseStatus(caseId: string, status: string) {
  const res = await fetch(`/api/admin/case/${caseId}/status`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  if (!res.ok) throw new Error("status update failed");
  return res.json();
}
