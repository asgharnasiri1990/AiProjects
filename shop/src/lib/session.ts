import { cookies } from "next/headers";
import { me } from "./api";
import type { User } from "./types";
import { SESSION_COOKIE } from "./session-cookie";

export { SESSION_COOKIE };

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Cookie options shared by the auth route handlers. */
export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

/** Read the raw bearer token from the request cookies (server only). */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/**
 * Resolve the signed-in user (server only).
 * Returns null when there is no cookie or the token is no longer valid;
 * never throws.
 */
export async function getSessionUser(): Promise<User | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await me(token);
  } catch {
    return null;
  }
}
