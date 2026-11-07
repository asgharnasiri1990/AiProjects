import Link from "next/link";
import type { Work } from "@/content/work";
import type { Locale } from "@/lib/i18n";
import { displayTracking, focusRing } from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";

/**
 * One row of the printed index: number, title, one-line summary, year.
 * The whole row is the link; the arrow is decoration.
 */
export function WorkRow({ item, locale }: { item: Work; locale: Locale }) {
  return (
    <li className="border-b border-line">
      <Link
        href={`/${locale}/work/${item.slug}`}
        className={`group grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-6 ${focusRing}`}
      >
        <span className="col-span-2 font-mono text-[11px] text-muted nums transition-colors group-hover:text-accent sm:col-span-1">
          {item.index}
        </span>

        <div className="col-span-10 sm:col-span-11 lg:col-span-6">
          <h3
            className={`text-xl font-medium leading-snug transition-colors group-hover:text-accent ${displayTracking(
              locale,
            )}`}
          >
            {item.title[locale]}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-muted lg:hidden">
            {item.tagline[locale]}
          </p>
        </div>

        <p className="hidden text-sm leading-6 text-muted lg:col-span-4 lg:block">
          {item.tagline[locale]}
        </p>

        <div className="col-span-12 flex items-center justify-between gap-4 sm:col-span-12 lg:col-span-1 lg:justify-end">
          <span className="font-mono text-[11px] text-muted nums">
            {item.year}
          </span>
          <ArrowUpRightIcon className="shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent rtl:-scale-x-100" />
        </div>
      </Link>
    </li>
  );
}
