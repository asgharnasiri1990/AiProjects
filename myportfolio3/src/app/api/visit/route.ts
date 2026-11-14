import {
  classifyUserAgent,
  recordVisit,
  type ClientHints,
} from "@/lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 2048;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : undefined;
}

/** Only the handful of device hints we actually read ever leave the browser. */
function sanitize(raw: unknown): ClientHints {
  if (!raw || typeof raw !== "object") return {};
  const input = raw as Record<string, unknown>;
  const hints: ClientHints = {};

  if (typeof input.mobile === "boolean") hints.mobile = input.mobile;
  const model = text(input.model, 40);
  if (model) hints.model = model;
  const platform = text(input.platform, 24);
  if (platform) hints.platform = platform;
  const platformVersion = text(input.platformVersion, 16);
  if (platformVersion) hints.platformVersion = platformVersion;
  if (Array.isArray(input.brands)) {
    hints.brands = input.brands
      .slice(0, 6)
      .map((item) => {
        const brand = item as { brand?: unknown; version?: unknown };
        return {
          brand: text(brand.brand, 32) ?? "",
          version: text(brand.version, 24) ?? "",
        };
      })
      .filter((item) => item.brand);
  }

  return hints;
}

/**
 * Counts one visit. Only aggregate categories plus a short, anonymous visit log
 * are stored: no IP address, no raw user-agent string, no cookies and no id that
 * could tie two visits to the same person.
 */
export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  let hints: ClientHints = {};

  try {
    const body = await request.text();
    if (body && body.length <= MAX_BODY) {
      hints = sanitize(JSON.parse(body));
    }
  } catch {
    // An empty or malformed body is fine: the user-agent alone is enough.
  }

  const classification = classifyUserAgent(ua, hints);

  if (classification) {
    try {
      await recordVisit(classification);
    } catch {
      // Analytics must never break a page view.
    }
  }

  return new Response(null, { status: 204 });
}
