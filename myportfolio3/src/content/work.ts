import type { Localized } from "@/lib/i18n";

export type WorkCategory = "web" | "tools";

export interface WorkItem {
  slug: string;
  index: string;
  title: Localized;
  category: WorkCategory;
  categoryLabel: Localized;
  image: string;
  source: string;
}

/**
 * The three apps that actually exist in this repository.
 * Categories drive the filter pill in the featured-project section.
 */
export const work: WorkItem[] = [
  {
    slug: "digital-shop",
    index: "01",
    title: { en: "DigitalShop", fa: "دیجیتال‌شاپ" },
    category: "web",
    categoryLabel: { en: "Web storefront", fa: "فروشگاه وب" },
    image: "/images/work-shop.webp",
    source: "https://github.com/asgharnasiri1990/AiProjects/tree/main/shop",
  },
  {
    slug: "flight-lookup",
    index: "02",
    title: { en: "Flight lookup", fa: "ردیاب پرواز" },
    category: "tools",
    categoryLabel: { en: "Tool", fa: "ابزار" },
    image: "/images/work-flight.webp",
    source:
      "https://github.com/asgharnasiri1990/AiProjects/tree/main/flight-tracker",
  },
  {
    slug: "this-site",
    index: "03",
    title: { en: "This site", fa: "همین سایت" },
    category: "web",
    categoryLabel: { en: "Web design", fa: "طراحی وب" },
    image: "/images/work-site.webp",
    source: "https://github.com/asgharnasiri1990/AiProjects",
  },
];
