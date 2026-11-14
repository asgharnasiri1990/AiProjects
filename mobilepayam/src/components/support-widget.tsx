"use client";

import { useState } from "react";

/* Floating support widget (a "chat widget" in store jargon).
   No backend for v1: it opens the real phone/email actions instead of
   pretending to send a message. */
export function SupportWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2">
      {open ? (
        <div className="w-[min(320px,calc(100vw-32px))] overflow-hidden rounded-xl border border-line bg-surface shadow-[0_24px_48px_-24px_rgba(16,42,84,0.45)]">
          <div className="flex items-start justify-between gap-2 bg-brand px-4 py-3 text-white">
            <div>
              <b className="block text-sm font-extrabold">پشتیبانی آنلاین</b>
              <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-white/80">
                <i className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                آمادهٔ پاسخگویی
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="بستن پشتیبانی"
              className="grid h-7 w-7 place-items-center rounded-md text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid gap-2 p-3">
            <a
              href="tel:+984533245736"
              className="flex items-center gap-2 rounded-lg border border-line px-3 py-2.5 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-brand">
                ☎
              </span>
              <span>
                تماس تلفنی
                <span dir="ltr" className="mr-2 text-[11px] font-normal text-muted">
                  ۰۴۵-۳۳۲۴۵۷۳۶
                </span>
              </span>
            </a>

            <a
              href="mailto:hello@mobilepayam.ir"
              className="flex items-center gap-2 rounded-lg border border-line px-3 py-2.5 text-xs font-bold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-brand">
                ✉
              </span>
              ارسال ایمیل
            </a>

            <p className="px-1 pt-1 text-[10.5px] leading-5 text-muted">
              شنبه تا پنجشنبه، ۱۰ تا ۲۰ — خارج از این ساعات، پیام خود را ایمیل
              کنید.
            </p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="پشتیبانی آنلاین"
        className="relative flex h-12 items-center gap-2 rounded-full bg-brand px-4 text-white shadow-[0_16px_32px_-16px_rgba(16,42,84,0.8)] transition-colors hover:bg-brand-dark"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M4 5.5h16v11H9l-5 4z" />
          <path d="M8.5 10h7M8.5 13h4" />
        </svg>
        <span className="text-xs font-extrabold">پشتیبانی آنلاین</span>
        <span className="absolute -top-0.5 right-1 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
      </button>
    </div>
  );
}
