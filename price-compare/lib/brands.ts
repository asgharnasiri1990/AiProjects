export interface Brand {
  value: string;
  label: string;
  query: string;
}

export const BRANDS: Brand[] = [
  { value: "", label: "همه برندها", query: "" },
  { value: "apple", label: "اپل", query: "Apple" },
  { value: "samsung", label: "سامسونگ", query: "Samsung" },
  { value: "xiaomi", label: "شیائومی", query: "Xiaomi" },
  { value: "google", label: "گوگل", query: "Google" },
  { value: "huawei", label: "هوآوی", query: "Huawei" },
  { value: "honor", label: "آنر", query: "Honor" },
  { value: "realme", label: "ریلمی", query: "Realme" },
  { value: "oneplus", label: "وان‌پلاس", query: "OnePlus" },
  { value: "motorola", label: "موتورولا", query: "Motorola" },
  { value: "nokia", label: "نوکیا", query: "Nokia" },
  { value: "nothing", label: "ناتینگ", query: "Nothing" },
  { value: "oppo", label: "اپو", query: "OPPO" },
  { value: "vivo", label: "ویوو", query: "Vivo" },
];

export function findBrand(value: string): Brand | undefined {
  return BRANDS.find((brand) => brand.value === value);
}

export const STORAGE_OPTIONS = [
  { value: "", label: "همه" },
  { value: "64", label: "۶۴ گیگابایت" },
  { value: "128", label: "۱۲۸ گیگابایت" },
  { value: "256", label: "۲۵۶ گیگابایت" },
  { value: "512", label: "۵۱۲ گیگابایت" },
  { value: "1024", label: "۱ ترابایت" },
];

export const COLOR_SUGGESTIONS = [
  "مشکی",
  "سفید",
  "آبی",
  "سبز",
  "قرمز",
  "طلایی",
  "نقره‌ای",
  "خاکستری",
  "بنفش",
  "صورتی",
  "تیتانیوم",
];
