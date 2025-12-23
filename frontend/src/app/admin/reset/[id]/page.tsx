import { useResetDetail } from "../../../../hooks/useResetDetail";
"use client";

import { ResetDetail } from "@/src/components/admin/ResetDetail";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetDetailPage({ params }: { params: { id: string } }) {
  const resetId = params.id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          \`/api/admin/approvals/detail?reset_request_id=\${resetId}\`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("No record");

        const json = await res.json();
        setData(json);
      } catch (err) {
        alert("Request not found or expired");
        router.push("/admin/approvals");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resetId]);

  if (loading) return <div className="p-4">Loading reset request...</div>;

  if (!data)
    return <div className="p-4 text-red-500">Reset request not found.</div>;

  return (
    <div className="p-6">
      <ResetDetail
        resetId={resetId}
        amount={data.requested_amount}
        orgName={data.organization_name}
        reason={data.reason}
      />
    </div>
  );
}
