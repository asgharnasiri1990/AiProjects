import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n";
import { STATS_COOKIE } from "@/lib/stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_AGE = 60 * 60 * 24 * 30;

/**
 * One-time sign-in link: /en/stats/unlock?token=... plants an http-only cookie
 * and redirects to the clean /en/stats URL. Because this is a route handler and
 * not a page, the token never reaches the analytics script or the address bar.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;
  if (!isLocale(locale)) {
    return new NextResponse(null, { status: 404 });
  }

  const url = new URL(request.url);
  const expected = process.env.STATS_TOKEN;
  const token = url.searchParams.get("token");

  if (!expected || !token || token !== expected) {
    return new NextResponse(null, { status: 404 });
  }

  const response = NextResponse.redirect(
    new URL(`/${locale}/stats`, url.origin),
  );
  response.cookies.set(STATS_COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return response;
}
