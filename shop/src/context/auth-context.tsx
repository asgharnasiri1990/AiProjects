"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  /** Sign in via the /api/auth/login route handler (sets the httpOnly cookie). */
  login: (username: string, password: string) => Promise<User>;
  /** Register + auto sign-in via /api/auth/register. */
  signup: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function postJson(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function AuthProvider({
  initialUser,
  children,
}: {
  /** User resolved on the server from the session cookie (SSR, no flicker). */
  initialUser: User | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(initialUser);

  const login = useCallback(async (username: string, password: string) => {
    const res = await postJson("/api/auth/login", { username, password });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error ?? "Login failed. Please try again.");
    }
    setUser(data.user);
    return data.user as User;
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    const res = await postJson("/api/auth/register", { username, password });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error ?? "Sign up failed. Please try again.");
    }
    setUser(data.user);
    return data.user as User;
  }, []);

  const logout = useCallback(async () => {
    try {
      await postJson("/api/auth/logout", {});
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, login, signup, logout }),
    [user, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
