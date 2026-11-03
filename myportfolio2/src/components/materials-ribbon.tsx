import Image from "next/image";
import { copy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";

type Frame =
  | { kind: "material"; name: string; group: string }
  | { kind: "mark" };

/**
 * The hero ribbon: the tools and concerns behind the work, streaming past on a
 * fanned, tilted plane and fading at both edges. It deliberately does not repeat
 * the work index — the strip is a materials list, not a second preview.
 *
 * Decorative: hidden from assistive tech, holds no links, pauses on hover and
 * stops under prefers-reduced-motion.
 */
export function MaterialsRibbon({ locale }: { locale: Locale }) {
  const materials = copy[locale].skills.flatMap((group) =>
    group.items.map((name) => ({ name, group: group.title })),
  );

  const half: Frame[] = [];
  materials.forEach((material, index) => {
    if (index % 4 === 0) half.push({ kind: "mark" });
    half.push({ kind: "material", name: material.name, group: material.group });
  });

  // Two identical halves: the track translates exactly -50% for a seamless loop.
  const strip = [...half, ...half];
  // A gentle fan so the strip reads as a curved ribbon rather than a flat row.
  const fan = [-8, -3, 3, 8];

  return (
    <div
      aria-hidden="true"
      className="materials-ribbon relative mt-10 -mx-5 overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] sm:-mx-8 lg:-mx-12"
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
                  <div className="relative h-[190px] w-[152px] overflow-hidden rounded-xl border border-line">
                    <Image
                      src="/images/portrait.jpg"
                      alt=""
                      fill
                      sizes="152px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-[190px] w-[240px] flex-col justify-between rounded-xl border border-line bg-paper p-5 sm:w-[280px]">
                    <span className="font-mono text-[10px] text-muted">
                      {frame.group}
                    </span>
                    <span className="text-xl font-medium leading-snug">
                      {frame.name}
                    </span>
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
