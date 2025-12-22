import { ApprovalQueue } from "../../components/admin/ApprovalQueue";

export default function AdminApprovalQueuePage() {
  return (
    <div className="p-6">
      <h1 className="font-bold text-xl mb-4">Approval Queue</h1>
      <ApprovalQueue />
    </div>
  );
}
