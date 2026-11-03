import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { focusRing, shell } from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";

export function SiteFooter({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line">
      <div
        className={`${shell} grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4`}
      >
        <p className="font-mono text-[11px] text-muted nums">
          © {year} {profile.name[locale]}
        </p>

        <p className="text-xs leading-6 text-muted">{c.footerNote}</p>
        <p className="text-xs leading-6 text-muted">{c.footerBuilt}</p>

        <ul className="flex flex-wrap items-start gap-x-5 gap-y-2 sm:justify-end">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 text-xs ${focusRing}`}
              >
                {social.label}
                <span className="sr-only"> ({c.externalLink})</span>
                <ArrowUpRightIcon className="h-3 w-3 opacity-50" />
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.socials[0].href + "/AiProjects"}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 text-xs ${focusRing}`}
            >
              {c.footerSource}
              <ArrowUpRightIcon className="h-3 w-3 opacity-50" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
