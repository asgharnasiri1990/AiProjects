import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import { isLocale } from "@/lib/i18n";
import { displayTracking, focusRing, labelStyle, shell } from "@/lib/styles";
import { ContactForm } from "@/components/contact-form";
import { ArrowUpRightIcon } from "@/components/icons";

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const c = copy[locale];
  const label = `font-mono text-[10px] text-muted ${labelStyle(locale)}`;

  return (
    <div className={`${shell} pb-16 pt-10 lg:pb-24 lg:pt-14`}>
      <header className="border-b border-ink pb-6">
        <p className={`text-[11px] ${label}`}>{c.nav.contact}</p>
        <h1
          className={`mt-3 text-display font-medium leading-[1.1] ${displayTracking(
            locale,
          )}`}
        >
          {c.contactTitle}
        </h1>
        <p
          className={`mt-4 text-lede text-muted ${
            locale === "en" ? "max-w-[58ch]" : "max-w-[64ch]"
          }`}
        >
          {c.contactLead}
        </p>
      </header>

      <div className="grid gap-12 py-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className={label}>{c.contactEmail}</p>
          <p className="mt-2">
            <a
              href={`mailto:${profile.email}`}
              dir="ltr"
              className={`inline-block break-all text-base font-medium transition-colors hover:text-accent ${focusRing}`}
            >
              {profile.email}
            </a>
          </p>

          <p className={`mt-10 ${label}`}>{c.contactSocials}</p>
          <ul className="mt-3 space-y-2">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-sm transition-colors hover:text-accent ${focusRing}`}
                >
                  {social.label}
                  <span className="sr-only"> ({c.externalLink})</span>
                  <ArrowUpRightIcon className="h-3.5 w-3.5 opacity-60" />
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs text-muted">{profile.location[locale]}</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <ContactForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
