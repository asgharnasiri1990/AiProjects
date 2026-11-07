import { archive, type ArchiveItem } from "@/content/archive";
import type { Locale } from "@/lib/i18n";
import { focusRing } from "@/lib/styles";
import { ArrowUpRightIcon, SketchRing } from "@/components/icons";

/**
 * The archive as soft paper cards on a tilted plane: a hairline border, a
 * hand-drawn ring and no shadow. The work index above stays flat on purpose —
 * only this grid is allowed depth.
 */
export function ArchiveGrid({
  locale,
  items = archive,
}: {
  locale: Locale;
  items?: ArchiveItem[];
}) {
  // A fan across each row: outer cards turn away, the middle one steps forward.
  // Mirrored for Persian, where the first card sits on the right.
  const fan =
    locale === "fa"
      ? ["rotateY(-9deg)", "translateZ(18px)", "rotateY(9deg)"]
      : ["rotateY(9deg)", "translateZ(18px)", "rotateY(-9deg)"];

  return (
    <div className="mt-8 [perspective:1200px]">
      <ul className="grid gap-4 [transform-style:preserve-3d] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <li
            key={item.name}
            className="[transform-style:preserve-3d]"
            style={{ transform: fan[index % fan.length] }}
          >
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex h-full flex-col rounded-xl border border-line bg-paper p-6 transition duration-200 hover:border-ink/20 hover:bg-raised hover:[transform:translateZ(30px)] ${focusRing}`}
            >
              <div className="flex items-start justify-between gap-3">
                <SketchRing className="h-10 w-10 text-line transition-colors group-hover:text-accent" />
                <span className="font-mono text-[10px] text-muted nums">
                  {item.year}
                </span>
              </div>

              <h3 className="mt-6 text-base font-medium transition-colors group-hover:text-accent">
                {item.name}
              </h3>
              <p className="mt-2 text-xs leading-6 text-muted">
                {item.description[locale]}
              </p>

              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <span dir="ltr" className="font-mono text-[10px] text-muted">
                  {item.stack.join(" · ")}
                </span>
                <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent rtl:-scale-x-100" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
