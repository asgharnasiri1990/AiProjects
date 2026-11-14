import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginView } from "./login-view";

export const metadata: Metadata = { title: "ورود / ثبت‌نام" };

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-[1180px] px-4 py-16 text-sm text-muted">
          در حال بارگذاری…
        </main>
      }
    >
      <LoginView />
    </Suspense>
  );
}
