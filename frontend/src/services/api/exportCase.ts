export function exportCase(caseId: string) {
  return fetch(`/api/admin/case/${caseId}/export`, {
    method: "GET",
    credentials: "include"
  }).then(res => res.blob());
}
