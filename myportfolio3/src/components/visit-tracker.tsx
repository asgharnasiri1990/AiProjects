"use client";

import { useEffect } from "react";

let sent = false;

interface Hints {
  mobile?: boolean;
  model?: string;
  platform?: string;
  platformVersion?: string;
  brands?: { brand: string; version: string }[];
}

/**
 * Asks the browser for its own device hints (Chrome/Edge only). Everything is
 * optional: browsers without the API simply send nothing and the server falls
 * back to the user-agent header.
 */
async function readHints(): Promise<Hints> {
  const data = (
    navigator as Navigator & {
      userAgentData?: {
        mobile?: boolean;
        getHighEntropyValues?: (keys: string[]) => Promise<{
          model?: string;
          platform?: string;
          platformVersion?: string;
          fullVersionList?: { brand: string; version: string }[];
        }>;
      };
    }
  ).userAgentData;

  const hints: Hints = {};
  if (!data) return hints;
  if (typeof data.mobile === "boolean") hints.mobile = data.mobile;

  try {
    const high = await data.getHighEntropyValues?.([
      "model",
      "platform",
      "platformVersion",
      "fullVersionList",
    ]);
    if (!high) return hints;
    if (high.model) hints.model = high.model;
    if (high.platform) hints.platform = high.platform;
    if (high.platformVersion) hints.platformVersion = high.platformVersion;
    if (high.fullVersionList) hints.brands = high.fullVersionList;
  } catch {
    // Permission or unsupported key: the aggregate counters still work.
  }

  return hints;
}

/**
 * Counts one page load per browser session. Fire-and-forget; failures are
 * intentionally silent.
 */
export function VisitTracker() {
  useEffect(() => {
    if (sent) return;
    sent = true;

    void (async () => {
      const hints = await readHints();
      await fetch("/api/visit", {
        method: "POST",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(hints),
      }).catch(() => undefined);
    })();
  }, []);

  return null;
}
