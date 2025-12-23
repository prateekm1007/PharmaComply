import { useEffect, useState } from "react";

export function useResetPresence(resetId: string) {
  const [viewers, setViewers] = useState<string[]>([]);

  useEffect(() => {
    if (!resetId) return;

    const acquire = async () => {
      const res = await fetch("/api/admin/reset/lock", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset_id: resetId })
      });
      const json = await res.json();
      setViewers(json.viewers?.map((v: any) => v.admin_email) || []);
    };

    acquire();
    const interval = setInterval(acquire, 30000);

    return () => {
      clearInterval(interval);
      fetch("/api/admin/reset/unlock", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset_id: resetId })
      });
    };
  }, [resetId]);

  return viewers;
}
