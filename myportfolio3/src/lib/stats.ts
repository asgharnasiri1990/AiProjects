import { promises as fs } from "node:fs";
import path from "node:path";

export const STAT_KEYS = {
  device: ["mobile", "tablet", "desktop", "other"],
  os: ["ios", "android", "windows", "macos", "linux", "other"],
  browser: ["chrome", "safari", "firefox", "edge", "samsung", "other"],
} as const;

export type StatsGroup = keyof typeof STAT_KEYS;
export type StorageMode = "kv" | "file" | "none";

export interface Classification {
  device: string;
  os: string;
  browser: string;
}

export interface StatsSnapshot {
  storage: StorageMode;
  total: number;
  groups: {
    id: StatsGroup;
    title: string;
    rows: { label: string; count: number }[];
  }[];
}

const FILE = path.join(process.cwd(), ".data", "stats.json");

const LABELS: Record<StatsGroup, Record<string, string>> = {
  device: {
    mobile: "Mobile",
    tablet: "Tablet",
    desktop: "Desktop",
    other: "Other",
  },
  os: {
    ios: "iOS",
    android: "Android",
    windows: "Windows",
    macos: "macOS",
    linux: "Linux",
    other: "Other",
  },
  browser: {
    chrome: "Chrome",
    safari: "Safari",
    firefox: "Firefox",
    edge: "Edge",
    samsung: "Samsung Internet",
    other: "Other",
  },
};

const TITLES: Record<StatsGroup, string> = {
  device: "Devices",
  os: "Operating systems",
  browser: "Browsers",
};

/** Returns null for bots and empty agents so they never enter the counts. */
export function classifyUserAgent(ua: string): Classification | null {
  if (!ua) return null;
  if (/bot|crawler|spider|slurp|bingpreview|headless|facebookexternalhit/i.test(ua)) {
    return null;
  }

  const device = /ipad|tablet|playbook|silk/i.test(ua)
    ? "tablet"
    : /mobi|iphone|ipod|android.*mobile|windows phone/i.test(ua)
      ? "mobile"
      : /windows|macintosh|mac os x|linux|cros/i.test(ua)
        ? "desktop"
        : "other";

  const os = /iphone|ipad|ipod/i.test(ua)
    ? "ios"
    : /android/i.test(ua)
      ? "android"
      : /windows/i.test(ua)
        ? "windows"
        : /macintosh|mac os x/i.test(ua)
          ? "macos"
          : /linux|cros/i.test(ua)
            ? "linux"
            : "other";

  const browser = /edg\//i.test(ua)
    ? "edge"
    : /samsungbrowser/i.test(ua)
      ? "samsung"
      : /firefox|fxios/i.test(ua)
        ? "firefox"
        : /chrome|crios/i.test(ua)
          ? "chrome"
          : /safari/i.test(ua)
            ? "safari"
            : "other";

  return { device, os, browser };
}

function kvEnv() {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token
    ? { url: url.replace(/\/+$/, ""), token }
    : null;
}

export function storageMode(): StorageMode {
  if (kvEnv()) return "kv";
  if (!process.env.VERCEL) return "file";
  return "none";
}

async function kvPipeline(commands: (string | number)[][]) {
  const kv = kvEnv();
  if (!kv) throw new Error("KV is not configured");
  const response = await fetch(`${kv.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kv.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`KV responded ${response.status}`);
  return (await response.json()) as { result: unknown }[];
}

async function readFileCounts(): Promise<Record<string, number>> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Record<
      string,
      number
    >;
  } catch {
    return {};
  }
}

async function writeFileCounts(counts: Record<string, number>) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(counts, null, 2), "utf8");
}

export async function recordVisit(classification: Classification) {
  const mode = storageMode();
  if (mode === "none") return;

  const keys = [
    "total",
    `device:${classification.device}`,
    `os:${classification.os}`,
    `browser:${classification.browser}`,
  ];

  if (mode === "kv") {
    await kvPipeline(keys.map((key) => ["INCR", `stats:${key}`]));
    return;
  }

  const counts = await readFileCounts();
  for (const key of keys) counts[key] = (counts[key] ?? 0) + 1;
  await writeFileCounts(counts);
}

export async function readStats(): Promise<StatsSnapshot> {
  const mode = storageMode();
  const keys = [
    "total",
    ...STAT_KEYS.device.map((value) => `device:${value}`),
    ...STAT_KEYS.os.map((value) => `os:${value}`),
    ...STAT_KEYS.browser.map((value) => `browser:${value}`),
  ];

  const counts: Record<string, number> = {};

  if (mode === "kv") {
    const results = await kvPipeline(keys.map((key) => ["GET", `stats:${key}`]));
    keys.forEach((key, index) => {
      const result = Number(results[index]?.result ?? 0);
      counts[key] = Number.isFinite(result) ? result : 0;
    });
  } else if (mode === "file") {
    Object.assign(counts, await readFileCounts());
  }

  return {
    storage: mode,
    total: counts.total ?? 0,
    groups: (Object.keys(STAT_KEYS) as StatsGroup[]).map((group) => ({
      id: group,
      title: TITLES[group],
      rows: STAT_KEYS[group].map((value) => ({
        label: LABELS[group][value] ?? value,
        count: counts[`${group}:${value}`] ?? 0,
      })),
    })),
  };
}
