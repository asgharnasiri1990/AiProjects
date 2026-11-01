"use client";

import { startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CategoryWithCount } from "@/lib/types";

/**
 * Horizontal category pills that drive the `?category=` parameter.
 * Pure URL state — same contract the shop page has always used.
 */
export function CategoryNav({ categories }: { categories: CategoryWithCount[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "";

  const select = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    params.delete("page");

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
    });
  };

  const chip = (isActive: boolean) =>
    `flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
      isActive
        ? "bg-primary-600 text-white shadow-sm shadow-black/10"
        : "bg-white text-zinc-700 ring-1 ring-primary-200/70 hover:bg-primary-100 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-800"
    }`;

  return (
    <nav
      aria-label="Product categories"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
    >
      <button type="button" aria-pressed={!active} onClick={() => select(null)} className={chip(!active)}>
        All products
      </button>

      {categories.map((category) => {
        const isActive = active === category.slug;
        return (
          <button
            key={category.slug}
            type="button"
            aria-pressed={isActive}
            onClick={() => select(isActive ? null : category.slug)}
            className={chip(isActive)}
          >
            {category.name}
            <span className={`text-xs ${isActive ? "text-white/70" : "text-zinc-400"}`}>
              {category.productCount}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
