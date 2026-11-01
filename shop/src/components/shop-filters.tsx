"use client";

import { useCallback, useEffect, useMemo, useState, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterIcon, SearchIcon, XIcon } from "@/components/icons";
import type { CategoryWithCount } from "@/lib/types";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
] as const;

export function ShopFilters({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      category: searchParams.get("category") ?? "",
      min: searchParams.get("min") ?? "",
      max: searchParams.get("max") ?? "",
      sort: searchParams.get("sort") ?? "newest",
      stock: searchParams.get("stock") === "true",
    }),
    [searchParams],
  );

  const [qInput, setQInput] = useState(current.q);
  const [minInput, setMinInput] = useState(current.min);
  const [maxInput, setMaxInput] = useState(current.max);

  // Keep typing state in sync when the URL changes externally (e.g. "Clear all").
  useEffect(() => setQInput(current.q), [current.q]);
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

  // Debounce the search box.
  useEffect(() => {
    if (qInput === current.q) return;
    const timer = setTimeout(() => update({ q: qInput.trim() || null }), 400);
    return () => clearTimeout(timer);
  }, [qInput, current.q, update]);

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
    Boolean(current.q || current.category || current.min || current.max || current.stock) ||
    current.sort !== "newest";

  const priceInputClasses =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm tabular-nums text-zinc-900 placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500";

  return (
    <section
      aria-label="Product filters"
      className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5"
    >
      {/* Row 1: search + sort + in stock */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <SearchIcon
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            width={17}
            height={17}
          />
          <input
            type="search"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products by name or description"
            className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="sr-only sm:not-sr-only">Sort by</span>
            <select
              value={current.sort}
              onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })}
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
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
              className="flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <XIcon width={15} height={15} />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 2: price range */}
      <div className="mt-3 flex flex-col gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <FilterIcon width={15} height={15} />
          Price range
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            aria-label="Minimum price in Toman"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            className={`${priceInputClasses} sm:w-32`}
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
            className={`${priceInputClasses} sm:w-32`}
          />
          <span className="text-xs text-zinc-400 dark:text-zinc-500">Toman</span>
        </div>
      </div>

      {/* Row 3: categories */}
      <div className="mt-3 flex gap-2 overflow-x-auto border-t border-zinc-100 pb-1 pt-3 dark:border-zinc-800">
        <button
          type="button"
          aria-pressed={!current.category}
          onClick={() => update({ category: null })}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
            !current.category
              ? "bg-primary-600 text-white shadow-sm shadow-primary-600/30"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          All products
        </button>
        {categories.map((category) => {
          const active = current.category === category.slug;
          return (
            <button
              key={category.slug}
              type="button"
              aria-pressed={active}
              onClick={() => update({ category: active ? null : category.slug })}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                active
                  ? "bg-primary-600 text-white shadow-sm shadow-primary-600/30"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {category.name}
              <span className={`ml-1.5 text-xs ${active ? "text-primary-100" : "text-zinc-400"}`}>
                {category.productCount}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
