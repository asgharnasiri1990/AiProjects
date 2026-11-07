"use client";

import { useState } from "react";
import Image from "next/image";
import { copy } from "@/content/copy";
import { work, type WorkCategory } from "@/content/work";
import type { Locale } from "@/lib/i18n";
import { focusRing, labelStyle } from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";
import { CircleLink } from "@/components/circle-link";
import { Reveal } from "@/components/reveal";

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
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={c.workLabel}
        >
          {tabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(tab.id)}
                className={`rounded-full border px-5 py-2.5 font-mono text-xs transition-colors sm:px-8 sm:py-4 ${labelStyle(locale)} ${
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

        <CircleLink
          href="https://github.com/asgharnasiri1990/AiProjects"
          label={c.workRepos}
          external
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:gap-x-8">
        {shown.map((item, index) => {
          const title = item.title[locale];
          return (
            <Reveal key={item.slug} delay={(index % 2) * 90}>
              <article className="group relative">
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
                    sizes="(min-width: 1024px) 46vw, (min-width: 640px) 45vw, 92vw"
                    className="object-cover object-top grayscale transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-3 start-3 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[11px] text-soft backdrop-blur sm:text-[10px]">
                    {item.index}
                  </span>
                </div>

                <div className="pointer-events-none mt-4 flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`font-mono text-[11px] text-soft sm:text-[10px] ${labelStyle(locale)}`}
                    >
                      {item.categoryLabel[locale]}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-medium tracking-[-0.02em] sm:text-2xl lg:text-3xl">
                      {title}
                    </h3>
                  </div>
                  <span
                    aria-hidden
                    className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-soft transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
                  >
                    <ArrowUpRightIcon
                      width={14}
                      height={14}
                      className="transition-transform duration-300 group-hover:rotate-45"
                    />
                  </span>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
