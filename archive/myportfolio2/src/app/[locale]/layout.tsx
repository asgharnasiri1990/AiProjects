import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter_Tight, JetBrains_Mono, Vazirmatn } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import { isLocale, localeDir, locales } from "@/lib/i18n";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Persian glyphs fall back to Vazirmatn automatically.
const vazirmatn = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${interTight.variable} ${vazirmatn.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <script
          // Runs before paint: applies the saved theme (or ?theme=ink) with no flash.
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var m=location.search.match(/[?&]theme=(ink|paper)/);var t=m?m[1]:localStorage.getItem('theme');if(m)localStorage.setItem('theme',m[1]);if(t==='ink')document.documentElement.dataset.theme='ink';}catch(e){}})();",
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-5 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-paper"
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
