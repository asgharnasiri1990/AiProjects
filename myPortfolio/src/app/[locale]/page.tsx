import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { copy } from "@/content/copy";
import { archive } from "@/content/archive";
import { posts } from "@/content/posts";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { isLocale, t } from "@/lib/i18n";
import {
  buttonGhost,
  buttonPrimary,
  displayTracking,
  eyebrowStyle,
  focusRing,
} from "@/lib/styles";
import { ArrowRightIcon, ArrowUpRightIcon, MailIcon } from "@/components/icons";
import { ContactForm } from "@/components/contact-form";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    alternates: {
      languages: { fa: "/fa", en: "/en" },
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const c = copy[locale];
  const year = new Date().getFullYear();

  return (
    <>
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-16 sm:pt-24">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)] md:items-end">
          <div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent/30" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                {c.availability}
              </span>
              <span aria-hidden className="hidden h-px w-5 bg-line sm:block" />
              <span>{c.portraitCaption}</span>
            </p>

            <h1
              className={`mt-6 text-hero font-semibold leading-[1.06] text-balance ${displayTracking(locale)}`}
            >
              {c.heroTitle}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-9 text-ink-soft text-pretty">
              {c.heroLead}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#work" className={buttonPrimary}>
                {c.ctaWork}
                <ArrowRightIcon className="rtl:-scale-x-100" />
              </a>
              <a href={`mailto:${profile.email}`} className={buttonGhost}>
                <MailIcon />
                {c.ctaContact}
              </a>
            </div>
          </div>

          {/* The hero photo is a workspace shot until a real portrait is added. */}
          <div className="relative aspect-[4/5] w-full max-w-[15rem] overflow-hidden rounded-2xl border border-line bg-wash md:justify-self-end">
            <Image
              src={profile.photo}
              alt={c.portraitAlt}
              fill
              priority
              sizes="(min-width: 768px) 240px, 60vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/60 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <span className="text-[11px] font-medium text-canvas">
                {profile.name[locale]}
              </span>
              <span className="text-[11px] text-canvas/80">{year}</span>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-line pt-8">
          {c.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span
                  className={`block text-2xl font-semibold sm:text-3xl ${displayTracking(locale)}`}
                >
                  <span dir="ltr">{stat.value}</span>
                </span>
                <span className="mt-1 block text-xs text-ink-soft sm:text-sm">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Selected work */}
      <section id="work" className="mt-20 scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <SectionHeading
            index="01"
            eyebrow={c.workEyebrow}
            title={c.workTitle}
            lead={c.workLead}
            locale={locale}
          />

          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* About, skills, experience */}
      <section id="about" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <div className="grid gap-12 md:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
            <div className="md:sticky md:top-24 md:self-start">
              <SectionHeading
                index="02"
                eyebrow={c.aboutEyebrow}
                title={c.aboutTitle}
                lead={c.aboutLead}
                locale={locale}
              />
            </div>

            <div>
              <div className="space-y-5 text-base leading-8 text-ink-soft">
                {c.aboutBody.map((paragraph) => (
                  <p key={paragraph} className="text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>

              <h3
                className={`mt-14 text-xs font-medium text-accent ${eyebrowStyle(locale)}`}
              >
                {c.skillsTitle}
              </h3>
              <dl className="mt-6 grid gap-8 sm:grid-cols-3">
                {c.skills.map((group) => (
                  <div key={group.title}>
                    <dt className="text-sm font-medium">{group.title}</dt>
                    <dd className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft"
                        >
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>

              <h3
                className={`mt-14 text-xs font-medium text-accent ${eyebrowStyle(locale)}`}
              >
                {c.experienceTitle}
              </h3>
              <ul className="mt-4 divide-y divide-line border-t border-line">
                {c.experience.map((job) => (
                  <li
                    key={job.company}
                    className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6"
                  >
                    <span className="text-sm text-ink-soft">{job.period}</span>
                    <div>
                      <p className="font-medium">
                        {job.role}
                        <span className="text-ink-soft"> · {job.company}</span>
                      </p>
                      <p className="mt-1 text-sm leading-7 text-ink-soft">
                        {job.summary}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Field log */}
      <section id="log" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              index="03"
              eyebrow={c.logEyebrow}
              title={c.logTitle}
              lead={c.logLead}
              locale={locale}
            />
            <Link
              href={`/${locale}/log`}
              className={`group inline-flex items-center gap-2 rounded text-sm font-medium text-ink transition-colors hover:text-accent ${focusRing}`}
            >
              {c.logAll}
              <ArrowRightIcon className="rtl:-scale-x-100" />
            </Link>
          </div>

          <ul className="mt-10 divide-y divide-line border-t border-line">
            {posts.slice(0, 3).map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/${locale}/log/${post.slug}`}
                  className={`group grid gap-2 rounded py-6 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-6 ${focusRing}`}
                >
                  <time dateTime={post.date} className="text-xs text-ink-soft">
                    {post.displayDate[locale]}
                  </time>
                  <span>
                    <span
                      className={`block text-lg font-medium transition-colors group-hover:text-accent ${displayTracking(locale)}`}
                    >
                      {t(post.title, locale)}
                    </span>
                    <span className="mt-1 block text-sm leading-7 text-ink-soft">
                      {t(post.summary, locale)}
                    </span>
                  </span>
                  <span className="text-xs text-ink-soft">
                    {post.readingTime} {c.readingTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Archive */}
      <section id="archive" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              index="04"
              eyebrow={c.archiveEyebrow}
              title={c.archiveTitle}
              lead={c.archiveLead}
              locale={locale}
            />
            <a
              href="https://github.com/asgharnasiri1990"
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-2 rounded text-sm font-medium text-ink transition-colors hover:text-accent ${focusRing}`}
            >
              {c.archiveAll}
              <ArrowUpRightIcon
                width={14}
                height={14}
                className="rtl:-scale-x-100"
              />
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archive.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col rounded-2xl border border-line p-5 transition-colors hover:border-ink ${focusRing}`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span dir="ltr" className="font-medium">
                    {item.name}
                  </span>
                  <ArrowUpRightIcon
                    width={15}
                    height={15}
                    className="shrink-0 text-ink-soft transition-colors group-hover:text-ink rtl:-scale-x-100"
                  />
                </span>
                <span className="mt-2 flex-1 text-sm leading-7 text-ink-soft">
                  {t(item.description, locale)}
                </span>
                <span className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-ink-soft">
                  <span>{item.year}</span>
                  <span aria-hidden className="h-px w-3 bg-line" />
                  <span dir="ltr" className="truncate">
                    {item.stack.join(" · ")}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
          <div className="rounded-3xl border border-line bg-wash px-6 py-12 sm:px-12 sm:py-16">
            <p
              className={`flex items-center gap-3 text-xs font-medium text-accent ${eyebrowStyle(locale)}`}
            >
              <span aria-hidden className="h-px w-6 bg-accent/40" />
              <span dir="ltr" className="tabular-nums text-ink-soft">
                05
              </span>
              <span aria-hidden className="h-px w-3 bg-accent/25" />
              {c.contactEyebrow}
            </p>
            <h2
              className={`mt-4 max-w-2xl text-display font-semibold leading-tight text-balance ${displayTracking(locale)}`}
            >
              {c.contactTitle}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-ink-soft text-pretty">
              {c.contactLead}
            </p>

            <div className="mt-8">
              <ContactForm locale={locale} />
            </div>

            <p className="mt-8 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <span>{c.formDirect}</span>
              <a
                href={`mailto:${profile.email}`}
                dir="ltr"
                className={`rounded font-medium text-ink underline-offset-4 hover:text-accent hover:underline ${focusRing}`}
              >
                {profile.email}
              </a>
            </p>

            {profile.socials.length > 0 ? (
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
                <span
                  className={`text-xs font-medium text-ink-soft ${eyebrowStyle(locale)}`}
                >
                  {c.socialsTitle}
                </span>
                {profile.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 rounded text-sm text-ink transition-colors hover:text-accent ${focusRing}`}
                  >
                    {social.label}
                    <ArrowUpRightIcon
                      width={14}
                      height={14}
                      className="rtl:-scale-x-100"
                    />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
