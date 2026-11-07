"use client";

import { useState } from "react";
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
      } catch {
        copiedOk = false;
      }
    }

    if (!copiedOk) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`inline-flex h-10 items-center rounded-full border border-band-ink/25 px-4 font-mono text-[12px] transition-colors hover:border-band-ink hover:bg-band-ink hover:text-band sm:h-9 sm:text-[10px] ${labelStyle(locale)} ${focusRing}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
