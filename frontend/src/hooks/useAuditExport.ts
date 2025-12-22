import { useState } from "react";

export function useAuditExport() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function exportAudit(resetId: string) {
    setLoading(true);
    try:
      const res = await fetch(`/api/admin/audit/export?reset_id=${resetId}`);
      if (!res.ok) throw new Error("export_failed");

      const body = await res.json();
      setResult(body);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return { exportAudit, loading, result };
}
