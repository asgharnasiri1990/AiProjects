"use client";

import { useState } from "react";
import { focusRing } from "@/lib/styles";
import { MoonIcon, SunIcon } from "@/components/icons";

/**
 * The icon is chosen by CSS from `html[data-theme]`, so the button renders
 * identically on the server and after hydration. The state mirrors the prop
 * only so the accessible pressed state stays in sync with the cookie.
 */
export function ThemeToggle({
  label,
  theme,
}: {
  label: string;
  theme: "paper" | "ink";
}) {
  const [current, setCurrent] = useState(theme);

  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "ink" ? "paper" : "ink";
    root.dataset.theme = next;
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
    setCurrent(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={current === "ink"}
      className={`grid h-10 w-10 place-items-center rounded-full border border-line text-soft transition-colors hover:border-ink hover:text-ink sm:h-9 sm:w-9 ${focusRing}`}
    >
      <SunIcon width={16} height={16} className="theme-sun" />
      <MoonIcon width={16} height={16} className="theme-moon" />
    </button>
  );
}
