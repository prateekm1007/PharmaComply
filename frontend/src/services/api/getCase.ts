export async function fetchCase(caseId: string) {
  const res = await fetch(`/api/admin/case/${caseId}`, {
    credentials: "include"
  });

  if (!res.ok) throw new Error("failed to load case");
  return res.json(); // {case, linked_audit}
}
