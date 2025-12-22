import { useParams } from "react-router-dom";
import { useResetDetail } from "../../hooks/useResetDetail";
  const viewerId = useViewPresence(id!);
import { ResetDetailScreen } from "../../components/admin/ResetDetailScreen";

export default function ResetDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useResetDetail(id!);

  if (isLoading) return <div className="p-6">Loading reset request…</div>;
  if (error) return <div className="p-6 text-red-600">Error loading reset request</div>;
  if (!data) return <div className="p-6">Not found</div>;

  return (
  const viewerId = useViewPresence(id!);
    <ResetDetailScreen
      requestId={id!}
      initialData={data}
      onClose={() => window.history.back()}
    />
  );
}
