"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { focusRing, labelStyle } from "@/lib/styles";

export function CopyEmail({
  email,
  label,
  copiedLabel,
  locale,
}: {
  email: string;
  label: string;
  copiedLabel: string;
  locale: Locale;
}) {
  const [copied, setCopied] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    let copiedOk = false;

    try {
      await navigator.clipboard.writeText(email);
      copiedOk = true;
    } catch {
      // Fallback for browsers/contexts that block the async clipboard API.
      try {
        const area = document.createElement("textarea");
        area.value = email;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        copiedOk = document.execCommand("copy");
        document.body.removeChild(area);
        button.current?.focus();
      } catch {
        copiedOk = false;
      }
    }

    if (!copiedOk) return;
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      ref={button}
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`inline-flex h-10 items-center rounded-full border border-band-ink/25 px-4 font-mono text-[12px] transition-colors hover:border-signal hover:bg-signal hover:text-signal-ink sm:h-9 sm:text-[10px] ${labelStyle(locale)} ${focusRing}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
