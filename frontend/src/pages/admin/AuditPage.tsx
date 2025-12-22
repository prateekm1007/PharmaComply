import { AuditFeed } from "../../components/admin/AuditFeed";

export default function AuditPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="font-bold text-xl">Audit Log</h1>
      <AuditFeed />
    </div>
  );
}
