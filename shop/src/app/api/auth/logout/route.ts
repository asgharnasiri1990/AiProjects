import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/api";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    // Invalidate the token server-side; ignore failures (expired token, etc.).
    await logout(token).catch(() => undefined);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
