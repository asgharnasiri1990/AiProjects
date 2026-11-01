import { NextRequest, NextResponse } from "next/server";
import { ApiError, apiFetch } from "./api";
import { SESSION_COOKIE } from "./session";

interface ProxyOptions {
  /** Forward the JSON request body to the API. */
  body?: boolean;
}

/**
 * Forward an authenticated request from a Next.js route handler to the
 * practice API, attaching the bearer token from the httpOnly session cookie.
 *
 * - 401 without/with an invalid cookie -> 401 + clears the cookie so the
 *   client resyncs to the logged-out state.
 * - API errors are passed through with their status and message.
 */
export async function proxyToApi(
  req: NextRequest,
  path: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  options: ProxyOptions = {},
): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "You are not signed in." }, { status: 401 });
  }

  let body: unknown;
  if (options.body && method !== "GET" && method !== "DELETE") {
    body = await req.json().catch(() => undefined);
  }

  try {
    const data = await apiFetch<unknown>(path, { method, body, token });
    return NextResponse.json(data ?? { ok: true });
  } catch (err) {
    if (err instanceof ApiError) {
      const res = NextResponse.json({ error: err.message }, { status: err.status });
      if (err.status === 401) {
        // Stale/invalid token: drop the session cookie.
        res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
      }
      return res;
    }
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 },
    );
  }
}
