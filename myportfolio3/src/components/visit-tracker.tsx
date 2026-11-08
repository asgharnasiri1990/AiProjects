"use client";

import { useEffect } from "react";

let sent = false;

/**
 * Counts one page load per browser session. Fire-and-forget; failures are
 * intentionally silent.
 */
export function VisitTracker() {
  useEffect(() => {
    if (sent) return;
    sent = true;

    void fetch("/api/visit", {
      method: "POST",
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  return null;
}
