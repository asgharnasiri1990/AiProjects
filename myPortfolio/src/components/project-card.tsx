import Link from "next/link";
import { type Locale, t } from "@/lib/i18n";
import { displayTracking, focusRing } from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";
import { ProjectArt } from "@/components/project-art";
import type { Project } from "@/content/projects";

export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  return (
    <article className="group">
      <Link
        href={`/${locale}/work/${project.slug}`}
        className={`block rounded-2xl ${focusRing}`}
      >
        <ProjectArt
          index={project.index}
          src={project.cover}
          className="aspect-[4/3]"
        />

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs text-ink-soft">
              <span>{project.year}</span>
              <span aria-hidden className="h-px w-3 bg-line" />
              <span className="truncate">{project.stack[0]}</span>
            </p>
            <h3
              className={`mt-2 text-xl font-medium ${displayTracking(locale)}`}
            >
              {t(project.title, locale)}
            </h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft text-pretty">
              {t(project.tagline, locale)}
            </p>
          </div>

          <span
            aria-hidden
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-canvas"
          >
            <ArrowUpRightIcon className="rtl:-scale-x-100" />
          </span>
        </div>
      </Link>
    </article>
  );
}
