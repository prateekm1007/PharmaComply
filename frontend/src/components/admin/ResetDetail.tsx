"use client";

import { useState } from "react";
import { approveReset } from "@/src/services/api/approve";
import { denyReset } from "@/src/services/api/deny";
import { escalateRequest } from "@/src/services/api/escalate";

export function ResetDetail({
  resetId,
  amount,
  reason,
  orgName,
}: {
  resetId: string;
  amount: number;
  reason: string;
  orgName: string;
}) {
  const [loading, setLoading] = useState("");

  async function handle(action: string, fn: () => Promise<any>) {
    setLoading(action);
    try {
      await fn();
      alert(`${action} success`);
    } catch {
      alert(`${action} failed`);
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="text-lg font-bold mb-2">Reset Request</h2>
      <p><strong>Org:</strong> {orgName}</p>
      <p><strong>Amount:</strong> {amount}</p>
      <p><strong>Reason:</strong> {reason}</p>

      <div className="mt-4 flex gap-2">
        <button
          disabled={loading === "Approve"}
          onClick={() => handle("Approve", () => approveReset(resetId))}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          {loading === "Approve" ? "Approving..." : "Approve"}
        </button>

        <button
          disabled={loading === "Deny"}
          onClick={() => handle("Deny", () => denyReset(resetId))}
          className="px-3 py-1 bg-gray-600 text-white rounded"
        >
          {loading === "Deny" ? "Denying..." : "Deny"}
        </button>

        <button
          disabled={loading === "Escalate"}
          onClick={() => handle("Escalate", () => escalateRequest(resetId))}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          {loading === "Escalate" ? "Escalating..." : "Escalate"}
        </button>
      </div>
    </div>
  );
}
