import { useAuditLog } from "../../hooks/useAuditLog";

export function AuditFeed() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useAuditLog();

  if (isLoading) return <div>Loading audit logs...</div>;

  return (
    <div className="space-y-3">
      {data?.pages.flatMap((p) =>
        p.entries.map((entry) => (
          <div
            key={entry.id}
            className="p-3 border rounded bg-gray-50 text-sm"
          >
            <div className="font-mono text-xs text-gray-600">
              {entry.id}
<button onClick={() => openCase({severity: "medium", audit_ids: [entry.id] })} 
class="text-xs text-red-600 underline ml-2">Open Case</button>
            </div>

            <div>
              <strong>{entry.actor_email}</strong> {entry.action}
<button onClick={() => openCase({severity: "medium", audit_ids: [entry.id] })} 
class="text-xs text-red-600 underline ml-2">Open Case</button>
            </div>

            <div className="text-xs text-gray-500">
              {new Date(entry.timestamp).toLocaleString()}
<button onClick={() => openCase({severity: "medium", audit_ids: [entry.id] })} 
class="text-xs text-red-600 underline ml-2">Open Case</button>
            </div>
<button onClick={() => openCase({severity: "medium", audit_ids: [entry.id] })} 
class="text-xs text-red-600 underline ml-2">Open Case</button>
          </div>
        ))
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="px-3 py-1 border rounded text-xs"
        >
          Load more
        </button>
      )}
<button onClick={() => openCase({severity: "medium", audit_ids: [entry.id] })} 
class="text-xs text-red-600 underline ml-2">Open Case</button>
    </div>
  );
}
