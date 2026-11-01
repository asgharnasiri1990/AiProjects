import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** Current filters (without the page key); used to build page links. */
  params: Record<string, string>;
}

function hrefForPage(params: Record<string, string>, page: number): string {
  const search = new URLSearchParams(params);
  if (page <= 1) search.delete("page");
  else search.set("page", String(page));
  const qs = search.toString();
  return `/shop${qs ? `?${qs}` : ""}`;
}

const linkClasses =
  "inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800";

export function Pagination({ page, totalPages, params }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-between gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800"
    >
      {hasPrev ? (
        <Link href={hrefForPage(params, page - 1)} rel="prev" className={linkClasses}>
          <ChevronLeftIcon width={16} height={16} /> Previous
        </Link>
      ) : (
        <span aria-disabled className={`${linkClasses} cursor-not-allowed opacity-40`}>
          <ChevronLeftIcon width={16} height={16} /> Previous
        </span>
      )}

      <p className="text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
        Page <span className="font-semibold text-zinc-900 dark:text-zinc-100">{page}</span> of{" "}
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalPages}</span>
      </p>

      {hasNext ? (
        <Link href={hrefForPage(params, page + 1)} rel="next" className={linkClasses}>
          Next <ChevronRightIcon width={16} height={16} />
        </Link>
      ) : (
        <span aria-disabled className={`${linkClasses} cursor-not-allowed opacity-40`}>
          Next <ChevronRightIcon width={16} height={16} />
        </span>
      )}
    </nav>
  );
}
