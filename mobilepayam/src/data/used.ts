import type { UsedListing } from "@/lib/types";

/* Seed for the used-phone section. Images/videos are optional per listing —
   the UI shows a clear placeholder until an admin adds URLs. */

export const USED_LISTINGS: UsedListing[] = [
  {
    id: "u-1",
    slug: "iphone-13-pro-max-256",
    title: "آیفون ۱۳ پرو مکس — ۲۵۶ گیگابایت",
    brand: "Apple",
    model: "iPhone 13 Pro Max",
    storage: "۲۵۶ گیگابایت",
    color: "مشکی گرافیتی",
    condition: "excellent",
    price: 39_500_000,
    oldPrice: 43_000_000,
    batteryHealth: 88,
    warrantyMonths: 12,
    city: "تهران",
    description:
      "بدنه بدون خط و خش عمیق، صفحه‌نمایش سالم و باتری ۸۸٪. همراه با کابل و قاب محافظ. دستگاه توسط کارشناس تست شده و سلامت سخت‌افزار تأیید شده است.",
    specs: [
      { label: "وضعیت بدنه", value: "عالی — چند خط مویی جزئی" },
      { label: "صفحه‌نمایش", value: "سالم، بدون سوختگی" },
      { label: "سلامت باتری", value: "۸۸٪" },
      { label: "لوازم همراه", value: "کابل، قاب" },
    ],
    images: ["/images/used/iphone-13-pro-max-256.webp"],
    status: "available",
    createdAt: "2026-11-10",
  },
  {
    id: "u-2",
    slug: "galaxy-s21-ultra-256",
    title: "سامسونگ گلکسی S21 اولترا — ۲۵۶ گیگابایت",
    brand: "Samsung",
    model: "Galaxy S21 Ultra",
    storage: "۲۵۶ گیگابایت",
    color: "نقره‌ای",
    condition: "excellent",
    price: 28_500_000,
    batteryHealth: 85,
    warrantyMonths: 6,
    city: "تهران",
    description:
      "پرچمدار سامسونگ با دوربین ۱۰۸ مگاپیکسل و قلم S Pen. باتری سالم و بدنه تمیز؛ مناسب کسانی که پرچمدار می‌خواهند با بودجهٔ کمتر.",
    specs: [
      { label: "وضعیت بدنه", value: "عالی" },
      { label: "صفحه‌نمایش", value: "سالم، ۱۲۰ هرتز" },
      { label: "سلامت باتری", value: "۸۵٪" },
      { label: "لوازم همراه", value: "کابل و قلم" },
    ],
    images: ["/images/used/galaxy-s21-ultra-256.jpg"],
    status: "available",
    createdAt: "2026-11-06",
  },
  {
    id: "u-3",
    slug: "iphone-12-128",
    title: "آیفون ۱۲ — ۱۲۸ گیگابایت",
    brand: "Apple",
    model: "iPhone 12",
    storage: "۱۲۸ گیگابایت",
    color: "آبی",
    condition: "good",
    price: 21_900_000,
    batteryHealth: 82,
    warrantyMonths: 3,
    city: "کرج",
    description:
      "گزینهٔ اقتصادی برای ورود به اکوسیستم اپل. بدنه خط و خش جزئی دارد، صفحه‌نمایش سالم است و باتری بالای ۸۰٪ سلامت دارد.",
    specs: [
      { label: "وضعیت بدنه", value: "خوب — خط و خش جزئی" },
      { label: "صفحه‌نمایش", value: "سالم" },
      { label: "سلامت باتری", value: "۸۲٪" },
      { label: "لوازم همراه", value: "کابل" },
    ],
    images: ["/images/used/iphone-12-128.webp"],
    status: "available",
    createdAt: "2026-10-30",
  },
  {
    id: "u-4",
    slug: "pixel-7-128",
    title: "گوگل پیکسل ۷ — ۱۲۸ گیگابایت",
    brand: "Google",
    model: "Pixel 7",
    storage: "۱۲۸ گیگابایت",
    color: "سفید",
    condition: "good",
    price: 24_900_000,
    batteryHealth: 80,
    warrantyMonths: 3,
    city: "تهران",
    description:
      "بهترین دوربین در این ردهٔ قیمتی. دستگاه تک‌سیم‌کارت با سلامت باتری ۸۰٪ و بدنهٔ بدون ضربه؛ مناسب عکاسی روزمره.",
    specs: [
      { label: "وضعیت بدنه", value: "خوب" },
      { label: "صفحه‌نمایش", value: "سالم" },
      { label: "سلامت باتری", value: "۸۰٪" },
      { label: "لوازم همراه", value: "کابل" },
    ],
    images: ["/images/used/pixel-7-128.webp"],
    status: "reserved",
    createdAt: "2026-10-24",
  },
  {
    id: "u-5",
    slug: "xiaomi-12-256",
    title: "شیائومی ۱۲ — ۲۵۶ گیگابایت",
    brand: "Xiaomi",
    model: "Xiaomi 12",
    storage: "۲۵۶ گیگابایت",
    color: "خاکستری",
    condition: "like-new",
    price: 18_900_000,
    batteryHealth: 86,
    warrantyMonths: 6,
    city: "اصفهان",
    description:
      "دستگاه کم‌کارکرد با بدنهٔ در حد نو، شارژ سریع ۶۷ وات و نمایشگر ۱۲۰ هرتز. همراه با جعبه و لوازم اصلی.",
    specs: [
      { label: "وضعیت بدنه", value: "در حد نو" },
      { label: "صفحه‌نمایش", value: "سالم" },
      { label: "سلامت باتری", value: "۸۶٪" },
      { label: "لوازم همراه", value: "جعبه، کابل، شارژر" },
    ],
    images: ["/images/used/xiaomi-12-256.webp"],
    status: "available",
    createdAt: "2026-11-12",
  },
];

export const USED_CONDITION_LABEL: Record<
  UsedListing["condition"],
  string
> = {
  "like-new": "در حد نو",
  excellent: "عالی",
  good: "خوب",
  fair: "قابل قبول",
};

export const USED_STATUS_LABEL: Record<UsedListing["status"], string> = {
  available: "موجود",
  reserved: "رزرو شده",
  sold: "فروخته شده",
};

export function usedBySlug(
  listings: UsedListing[],
  slug: string,
): UsedListing | undefined {
  return listings.find((listing) => listing.slug === slug);
}
