import { useEffect, useRef } from "react";
import { registerViewer, unregisterViewer } from "../services/api/locks";

export function useViewPresence(requestId: string) {
  const viewerIdRef = useRef<string>(crypto.randomUUID());
  const viewerId = viewerIdRef.current;

  useEffect(() => {
    if (!requestId) return;

    const heartbeat = () => registerViewer(requestId, viewerId);
    heartbeat();

    const interval = setInterval(heartbeat, 5000);

    const cleanup = () => unregisterViewer(requestId, viewerId);
    window.addEventListener("beforeunload", cleanup);

    return () => {
      clearInterval(interval);
      cleanup();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [requestId]);

  return viewerId;
}
