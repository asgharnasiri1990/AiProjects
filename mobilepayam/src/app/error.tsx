"use client";

import Link from "next/link";
import { btnGhost, btnPrimary, container } from "@/lib/ui";

/**
 * Last line of defence: a corrupt localStorage value that slips past the store
 * guards should show a recoverable page instead of Next's generic error screen.
 */
export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const clearLocalData = () => {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith("mobilepayam.")) {
        window.localStorage.removeItem(key);
      }
    }
    window.location.reload();
  };

  return (
    <main className={`${container} py-20 text-center`}>
      <p className="font-mono text-[11px] text-brand">خطا</p>
      <h1 className="mt-2 text-xl font-extrabold text-ink-strong">
        مشکلی در نمایش این صفحه پیش آمد
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
        داده‌های ذخیره‌شده در این مرورگر قابل خواندن نبود. یک‌بار دیگر تلاش کنید؛
        اگر مشکل ماند، داده‌های محلی این فروشگاه را بازنشانی کنید.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={reset} className={btnPrimary}>
          تلاش دوباره
        </button>
        <button type="button" onClick={clearLocalData} className={btnGhost}>
          بازنشانی داده‌های محلی
        </button>
        <Link href="/" className={btnGhost}>
          بازگشت به فروشگاه
        </Link>
      </div>
    </main>
  );
}
