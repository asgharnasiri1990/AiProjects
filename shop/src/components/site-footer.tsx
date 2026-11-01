import Link from "next/link";
import { ShoppingBagIcon } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white">
            <ShoppingBagIcon width={14} height={14} />
          </span>
          <span>
            <strong className="font-semibold text-zinc-700 dark:text-zinc-300">shopping Center</strong> — a
            practice storefront.
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/shop" className="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
            Shop
          </Link>
          <span aria-hidden>·</span>
          <a
            href="https://practice.amirm.me/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            API docs
          </a>
          <span aria-hidden>·</span>
          <span>Next.js + Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}
