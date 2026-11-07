"use client";

import { useState } from "react";
import Image from "next/image";
import { copy } from "@/content/copy";
import { work, type WorkCategory } from "@/content/work";
import type { Locale } from "@/lib/i18n";
import { focusRing, labelStyle } from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";

type Filter = "all" | WorkCategory;

export function WorkGrid({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [filter, setFilter] = useState<Filter>("all");

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: c.workAll },
    { id: "web", label: c.workWeb },
    { id: "tools", label: c.workTools },
  ];

  const shown = work.filter(
    (item) => filter === "all" || item.category === filter,
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={c.workLabel}>
        {tabs.map((tab) => {
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(tab.id)}
              className={`rounded-full border px-5 py-2 font-mono text-[10px] transition-colors ${labelStyle(locale)} ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-soft hover:border-ink hover:text-ink"
              } ${focusRing}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
        {shown.map((item) => {
          const title = item.title[locale];
          return (
            <article key={item.slug} className="group relative">
              <a
                href={item.source}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} — ${c.workSource}`}
                className={`absolute inset-0 z-10 rounded-2xl ${focusRing}`}
              />
              <div className="pointer-events-none relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-wash">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 48vw"
                  className="object-cover object-top grayscale transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-2 start-2 rounded-full bg-paper/90 px-2 py-0.5 font-mono text-[9px] text-soft backdrop-blur sm:bottom-3 sm:start-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
                  {item.index}
                </span>
              </div>

              <div className="pointer-events-none mt-3 flex items-start justify-between gap-2 sm:mt-4 sm:gap-4">
                <div>
                  <p
                    className={`font-mono text-[9px] text-soft sm:text-[10px] ${labelStyle(locale)}`}
                  >
                    {item.categoryLabel[locale]}
                  </p>
                  <h3 className="mt-1 font-display text-base font-medium tracking-[-0.02em] sm:text-2xl">
                    {title}
                  </h3>
                </div>
                <span
                  aria-hidden
                  className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-soft transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper sm:h-9 sm:w-9"
                >
                  <ArrowUpRightIcon
                    width={12}
                    height={12}
                    className="transition-transform duration-300 group-hover:rotate-45 sm:h-3.5 sm:w-3.5"
                  />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
