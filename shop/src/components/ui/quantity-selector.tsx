"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  disabled?: boolean;
  /** Accessible label, e.g. the product name. */
  label: string;
  size?: "sm" | "md";
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  label,
  size = "md",
}: QuantitySelectorProps) {
  const dimensions = size === "sm" ? "h-8 w-8 text-sm" : "h-10 w-10";
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  return (
    <div
      className="inline-flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700"
      role="group"
      aria-label={`Quantity for ${label}`}
    >
      <button
        type="button"
        onClick={() => canDecrease && onChange(value - 1)}
        disabled={!canDecrease}
        aria-label={`Decrease quantity of ${label}`}
        className={`flex ${dimensions} items-center justify-center rounded-l-lg text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800`}
      >
        <MinusIcon width={16} height={16} />
      </button>
      <span
        aria-live="polite"
        className={`flex ${size === "sm" ? "h-8 min-w-8" : "h-10 min-w-10"} items-center justify-center px-1 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => canIncrease && onChange(value + 1)}
        disabled={!canIncrease}
        aria-label={`Increase quantity of ${label}`}
        className={`flex ${dimensions} items-center justify-center rounded-r-lg text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800`}
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
