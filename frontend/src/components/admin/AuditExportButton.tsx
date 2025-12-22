import { useAuditExport } from "@/hooks/useAuditExport";

export function AuditExportButton({ resetId }: { resetId: string }) {
  const { exportAudit, loading, result } = useAuditExport();

  return (
    <div className="space-y-2">
      <button
        disabled={loading}
        onClick={() => exportAudit(resetId)}
        className="px-3 py-1 bg-indigo-600 text-white rounded"
      >
        {loading ? "Exporting..." : "Export Audit Trail"}
      </button>

      {result && (
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
