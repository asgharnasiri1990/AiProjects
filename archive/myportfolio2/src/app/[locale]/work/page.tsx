import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { work } from "@/content/work";
import { isLocale } from "@/lib/i18n";
import { displayTracking, labelStyle, shell } from "@/lib/styles";
import { WorkRow } from "@/components/work-row";

export default async function WorkIndexPage({
  params,
}: PageProps<"/[locale]/work">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const c = copy[locale];
  const total = String(work.length).padStart(2, "0");

  return (
    <div className={`${shell} pb-16 pt-10 lg:pb-24 lg:pt-14`}>
      <header className="border-b border-ink pb-6">
        <p className={`font-mono text-[11px] text-muted nums ${labelStyle(locale)}`}>
          {c.caseIndex} / {total}
        </p>
        <h1
          className={`mt-3 max-w-[22ch] text-display font-medium leading-[1.1] ${displayTracking(
            locale,
          )}`}
        >
          {c.workTitle}
        </h1>
        <p
          className={`mt-4 text-sm leading-7 text-muted ${
            locale === "en" ? "max-w-[58ch]" : "max-w-[64ch]"
          }`}
        >
          {c.workLead}
        </p>
      </header>

      <ol>
        {work.map((item) => (
          <WorkRow key={item.slug} item={item} locale={locale} />
        ))}
      </ol>
    </div>
  );
}
