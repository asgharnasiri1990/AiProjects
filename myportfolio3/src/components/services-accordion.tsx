"use client";

import { useState } from "react";
import { copy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { focusRing, latinLabel } from "@/lib/styles";
import { ArrowDownIcon, ArrowRightIcon } from "@/components/icons";

export function ServicesAccordion({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {c.services.map((service, index) => {
        const active = open === index;
        const circle = active
          ? "border-ink bg-ink text-paper"
          : "border-line text-soft";

        return (
          <div key={service.index}>
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                aria-hidden
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-[11px] sm:h-12 sm:w-12 sm:text-xs ${circle}`}
              >
                {service.index}
              </span>

              <button
                id={`service-button-${service.index}`}
                type="button"
                onClick={() => setOpen(active ? -1 : index)}
                aria-expanded={active}
                aria-controls={`service-${service.index}`}
                className={`min-w-0 flex-1 rounded-full border px-4 py-3 text-center font-display text-[15px] font-medium transition-colors sm:px-6 sm:py-4 sm:text-base ${latinLabel(locale, "tracking-[0.02em]")} ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink hover:border-ink"
                } ${focusRing}`}
              >
                {service.title}
              </button>

              <span
                aria-hidden
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border sm:h-12 sm:w-12 ${circle}`}
              >
                {active ? (
                  <ArrowRightIcon
                    width={16}
                    height={16}
                    className="rtl:-scale-x-100"
                  />
                ) : (
                  <ArrowDownIcon width={16} height={16} />
                )}
              </span>
            </div>

            <div
              id={`service-${service.index}`}
              role="region"
              aria-labelledby={`service-button-${service.index}`}
              inert={!active}
              className={`grid transition-all duration-300 ${
                active
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-4 pb-3 pt-4 text-center text-[15px] leading-7 text-soft sm:px-16 sm:text-sm">
                  {service.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
