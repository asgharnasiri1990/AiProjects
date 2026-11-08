import type { Localized } from "@/lib/i18n";

export type WorkCategory = "web" | "tools";

export interface WorkItem {
  slug: string;
  index: string;
  title: Localized;
  summary: Localized;
  category: WorkCategory;
  categoryLabel: Localized;
  stack: string[];
  image: string;
  source: string;
}

/**
 * The four featured projects in this repository.
 * Categories drive the filter pill in the featured-project section.
 */
export const work: WorkItem[] = [
  {
    slug: "this-site",
    index: "01",
    title: { en: "This site", fa: "همین سایت" },
    summary: {
      en: "A monochrome, bilingual portfolio built entirely from data.",
      fa: "نمونه‌کار مونوکروم و دوزبانه که همه‌چیزش از داده ساخته می‌شود.",
    },
    category: "web",
    categoryLabel: { en: "Web design", fa: "طراحی وب" },
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/images/work-site-2.webp",
    source: "https://github.com/asgharnasiri1990/AiProjects",
  },
  {
    slug: "digital-shop",
    index: "02",
    title: { en: "DigitalShop", fa: "دیجیتال‌شاپ" },
    summary: {
      en: "A storefront on a public API, capped at 60 requests per minute.",
      fa: "فروشگاه روی یک API عمومی با محدودیت ۶۰ درخواست در دقیقه.",
    },
    category: "web",
    categoryLabel: { en: "Web storefront", fa: "فروشگاه وب" },
    stack: ["Next.js", "REST", "Tailwind CSS"],
    image: "/images/work-shop.webp",
    source: "https://github.com/asgharnasiri1990/AiProjects/tree/main/shop",
  },
  {
    slug: "flight-lookup",
    index: "03",
    title: { en: "Flight lookup", fa: "ردیاب پرواز" },
    summary: {
      en: "One field, one answer, with a normalisation layer behind it.",
      fa: "یک ورودی، یک جواب؛ با یک لایه نرمال‌سازی در پشت.",
    },
    category: "tools",
    categoryLabel: { en: "Tool", fa: "ابزار" },
    stack: ["Next.js", "Route Handlers", "AviationStack"],
    image: "/images/work-flight.webp",
    source:
      "https://github.com/asgharnasiri1990/AiProjects/tree/main/flight-tracker",
  },
  {
    slug: "price-compare",
    index: "04",
    title: {
      en: "Phone price comparator",
      fa: "مقایسه قیمت گوشی",
    },
    category: "tools",
    categoryLabel: { en: "Price tool", fa: "ابزار قیمت" },
    stack: ["Next.js", "Scraping", "RTL"],
    summary: {
      en: "Persian RTL price comparison across live shops.",
      fa: "مقایسه قیمت فارسی و راست‌به‌چپ بین فروشگاه‌های زنده.",
    },
    image: "/images/work-price.webp",
    source:
      "https://github.com/asgharnasiri1990/AiProjects/tree/main/price-compare",
  },
];
