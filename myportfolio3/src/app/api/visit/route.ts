import { classifyUserAgent, recordVisit } from "@/lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Counts one visit by device/OS/browser. Only aggregate categories are stored:
 * no IP address, no raw user-agent string, no cookies.
 */
export async function POST(request: Request) {
  const classification = classifyUserAgent(
    request.headers.get("user-agent") ?? "",
  );

  if (classification) {
    try {
      await recordVisit(classification);
    } catch {
      // Analytics must never break a page view.
    }
  }

  return new Response(null, { status: 204 });
}
