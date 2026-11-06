import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/archivo/standard.css";
import "@fontsource-variable/vazirmatn";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 — Page not found",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className="antialiased">
      <body className="flex min-h-dvh items-center justify-center bg-paper font-sans text-ink">
        <div className="w-full max-w-xl px-6 py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft">
            404
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold uppercase tracking-[-0.03em]">
            Page not found
          </h1>
          <p className="mt-3 text-sm leading-7 text-soft">
            The address may have changed, or the page may have been removed.
          </p>
          <Link
            href="/en"
            className="mt-6 inline-flex h-10 items-center rounded-full bg-ink px-5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper"
          >
            Back to home
          </Link>

          <div dir="rtl" lang="fa" className="mt-10 border-t border-line pt-6">
            <h2 className="text-lg font-semibold">این صفحه پیدا نشد</h2>
            <p className="mt-2 text-sm leading-7 text-soft">
              ممکن است نشانی تغییر کرده باشد یا صفحه حذف شده باشد.
            </p>
            <Link
              href="/fa"
              className="mt-4 inline-block text-sm underline underline-offset-4"
            >
              بازگشت به خانه
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
