"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import {
  PASSWORD_RULES,
  USERNAME_RULES,
  safeRedirectPath,
  validateConfirmPassword,
  validatePassword,
  validateUsername,
} from "@/lib/validation";

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string | null;
    password?: string | null;
    confirmPassword?: string | null;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTarget = safeRedirectPath(searchParams.get("next"));

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const errors = {
      username: validateUsername(username),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };
    setFieldErrors(errors);
    if (errors.username || errors.password || errors.confirmPassword) return;

    setSubmitting(true);
    try {
      await signup(username.trim(), password);
      router.push(redirectTarget);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Sign up failed. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
        Sign up to place orders and keep your cart in sync.
      </p>

      {formError && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
        >
          {formError}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <Input
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="sara_1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={fieldErrors.username}
          hint={USERNAME_RULES}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          hint={PASSWORD_RULES}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          {submitting ? "Creating account…" : "Sign up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href={searchParams.get("next") ? `/login?next=${encodeURIComponent(redirectTarget)}` : "/login"}
          className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
