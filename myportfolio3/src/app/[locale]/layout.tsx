import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import "@fontsource-variable/archivo/standard.css";
import "@fontsource-variable/vazirmatn";
import "@fontsource-variable/jetbrains-mono";
import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import { isLocale, localeDir, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const c = copy[locale];

  return {
    title: {
      default: c.metaTitle,
      template: `%s — ${profile.name[locale]}`,
    },
    description: c.metaDescription,
    applicationName: profile.name[locale],
    authors: [{ name: profile.name[locale] }],
    openGraph: {
      type: "website",
      siteName: profile.name[locale],
      title: c.metaTitle,
      description: c.metaDescription,
      locale: locale === "fa" ? "fa_IR" : "en_US",
    },
    twitter: {
      card: "summary",
      title: c.metaTitle,
      description: c.metaDescription,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Read the theme on the server so the first paint and hydration agree.
  const theme =
    (await cookies()).get("theme")?.value === "ink" ? "ink" : "paper";

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      data-theme={theme}
      suppressHydrationWarning
      className="antialiased"
    >
      <body className="min-h-dvh bg-paper font-sans text-ink">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:font-mono focus:text-[10px] focus:text-paper"
        >
          {copy[locale].skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <main id="home">{children}</main>
      </body>
    </html>
  );
}
