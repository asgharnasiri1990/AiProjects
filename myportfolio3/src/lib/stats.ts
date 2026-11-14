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

/** How many individual visits the log keeps. */
const VISIT_LOG_SIZE = 100;

export interface ClientHints {
  mobile?: boolean;
  model?: string;
  platform?: string;
  platformVersion?: string;
  brands?: { brand: string; version: string }[];
}

export interface Classification {
  device: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  model: string;
}

export interface VisitRecord {
  /** Server clock, ISO 8601. */
  at: string;
  device: string;
  model: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  /** ISO-3166 alpha-2, resolved from the edge header — the IP itself is never stored. */
  country: string;
}

export interface StatsSnapshot {
  storage: StorageMode;
  total: number;
  groups: {
    id: StatsGroup;
    rows: { id: string; count: number }[];
  }[];
  countries: { code: string; count: number }[];
  visits: VisitRecord[];
}

const FILE = path.join(process.cwd(), ".data", "stats.json");
const VISITS_FILE = path.join(process.cwd(), ".data", "visits.json");
const KV_VISITS = "stats:visits";

const CHROMIUM_BRANDS = ["chromium"];

/** Chrome sends greased brands like "Not A(Brand"; they carry fake versions. */
function isGreaseBrand(brand: string) {
  return /not.?a.?brand/.test(brand.toLowerCase());
}

function majorVersion(value: string | undefined) {
  if (!value) return "";
  return value.split(".")[0] ?? "";
}

/**
 * Turns the user-agent string plus optional Chrome device hints into the few
 * categories the stats page shows. Returns null for bots and empty agents.
 */
export function classifyUserAgent(
  ua: string,
  hints: ClientHints = {},
): Classification | null {
  if (!ua) return null;
  if (/bot|crawler|spider|slurp|bingpreview|headless|facebookexternalhit/i.test(ua)) {
    return null;
  }

  const hintedPlatform = hints.platform?.toLowerCase() ?? "";

  const os = hintedPlatform.includes("android")
    ? "android"
    : hintedPlatform === "ios"
      ? "ios"
      : hintedPlatform === "windows"
        ? "windows"
        : hintedPlatform === "macos"
          ? "macos"
          : hintedPlatform === "linux"
            ? "linux"
            : /iphone|ipad|ipod/i.test(ua)
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

  const mobileHint = hints.mobile;
  const device =
    typeof mobileHint === "boolean"
      ? /ipad|tablet/i.test(ua) || /ipad/i.test(hints.model ?? "")
        ? "tablet"
        : mobileHint
          ? "mobile"
          : "desktop"
      : /ipad|tablet|playbook|silk/i.test(ua)
        ? "tablet"
        : /mobi|iphone|ipod|android.*mobile|windows phone/i.test(ua)
          ? "mobile"
          : /windows|macintosh|mac os x|linux|cros/i.test(ua)
            ? "desktop"
            : "other";

  const brand = hints.brands?.find(
    (item) =>
      !CHROMIUM_BRANDS.includes(item.brand.toLowerCase()) &&
      !isGreaseBrand(item.brand),
  );

  const browser = brand
    ? /edge/i.test(brand.brand)
      ? "edge"
      : /samsung/i.test(brand.brand)
        ? "samsung"
        : /opera|opr/i.test(brand.brand)
          ? "other"
          : "chrome"
    : /edg\//i.test(ua)
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

  const uaBrowserVersion =
    browser === "edge"
      ? ua.match(/edg\/([\d.]+)/i)?.[1]
      : browser === "samsung"
        ? ua.match(/samsungbrowser\/([\d.]+)/i)?.[1]
        : browser === "firefox"
          ? ua.match(/(?:firefox|fxios)\/([\d.]+)/i)?.[1]
          : browser === "chrome"
            ? ua.match(/(?:chrome|crios)\/([\d.]+)/i)?.[1]
            : browser === "safari"
              ? ua.match(/version\/([\d.]+)/i)?.[1]
              : undefined;

  const model = (hints.model || ua.match(/Android[^;]*;\s*([^;)]+?)(?:\s+Build[/ ]|\))/i)?.[1] || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);

  const osVersion =
    hints.platformVersion?.replace(/_/g, ".").slice(0, 12) ||
    (os === "android" ? ua.match(/Android\s+([\d.]+)/i)?.[1] : undefined) ||
    (os === "ios" ? ua.match(/OS\s+([\d_]+)/i)?.[1]?.replace(/_/g, ".") : undefined) ||
    "";

  return {
    device,
    os,
    osVersion: osVersion ?? "",
    browser,
    browserVersion: majorVersion(brand?.version) || majorVersion(uaBrowserVersion),
    model: os === "ios" && !model ? (ua.match(/iPhone|iPad|iPod/i)?.[0] ?? "") : model,
  };
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

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
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

