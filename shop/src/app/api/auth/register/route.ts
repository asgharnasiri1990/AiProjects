import { NextRequest, NextResponse } from "next/server";
import { ApiError, login, register } from "@/lib/api";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";
import { validatePassword, validateUsername } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const usernameError = validateUsername(username);
  if (usernameError) {
    return NextResponse.json({ error: usernameError }, { status: 400 });
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  try {
    const user = await register(username, password);

    // The API does not return a token on signup, so sign the new user in
    // immediately to avoid a redundant redirect to /login.
    try {
      const result = await login(username, password);
      const res = NextResponse.json({ user: result.user });
      res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions);
      return res;
    } catch {
      return NextResponse.json(
        { user, warning: "Account created, but automatic sign-in failed. Please log in." },
        { status: 200 },
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Sign up failed. Please try again." }, { status: 500 });
  }
}
