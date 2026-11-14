import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "mobilepayam | موبایل و لوازم جانبی اصل",
    template: "%s | mobilepayam",
  },
  description:
    "فروشگاه موبایل و لوازم جانبی mobilepayam؛ ضمانت اصالت کالا، ارسال سریع و قیمت شفاف.",
  applicationName: "mobilepayam",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Fonts are loaded from a CDN while the app is front-end only.
            TODO before launch: self-host Vazirmatn in /public/fonts. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