function toRecord(
  visit: Classification,
  at: Date,
  country: string,
): VisitRecord {
  return {
    at: at.toISOString(),
    device: visit.device,
    model: visit.model,
    os: visit.os,
    osVersion: visit.osVersion,
    browser: visit.browser,
    browserVersion: visit.browserVersion,
    country,
  };
}

/** Country lives in its own hash because the list of codes is open-ended. */
const KV_COUNTRIES = "stats:countries";

export async function recordVisit(
  visit: Classification,
  country = "",
  at = new Date(),
) {
  const mode = storageMode();
  if (mode === "none") return;

  const keys = fields(visit);
  const code = country.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
  const record = toRecord(visit, at, code);

  if (mode === "kv") {
    // One batched round trip: lifetime counters, today's bucket and the log.
    const day = dayKey(at);
    const commands: (string | number)[][] = [
      ...keys.map((key) => ["INCR", `stats:${key}`]),
      ...keys.map((key) => ["HINCRBY", day, key, 1]),
      ["LPUSH", KV_VISITS, JSON.stringify(record)],
      ["LTRIM", KV_VISITS, 0, VISIT_LOG_SIZE - 1],
    ];
    if (code) {
      commands.push(["HINCRBY", KV_COUNTRIES, code, 1]);
      commands.push(["HINCRBY", day, `country:${code}`, 1]);
    }
    await kvPipeline(commands);
    return;
  }

  const counts = await readJson<Record<string, number>>(FILE, {});
  const all = code ? [...keys, `country:${code}`] : keys;
  for (const key of all) {
    counts[key] = (counts[key] ?? 0) + 1;
    const bucket = `${dayKey(at)}:${key}`;
    counts[bucket] = (counts[bucket] ?? 0) + 1;
  }
  await writeJson(FILE, counts);

  const visits = await readJson<VisitRecord[]>(VISITS_FILE, []);
  await writeJson(
    VISITS_FILE,
    [record, ...visits].slice(0, VISIT_LOG_SIZE),
  );
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
  let visits: VisitRecord[] = [];

  if (mode === "kv") {
    if (range === "all") {
      const keys = [
        "total",
        ...(Object.keys(STAT_GROUPS) as StatsGroup[]).flatMap((group) =>
          STAT_GROUPS[group].map((value) => `${group}:${value}`),
        ),
      ];
      const results = await kvPipeline([
        ...keys.map((key) => ["GET", `stats:${key}`]),
        ["HGETALL", KV_COUNTRIES],
        ["LRANGE", KV_VISITS, 0, VISIT_LOG_SIZE - 1],
      ]);
      keys.forEach((key, index) => {
        const value = Number(results[index]?.result ?? 0);
        counts[key] = Number.isFinite(value) ? value : 0;
      });
      const flat = (results[keys.length]?.result ?? []) as string[];
      for (let index = 0; index < flat.length; index += 2) {
        const value = Number(flat[index + 1]);
        if (flat[index] && Number.isFinite(value)) {
          counts[`country:${flat[index]}`] = value;
        }
      }
      visits = parseVisits(results[keys.length + 1]?.result);
    } else {
      const days = await Promise.all(
        dayList(RANGE_DAYS[range]).map((day) => readKvDay(day)),
      );
      for (const day of days) {
        for (const [key, value] of Object.entries(day)) {
          counts[key] = (counts[key] ?? 0) + value;
        }
      }
      const [log] = await kvPipeline([
        ["LRANGE", KV_VISITS, 0, VISIT_LOG_SIZE - 1],
      ]);
      visits = parseVisits(log?.result);
    }
  } else if (mode === "file") {
    const all = await readJson<Record<string, number>>(FILE, {});
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
    visits = await readJson<VisitRecord[]>(VISITS_FILE, []);
  }

  const countries = Object.entries(counts)
    .filter(([key, value]) => key.startsWith("country:") && value > 0)
    .map(([key, count]) => ({ code: key.slice("country:".length), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

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
    countries,
    visits,
  };
}

function parseVisits(raw: unknown): VisitRecord[] {
  const items = Array.isArray(raw) ? raw : [];
  const out: VisitRecord[] = [];
  for (const item of items) {
    try {
      const parsed = JSON.parse(String(item)) as VisitRecord;
      if (parsed?.at) out.push(parsed);
    } catch {
      // Skip malformed entries instead of failing the whole page.
    }
  }
  return out;
}
