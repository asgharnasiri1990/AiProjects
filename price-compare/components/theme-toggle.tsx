"use client";

import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;

    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode can block storage; the theme still applies for this view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="تغییر تم روشن و تیره"
      title="تغییر تم"
      className="grid size-9 cursor-pointer place-items-center rounded-xl border border-line bg-surface text-muted transition hover:text-ink"
    >
      <SunIcon className="theme-sun size-4" />
      <MoonIcon className="theme-moon size-4" />
    </button>
  );
}
