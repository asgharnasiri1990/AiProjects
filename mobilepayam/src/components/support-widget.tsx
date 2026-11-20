"use client";

import { useEffect, useRef, useState } from "react";
import { uid } from "@/lib/format";

type Message = {
  id: string;
  from: "user" | "agent";
  text: string;
  time: string;
};

const greeting: Message = {
  id: "welcome",
  from: "agent",
  text: "سلام 👋 به پشتیبانی mobilepayam خوش آمدید. دربارهٔ قیمت، موجودی، ارسال یا گارانتی بپرسید.",
  time: "",
};

function autoReply(text: string): string {
  if (/قیمت|تخفیف|چند/.test(text))
    return "قیمتها روی صفحهٔ هر محصول بهروز است. اگر محصولی را مدنظر دارید بگویید تا موجودی و قیمت دقیقش را چک کنیم.";
  if (/ارسال|پست|تیپاکس|پیک/.test(text))
    return "ارسال تهران با پیک همان روز (سفارش تا ساعت ۱۴) و شهرستان با تیپاکس ۲ تا ۴ روز کاری است. بالای ۵ میلیون تومان ارسال رایگان است.";
  if (/گارانتی|ضمانت|اصالت/.test(text))
    return "همهٔ کالاها با گارانتی رسمی و کد رهگیری عرضه میشوند؛ مدت گارانتی در صفحهٔ هر محصول نوشته شده است.";
  if (/کارکرده|دست‌دوم/.test(text))
    return "گوشی‌های کارکرده در بخش «کارکرده» با سلامت باتری و وضعیت بدنهٔ مشخص قرار گرفته‌اند؛ بازگشت ۷ روزه هم دارند.";
  return "پیام شما ثبت شد ✅ کارشناس ما در ساعات کاری (۱۰ تا ۲۰) پاسخ می‌دهد. برای پاسخ فوری با ۰۴۵-۳۳۲۴۵۷۳۶ تماس بگیرید.";
}

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing, open]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const now = () =>
    new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });

  const send = () => {
    const text = draft.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { id: uid(), from: "user", text, time: now() },
    ]);
    setDraft("");
    setTyping(true);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setTyping(false);
      setMessages((current) => [
        ...current,
        {
          id: uid(),
          from: "agent",
          text: autoReply(text),
          time: now(),
        },
      ]);
    }, 1100);
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2">
      {open ? (
        <div className="flex h-[420px] w-[min(330px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-[0_24px_48px_-24px_rgba(16,42,84,0.45)]">
          <div className="flex items-start justify-between gap-2 bg-brand px-4 py-3 text-white">
            <div>
              <b className="block text-sm font-extrabold">پشتیبانی آنلاین</b>
              <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-white/80">
                <i className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                آنلاین — پاسخ در چند دقیقه
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

          <div
            ref={listRef}
            className="flex-1 space-y-2 overflow-y-auto bg-canvas/60 p-3"
            aria-live="polite"
          >
            {messages.map((message) =>
              message.from === "agent" ? (
                <div key={message.id} className="flex flex-col items-start">
                  <div className="max-w-[85%] rounded-xl rounded-tr-sm border border-line bg-surface px-3 py-2 text-[11.5px] leading-6 text-ink-strong">
                    {message.text}
                  </div>
                  {message.time ? (
                    <span className="mt-0.5 px-1 text-[9px] text-muted">{message.time}</span>
                  ) : null}
                </div>
              ) : (
                <div key={message.id} className="flex flex-col items-end">
                  <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-brand px-3 py-2 text-[11.5px] leading-6 text-white">
                    {message.text}
                  </div>
                  <span className="mt-0.5 px-1 text-[9px] text-muted">{message.time}</span>
                </div>
              ),
            )}

            {typing ? (
              <div className="flex items-center gap-1 rounded-xl rounded-tr-sm border border-line bg-surface px-3 py-2 text-muted">
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
                <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-line bg-surface p-2"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="پیام خود را بنویسید…"
              aria-label="متن پیام"
              className="h-9 flex-1 rounded-full border border-line-strong bg-surface px-3 text-[11.5px] text-ink-strong outline-none focus:border-brand"
            />
            <button
              type="submit"
              aria-label="ارسال پیام"
              className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 rotate-180"
                aria-hidden="true"
              >
                <path d="m4 12 16-7-7 16-2.5-6.5z" />
              </svg>
            </button>
          </form>

          <div className="flex items-center justify-between gap-2 border-t border-line bg-surface px-3 py-1.5 text-[10px] text-muted">
            <a href="tel:+984533245736" className="hover:text-brand">
              ☎ ۰۴۵-۳۳۲۴۵۷۳۶
            </a>
            <a href="mailto:hello@mobilepayam.ir" className="hover:text-brand">
              ✉ ایمیل
            </a>
            <span className="text-[9px]">پاسخ‌ها نمایشی است</span>
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
