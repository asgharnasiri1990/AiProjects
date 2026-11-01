import { NextRequest, NextResponse } from "next/server";
import { ApiError, login } from "@/lib/api";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  try {
    const result = await login(username, password);

    // The bearer token never touches client-side JS: it lives in an
    // httpOnly cookie and is attached by the /api/* proxy routes.
    const res = NextResponse.json({ user: result.user });
    res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions);
    return res;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
