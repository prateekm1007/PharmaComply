"use client";
import { useState } from "react";
import { useAuditLog } from "../../hooks/useAuditLog";

export function AuditLogTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAuditLog(page);

  if (isLoading) return <div>Loading audit logs...</div>;
  if (error) return <div>Error loading logs</div>;

  const rows = data?.data ?? [];

  return (
    <div className="space-y-4">
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Admin ID</th>
            <th>Action</th>
            <th>Session ID</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any) => (
            <tr key={row.id} className="border-b">
              <td className="p-1">{row.admin_id}</td>
              <td>{row.action}</td>
              <td>{row.session_id}</td>
              <td>{new Date(row.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <button
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
