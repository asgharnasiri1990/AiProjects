import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Vazirmatn } from "next/font/google";
import "./globals.css";

// This page bypasses the locale layout, so it needs its own document.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const vazirmatn = Vazirmatn({ variable: "--font-vazir", subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "404 — صفحه پیدا نشد",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${inter.variable} ${vazirmatn.variable}`}
    >
      <body className="flex min-h-dvh items-center justify-center bg-canvas font-sans text-ink antialiased">
        <div className="w-full max-w-xl px-6 py-16">
          <p className="text-sm font-medium text-accent">404</p>
          <h1 className="mt-3 text-2xl font-semibold">این صفحه پیدا نشد</h1>
          <p className="mt-2 text-sm leading-7 text-ink-soft">
            ممکن است نشانی تغییر کرده باشد یا صفحه حذف شده باشد.
          </p>
          <Link
            href="/fa"
            className="mt-6 inline-flex h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-canvas transition-colors hover:bg-accent"
          >
            بازگشت به خانه
          </Link>

          <div
            dir="ltr"
            lang="en"
            className="mt-10 border-t border-line pt-6 text-start"
          >
            <h2 className="text-base font-medium">
              This page could not be found
            </h2>
            <p className="mt-1 text-sm leading-7 text-ink-soft">
              The address may have changed, or the page may have been removed.
            </p>
            <Link
              href="/en"
              className="mt-3 inline-block text-sm text-accent underline underline-offset-4"
            >
              Back to the English site
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
