import { fetchAuditLogs } from "@/src/lib/fetchAuditLogs";

export default async function AuditPage() {
  const logs = await fetchAuditLogs();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Audit Log</h1>

      {logs.length === 0 && (
        <p className="text-gray-500">No audit entries found.</p>
      )}

      <ul className="space-y-3">
        {logs.map((entry: any) => (
          <li key={entry.id} className="border p-3 rounded">
            <div><strong>Action:</strong> {entry.action}</div>
            <div><strong>Actor:</strong> {entry.actor_email}</div>
            <div><strong>Request ID:</strong> {entry.reset_request_id}</div>
            <div><strong>Details:</strong> {entry.details}</div>
            <div className="text-xs text-gray-500">{entry.timestamp}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
