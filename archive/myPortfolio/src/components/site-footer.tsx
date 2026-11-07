import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { focusRing } from "@/lib/styles";

export function SiteFooter({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-10 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
        <p>
          {profile.name[locale]} — {c.footerNote}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <a
            href={`mailto:${profile.email}`}
            className={`rounded transition-colors hover:text-ink ${focusRing}`}
          >
            {profile.email}
          </a>
          <span aria-hidden className="hidden h-3 w-px bg-line sm:block" />
          <p>
            © {year} · {c.builtWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
