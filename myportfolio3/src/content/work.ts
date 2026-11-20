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
  /** Source repository, when there is one. */
  source?: string;
  /** Live site, used when there is no public repository. */
  live?: string;
}

/**
 * The featured projects. Screenshots live in /public/images and are real
 * captures of the running sites — do not swap them for stock images.
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
  {
    slug: "payamshop",
    index: "05",
    title: { en: "PayamShop", fa: "پیام‌شاپ" },
    summary: {
      en: "Persian mobile storefront: phones, watches and accessories.",
      fa: "فروشگاه موبایل فارسی: گوشی، ساعت هوشمند و لوازم جانبی.",
    },
    category: "web",
    categoryLabel: { en: "Online store", fa: "فروشگاه آنلاین" },
    stack: ["Next.js", "RTL", "Vercel"],
    image: "/images/work-payamshop.webp",
    live: "https://payamshop.vercel.app",
  },
  {
    slug: "lilou-gallery",
    index: "06",
    title: { en: "Lilou Gallery", fa: "لیلـو گالری" },
    summary: {
      en: "A small fashion gallery for shawls, bags and shoes.",
      fa: "گالری کوچک پوشاک و اکسسوری: شال، کیف و کفش.",
    },
    category: "web",
    categoryLabel: { en: "Fashion gallery", fa: "گالری پوشاک" },
    stack: ["Next.js", "RTL", "Vercel"],
    image: "/images/work-lilou.webp",
    live: "https://lilou-gallery.vercel.app",
  },
  {
    slug: "amin-shop",
    index: "07",
    title: { en: "Amin Shop", fa: "فروشگاه امین" },
    summary: {
      en: "Accessories shop: chargers, cables, cases and audio.",
      fa: "فروشگاه لوازم جانبی: شارژر، کابل، قاب و صدا.",
    },
    category: "web",
    categoryLabel: { en: "Accessories store", fa: "فروشگاه لوازم جانبی" },
    stack: ["Next.js", "RTL", "Vercel"],
    image: "/images/work-amin.webp",
    live: "https://amin-shop.vercel.app",
  },
  {
    slug: "cafe-yar",
    index: "08",
    title: { en: "Cafe Yar", fa: "کافه‌یار" },
    summary: {
      en: "Café menu with dine-in and takeaway ordering.",
      fa: "منوی کافه با سفارش حضوری و بیرون‌بر.",
    },
    category: "tools",
    categoryLabel: { en: "Café menu", fa: "منوی کافه" },
    stack: ["Next.js", "RTL", "Vercel"],
    image: "/images/work-menu.webp",
    live: "https://menu-online-fawn.vercel.app",
  },
];
