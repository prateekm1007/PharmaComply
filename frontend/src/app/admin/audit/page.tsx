"use client";

import { useAuditLog } from "../../../hooks/useAuditLog";

export default function AuditLogPage() {
  const { data, isLoading, error } = useAuditLog();

  if (isLoading) return <div>Loading audit log…</div>;
  if (error) return <div>Error loading audit log</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Audit Log</h1>
<a href="/api/admin/audit-export" className="text-blue-600 underline">Export CSV</a>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Time</th>
            <th className="p-2 border">Actor</th>
            <th className="p-2 border">Action</th>
            <th className="p-2 border">Target</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr key={row.id}>
              <td className="p-2 border">{new Date(row.created_at).toLocaleString()}</td>
              <td className="p-2 border">{row.actor_email}</td>
              <td className="p-2 border">{row.action}</td>
              <td className="p-2 border">{row.target_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
