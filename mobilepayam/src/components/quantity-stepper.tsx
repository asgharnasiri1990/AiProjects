"use client";

import { MAX_ITEM_QUANTITY } from "@/lib/format";

export function QuantityStepper({
  qty,
  max,
  onChange,
  size = "md",
}: {
  qty: number;
  max: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  const cap = Math.min(MAX_ITEM_QUANTITY, max);
  const box = size === "sm" ? "h-9" : "h-11";
  const button = size === "sm" ? "h-7 w-7" : "h-9 w-9";

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-lg border border-line-strong bg-surface px-1 ${box}`}
    >
      <button
        type="button"
        aria-label="کم کردن تعداد"
        className={`grid place-items-center rounded-md text-lg text-ink transition-colors hover:bg-brand-soft hover:text-brand ${button}`}
        onClick={() => onChange(Math.max(0, qty - 1))}
      >
        −
      </button>
      <span className="min-w-7 text-center text-xs font-bold text-ink-strong">
        {qty.toLocaleString("fa-IR")}
      </span>
      <button
        type="button"
        aria-label="زیاد کردن تعداد"
        disabled={qty >= cap}
        className={`grid place-items-center rounded-md text-lg text-ink transition-colors hover:bg-brand-soft hover:text-brand disabled:opacity-30 ${button}`}
        onClick={() => onChange(Math.min(cap, qty + 1))}
      >
        +
      </button>
    </div>
  );
}
