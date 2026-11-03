import { profile } from "@/content/profile";
import { work } from "@/content/work";
import type { Locale } from "@/lib/i18n";

type Frame =
  | { kind: "work"; index: number }
  | { kind: "mark" };

/**
 * The hero ribbon: work frames streaming past on a tilted plane, faded out at
 * both edges. Decorative — every title is readable in the work index below, so
 * the whole strip is hidden from assistive tech and holds no links.
 */
export function WorkRibbon({ locale }: { locale: Locale }) {
  const frames: Frame[] = [
    ...work.map((_, index) => ({ kind: "work" as const, index })),
    { kind: "mark" as const },
  ];

  // Two identical halves: the track translates exactly -50% for a seamless loop.
  const strip = [...frames, ...frames];
  // A gentle fan so the strip reads as a curved ribbon rather than a flat row.
  const fan = [-8, -3, 3, 8];

  return (
    <div
      aria-hidden="true"
      className="work-ribbon relative mt-10 -mx-5 overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] sm:-mx-8 lg:-mx-12"
    >
      <div className="[perspective:1200px]">
        <div className="[transform:rotateX(13deg)] [transform-style:preserve-3d]">
          <div className="ribbon-track flex w-max">
            {strip.map((frame, position) => (
              <div
                key={position}
                className="shrink-0 pe-4 [transform-style:preserve-3d]"
                style={{ transform: `rotateY(${fan[position % fan.length]}deg)` }}
              >
                {frame.kind === "mark" ? (
                  <div className="accent-disc grid h-[190px] w-[240px] place-items-center rounded-xl text-[#f7f5ee] sm:w-[280px]">
                    <span className="font-mono text-5xl leading-none">
                      {profile.initials}
                    </span>
                  </div>
                ) : (
                  <div className="flex h-[190px] w-[240px] flex-col justify-between rounded-xl border border-line bg-paper p-5 sm:w-[280px]">
                    <div className="flex items-baseline justify-between gap-3 font-mono text-[10px] nums">
                      <span className="text-accent">
                        {work[frame.index].index}
                      </span>
                      <span className="text-muted">{work[frame.index].year}</span>
                    </div>
                    <div>
                      <p className="text-base font-medium leading-snug">
                        {work[frame.index].title[locale]}
                      </p>
                      <p
                        dir="ltr"
                        className="mt-2 font-mono text-[10px] text-muted"
                      >
                        {work[frame.index].stack.join(" · ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
