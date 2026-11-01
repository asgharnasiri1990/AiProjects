"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, XIcon } from "@/components/icons";

const DEBOUNCE_MS = 400;

/**
 * URL-driven search pill.
 *
 * It reads/writes the same `?q=` parameter the shop page already parses, so
 * search stays shareable and back/forward friendly. Typing on any page routes
 * to /shop; typing on /shop preserves the other filters.
 */
export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onShop = pathname === "/shop";
  const urlQuery = onShop ? (searchParams.get("q") ?? "") : "";
  const [value, setValue] = useState(urlQuery);

  // Keep the input in sync when the URL changes from elsewhere
  // ("Clear all", back/forward, a category click that keeps the query).
  useEffect(() => setValue(urlQuery), [urlQuery]);

  useEffect(() => {
    if (value.trim() === urlQuery.trim()) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(onShop ? searchParams.toString() : "");
      const query = value.trim();
      if (query) params.set("q", query);
      else params.delete("q");
      params.delete("page"); // a new search always starts on page 1

      const qs = params.toString();
      router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, urlQuery, onShop, searchParams, router]);

  return (
    <div className={`relative ${className}`}>
      <SearchIcon
        width={17}
        height={17}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products…"
        aria-label="Search products by name or description"
        className="h-11 w-full rounded-full border border-primary-200 bg-white pl-11 pr-10 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/15 [&::-webkit-search-cancel-button]:appearance-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-primary-300"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-primary-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          <XIcon width={14} height={14} />
        </button>
      )}
    </div>
  );
}
