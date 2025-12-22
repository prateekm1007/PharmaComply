"use client";

import { escalateRequest } from "@/src/services/api/escalate";
import { useState } from "react";

export function EscalateButton({ resetId }: { resetId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleEscalate() {
    setLoading(true);
    try {
      await escalateRequest(resetId);
      alert("Escalated to Security Operations / Super Admin");
    } catch (err) {
      alert("Escalation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleEscalate}
      disabled={loading}
      className="px-3 py-1 text-sm bg-red-600 text-white rounded"
    >
      {loading ? "Escalating..." : "Escalate"}
    </button>
  );
}
