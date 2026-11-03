import Link from "next/link";
import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { isLocale } from "@/lib/i18n";
import { displayTracking, labelStyle, metalButton, shell } from "@/lib/styles";

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const c = copy[locale];
  const label = `font-mono text-[10px] text-muted ${labelStyle(locale)}`;

  return (
    <div className={`${shell} pb-16 pt-10 lg:pb-24 lg:pt-14`}>
      <header className="border-b border-ink pb-6">
        <p className={`text-[11px] ${label}`}>{c.aboutTitle}</p>
        <h1
          className={`mt-3 max-w-[24ch] text-display font-medium leading-[1.1] ${displayTracking(
            locale,
          )}`}
        >
          {c.aboutLead}
        </h1>
      </header>

      <section className="grid gap-6 border-b border-line py-12 lg:grid-cols-12 lg:gap-8">
        <p className={`${label} lg:col-span-3`}>01 — {c.aboutTitle}</p>
        <div className="space-y-5 lg:col-span-8 lg:col-start-5">
          {c.aboutBody.map((paragraph, index) => (
            <p
              key={index}
              className="max-w-[68ch] text-[15px] leading-8 text-ink/85"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="grid gap-6 border-b border-line py-12 lg:grid-cols-12 lg:gap-8">
        <p className={`${label} lg:col-span-3`}>02 — {c.skillsTitle}</p>
        <div className="lg:col-span-9">
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-3">
            {c.skills.map((group) => (
              <li key={group.title} className="bg-canvas p-5">
                <h2 className={`${label}`}>{group.title}</h2>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 py-12 lg:grid-cols-12 lg:gap-8">
        <p className={`${label} lg:col-span-3`}>03 — {c.timelineTitle}</p>
        <ol className="lg:col-span-9">
          {c.timeline.map((entry) => (
            <li
              key={entry.title}
              className="grid gap-2 border-b border-line py-5 last:border-b-0 sm:grid-cols-12 sm:items-baseline sm:gap-4"
            >
              <span className="font-mono text-[11px] text-muted nums sm:col-span-2">
                {entry.period}
              </span>
              <div className="sm:col-span-10">
                <h2 className="text-base font-medium">{entry.title}</h2>
                <p className="mt-1 text-sm leading-7 text-muted">
                  {entry.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="border-t border-ink pt-6">
        <Link href={`/${locale}/contact`} className={metalButton}>
          {c.ctaContact}
        </Link>
      </div>
    </div>
  );
}
