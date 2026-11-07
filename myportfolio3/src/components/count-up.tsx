"use client";

import { useEffect, useRef } from "react";

/**
 * Counts from zero to the number inside `value` the first time it scrolls into
 * view. The server HTML already contains the final value, so no-JS and
 * reduced-motion users see the correct number; the DOM is only changed after
 * hydration.
 */
export function CountUp({
  value,
  duration = 1400,
}: {
  value: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^(\D*)(\d+)(\D*)$/);
    if (!match) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    const pad = digits.length;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = value;
      return;
    }

    let frame = 0;
    let guard = 0;
    let startedAt = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const tick = (time: number) => {
          if (!startedAt) startedAt = time;
          const progress = Math.min(1, (time - startedAt) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          el.textContent = `${prefix}${String(current).padStart(pad, "0")}${suffix}`;
          if (progress < 1) frame = requestAnimationFrame(tick);
          else el.textContent = value;
        };

        frame = requestAnimationFrame(tick);
        // Some environments throttle rAF (background tabs, headless). Make sure
        // the number always lands on its final value.
        guard = window.setTimeout(() => {
          el.textContent = value;
        }, duration + 400);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(guard);
    };
  }, [value, duration]);

  return <span ref={ref}>{value}</span>;
}
