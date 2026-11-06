"use client";

import { useState } from "react";
import { copy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { focusRing } from "@/lib/styles";
import { ArrowDownIcon } from "@/components/icons";

export function ServicesAccordion({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [open, setOpen] = useState(0);

  return (
    <div className="mx-auto max-w-4xl space-y-2">
      {c.services.map((service, index) => {
        const active = open === index;
        return (
          <div key={service.index}>
            <button
              type="button"
              onClick={() => setOpen(active ? -1 : index)}
              aria-expanded={active}
              aria-controls={`service-${service.index}`}
              className={`flex w-full items-center gap-4 rounded-full border px-5 py-4 text-start transition-colors sm:px-6 ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink hover:border-ink"
              } ${focusRing}`}
            >
              <span
                className={`w-6 font-mono text-[10px] ${
                  active ? "text-paper/60" : "text-soft"
                }`}
              >
                {service.index}
              </span>
              <span className="flex-1 font-display text-sm font-medium uppercase tracking-[0.02em] sm:text-base">
                {service.title}
              </span>
              <ArrowDownIcon
                width={16}
                height={16}
                className={`shrink-0 transition-transform duration-300 ${
                  active ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              id={`service-${service.index}`}
              className={`grid transition-all duration-300 ${
                active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 pt-3 text-sm leading-7 text-soft sm:px-6">
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
