import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { displayTracking, focusRing, labelStyle } from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";

/**
 * The one section header used on every page: a mono label, a display title,
 * and a hairline that runs the full width of the shell.
 */
export function SectionHeading({
  locale,
  label,
  title,
  href,
  hrefLabel,
}: {
  locale: Locale;
  label: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-3">
      <div>
        <p
          className={`font-mono text-[11px] text-muted ${labelStyle(locale)}`}
        >
          {label}
        </p>
        <h2
          className={`mt-2 text-display font-medium leading-[1.15] ${displayTracking(
            locale,
          )}`}
        >
          {title}
        </h2>
      </div>

      {href && hrefLabel ? (
        <Link
          href={href}
          className={`inline-flex items-center gap-1.5 pb-1 text-sm text-muted transition-colors hover:text-accent ${focusRing}`}
        >
          {hrefLabel}
          <ArrowUpRightIcon className="rtl:-scale-x-100" />
        </Link>
      ) : null}
    </div>
  );
}
