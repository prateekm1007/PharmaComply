import { useParams } from "react-router-dom";
import { useCase } from "../../../hooks/useCase";

export function CaseDetail() {
  const { id } = useParams();
  const { data, isLoading } = useCase(id!);

  if (isLoading) return <div>Loading case...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Case #{data.case.id}</h1>

      <div>Status: {data.case.status}</div>
      <div>Severity: {data.case.severity}</div>
      <div>Created: {new Date(data.case.created_at).toLocaleString()}</div>

      <h2 className="font-semibold mt-6">Linked Audit Entries</h2>
<button className="text-xs border px-2 py-1" onClick={() => mutate("investigating")}>Start Investigation</button>
<button className="text-xs ml-2 border px-2 py-1" onClick={() => mutate("resolved")}>Resolve Case</button>
<button className="text-xs ml-4 underline" onClick={handleExport}>Export PDF</button>
      <ul className="list-disc ml-4 space-y-1">
        {data.linked_audit.map((a: any) => (
          <li key={a.id} className="text-sm font-mono">
            {a.audit_id}
          </li>
        ))}
      </ul>
<Timeline caseId={data.case.id} />
    </div>
  );
}

function Timeline({ caseId }) {
  const { data, isLoading } = useCaseTimeline(caseId);
  if (isLoading) return <div>Loading timeline...</div>;
  return (
    <div className="mt-6 space-y-1">
      {data.map((t) => (
        <div key={t.id} className="text-xs text-gray-600">
          {new Date(t.created_at).toLocaleString()} — {t.event}
        </div>
      ))}
    </div>
  );
}

async function handleExport() {
  const blob = await exportCase(data.case.id);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `case_${data.case.id}.pdf`;
  a.click();
  window.URL.revokeObjectURL(url);
}
