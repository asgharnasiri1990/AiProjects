import type { Locale } from "@/lib/i18n";
import { displayTracking, eyebrowStyle } from "@/lib/styles";

export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  locale,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  locale: Locale;
}) {
  return (
    <div className="max-w-2xl">
      <p
        className={`flex items-center gap-3 text-xs font-medium text-accent ${eyebrowStyle(locale)}`}
      >
        <span aria-hidden className="h-px w-6 bg-accent/40" />
        {index ? (
          <>
            <span dir="ltr" className="tabular-nums text-ink-soft">
              {index}
            </span>
            <span aria-hidden className="h-px w-3 bg-accent/25" />
          </>
        ) : null}
        {eyebrow}
      </p>
      <h2
        className={`mt-4 text-display font-semibold leading-tight text-balance ${displayTracking(locale)}`}
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-base leading-8 text-ink-soft text-pretty">
          {lead}
        </p>
      ) : null}
    </div>
  );
}
