import { notFound } from "next/navigation";
import { archive } from "@/content/archive";
import { copy } from "@/content/copy";
import { isLocale } from "@/lib/i18n";
import { displayTracking, focusRing, labelStyle, shell } from "@/lib/styles";
import { ArchiveGrid } from "@/components/archive-grid";

export default async function ArchivePage({
  params,
}: PageProps<"/[locale]/archive">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const c = copy[locale];
  const total = String(archive.length).padStart(2, "0");

  return (
    <div className={`${shell} pb-16 pt-10 lg:pb-24 lg:pt-14`}>
      <header className="border-b border-ink pb-6">
        <p className={`font-mono text-[11px] text-muted nums ${labelStyle(locale)}`}>
          {c.caseIndex} / {total}
        </p>
        <h1
          className={`mt-3 text-display font-medium leading-[1.1] ${displayTracking(
            locale,
          )}`}
        >
          {c.archiveTitle}
        </h1>
        <p
          className={`mt-4 text-sm leading-7 text-muted ${
            locale === "en" ? "max-w-[58ch]" : "max-w-[64ch]"
          }`}
        >
          {c.archiveLead}
        </p>
      </header>

      <ArchiveGrid locale={locale} />

      <p className="mt-8">
        <a
          href="https://github.com/asgharnasiri1990?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs text-muted transition-colors hover:text-accent ${focusRing}`}
        >
          {c.archiveAll} ↗
        </a>
      </p>
    </div>
  );
}
