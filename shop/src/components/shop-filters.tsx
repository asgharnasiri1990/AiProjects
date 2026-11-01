"use client";

import { useCallback, useEffect, useMemo, useState, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterIcon, XIcon } from "@/components/icons";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
] as const;

/**
 * Sort / stock / price controls. Search lives in the site header and the
 * category pills in `CategoryNav`, but the "Clear all" action still resets
 * every parameter, including those two.
 */
export function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = useMemo(
    () => ({
      min: searchParams.get("min") ?? "",
      max: searchParams.get("max") ?? "",
      sort: searchParams.get("sort") ?? "newest",
      stock: searchParams.get("stock") === "true",
    }),
    [searchParams],
  );

  const [minInput, setMinInput] = useState(current.min);
  const [maxInput, setMaxInput] = useState(current.max);

  // Keep typing state in sync when the URL changes externally (e.g. "Clear all").
  useEffect(() => setMinInput(current.min), [current.min]);
  useEffect(() => setMaxInput(current.max), [current.max]);

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      }
      params.delete("page"); // any filter change resets pagination
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
      });
    },
    [router, searchParams],
  );

  // Debounce the price range.
  useEffect(() => {
    if (minInput === current.min && maxInput === current.max) return;
    const timer = setTimeout(() => {
      update({
        min: minInput.trim() || null,
        max: maxInput.trim() || null,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [minInput, maxInput, current.min, current.max, update]);

  const hasActiveFilters =
    Boolean(
      searchParams.get("q") ||
        searchParams.get("category") ||
        current.min ||
        current.max ||
        current.stock,
    ) || current.sort !== "newest";

  const priceInputClasses =
    "rounded-xl border border-primary-200 bg-white px-3 py-2 text-sm tabular-nums text-zinc-900 placeholder:text-zinc-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500";

  return (
    <section
      aria-label="Product filters"
      className="rounded-3xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-zinc-900 sm:p-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="sr-only sm:not-sr-only">Sort by</span>
            <select
              value={current.sort}
              onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })}
              className="h-10 rounded-full border border-primary-200 bg-white px-4 text-sm font-medium text-zinc-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/15 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={current.stock}
              onChange={(e) => update({ stock: e.target.checked ? "true" : null })}
              className="h-4 w-4 rounded border-zinc-300 accent-primary-600 focus:ring-primary-500"
            />
            In stock only
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => startTransition(() => router.replace("/shop", { scroll: false }))}
              className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-accent-600 transition-colors hover:bg-accent-50 dark:text-accent-500 dark:hover:bg-accent-500/10"
            >
              <XIcon width={15} height={15} />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-primary-100 pt-3 lg:border-0 lg:pt-0 dark:border-zinc-800">
          <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <FilterIcon width={15} height={15} />
            Price
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            aria-label="Minimum price in Toman"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            className={`${priceInputClasses} w-24 sm:w-28`}
          />
          <span className="text-zinc-400">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            aria-label="Maximum price in Toman"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            className={`${priceInputClasses} w-24 sm:w-28`}
          />
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Toman</span>
        </div>
      </div>
    </section>
  );
}
