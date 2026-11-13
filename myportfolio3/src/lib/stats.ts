import { promises as fs } from "node:fs";
import path from "node:path";

export const STAT_GROUPS = {
  device: ["mobile", "tablet", "desktop", "other"],
  os: ["ios", "android", "windows", "macos", "linux", "other"],
  browser: ["chrome", "safari", "firefox", "edge", "samsung", "other"],
} as const;

export type StatsGroup = keyof typeof STAT_GROUPS;
export type StorageMode = "kv" | "file" | "none";
export type StatsRange = "today" | "week" | "month" | "all";

export const STATS_RANGES: StatsRange[] = ["today", "week", "month", "all"];

const RANGE_DAYS: Record<Exclude<StatsRange, "all">, number> = {
  today: 1,
  week: 7,
  month: 30,
};

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
    rows: { id: string; count: number }[];
  }[];
}

const FILE = path.join(process.cwd(), ".data", "stats.json");

/** Cookie planted by /[locale]/stats/unlock; its value is the STATS_TOKEN. */
export const STATS_COOKIE = "stats_auth";

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

/** UTC day bucket, e.g. "2026-11-13". */
function dayKey(date = new Date()) {
  return `stats:day:${date.toISOString().slice(0, 10)}`;
}

function dayList(days: number) {
  const out: string[] = [];
  const now = Date.now();
  for (let index = days - 1; index >= 0; index -= 1) {
    out.push(dayKey(new Date(now - index * 86_400_000)));
  }
  return out;
}

function fields(visit: Classification) {
  return [
    "total",
    `device:${visit.device}`,
    `os:${visit.os}`,
    `browser:${visit.browser}`,
  ];
}

export async function recordVisit(visit: Classification) {
  const mode = storageMode();
  if (mode === "none") return;

  const keys = fields(visit);

  if (mode === "kv") {
    // One batched round trip: the lifetime counters plus today's bucket.
    const day = dayKey();
    await kvPipeline([
      ...keys.map((key) => ["INCR", `stats:${key}`]),
      ...keys.map((key) => ["HINCRBY", day, key, 1]),
    ]);
    return;
  }

  const counts = await readFileCounts();
  for (const key of keys) {
    counts[key] = (counts[key] ?? 0) + 1;
    const bucket = `${dayKey()}:${key}`;
    counts[bucket] = (counts[bucket] ?? 0) + 1;
  }
  await writeFileCounts(counts);
}

async function readKvDay(day: string) {
  const [result] = await kvPipeline([["HGETALL", day]]);
  const flat = (result?.result ?? []) as string[];
  const counts: Record<string, number> = {};
  for (let index = 0; index < flat.length; index += 2) {
    const value = Number(flat[index + 1]);
    if (Number.isFinite(value)) counts[flat[index]] = value;
  }
  return counts;
}

export async function readStats(range: StatsRange): Promise<StatsSnapshot> {
  const mode = storageMode();
  const counts: Record<string, number> = {};

  if (mode === "kv") {
    if (range === "all") {
      const keys = [
        "total",
        ...(Object.keys(STAT_GROUPS) as StatsGroup[]).flatMap((group) =>
          STAT_GROUPS[group].map((value) => `${group}:${value}`),
        ),
      ];
      const results = await kvPipeline(
        keys.map((key) => ["GET", `stats:${key}`]),
      );
      keys.forEach((key, index) => {
        const value = Number(results[index]?.result ?? 0);
        counts[key] = Number.isFinite(value) ? value : 0;
      });
    } else {
      const days = await Promise.all(
        dayList(RANGE_DAYS[range]).map((day) => readKvDay(day)),
      );
      for (const day of days) {
        for (const [key, value] of Object.entries(day)) {
          counts[key] = (counts[key] ?? 0) + value;
        }
      }
    }
  } else if (mode === "file") {
    const all = await readFileCounts();
    if (range === "all") {
      Object.assign(counts, all);
    } else {
      for (const day of dayList(RANGE_DAYS[range])) {
        const prefix = `${day}:`;
        for (const [key, value] of Object.entries(all)) {
          if (key.startsWith(prefix)) {
            const field = key.slice(prefix.length);
            counts[field] = (counts[field] ?? 0) + value;
          }
        }
      }
    }
  }

  return {
    storage: mode,
    total: counts.total ?? 0,
    groups: (Object.keys(STAT_GROUPS) as StatsGroup[]).map((group) => ({
      id: group,
      rows: STAT_GROUPS[group].map((value) => ({
        id: value,
        count: counts[`${group}:${value}`] ?? 0,
      })),
    })),
  };
}
