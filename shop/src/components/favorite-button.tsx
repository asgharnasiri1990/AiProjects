"use client";

import { HeartIcon } from "@/components/icons";
import { useFavorites } from "@/context/favorites-context";
import type { Product } from "@/lib/types";

/**
 * Heart toggle. Rendered as a sibling of the card's link (never inside it) so
 * the markup stays valid and clicking the heart can't navigate.
 *
 * `showLabel` turns it into a wide "Save / Saved" pill for the detail page.
 */
export function FavoriteButton({
  product,
  showLabel = false,
  className = "",
}: {
  product: Product;
  showLabel?: boolean;
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const saved = has(product.id);

  const shape = showLabel
    ? `h-11 gap-2 px-5 text-sm font-medium ring-1 ${
        saved
          ? "bg-accent-50 text-accent-700 ring-accent-200 hover:bg-accent-100 dark:bg-accent-500/10 dark:text-accent-300 dark:ring-accent-500/30"
          : "text-zinc-700 ring-primary-200 hover:bg-primary-50 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
      }`
    : `h-9 w-9 bg-white/95 shadow-sm backdrop-blur hover:scale-105 dark:bg-zinc-900/90 ${
        saved
          ? "text-accent-600 dark:text-accent-500"
          : "text-zinc-600 dark:text-zinc-300"
      }`;

  return (
    <button
      type="button"
      onClick={() => toggle(product)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
      title={saved ? "Remove from saved" : "Save"}
      className={`flex items-center justify-center rounded-full transition-[color,background-color,opacity,transform] duration-200 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${shape} ${className}`}
    >
      <HeartIcon width={17} height={17} className={saved ? "fill-accent-500" : ""} />
      {showLabel && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
