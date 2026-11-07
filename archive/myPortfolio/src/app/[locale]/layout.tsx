import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Vazirmatn } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import { isLocale, localeDir, locales } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Persian glyphs fall back to Vazirmatn automatically.
const vazirmatn = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
});

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

  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      className={`${inter.variable} ${vazirmatn.variable}`}
    >
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-canvas"
        >
          {copy[locale].skipToContent}
        </a>
        <SiteHeader locale={locale} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
