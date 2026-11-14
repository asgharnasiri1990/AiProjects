export const MAX_ITEM_QUANTITY = 10;

/** ۹۶۵۰۰۰۰۰ → "۹۶٬۵۰۰٬۰۰۰" */
export function faNum(value: number): string {
  return Math.round(value).toLocaleString("fa-IR");
}

/** 96500000 → "۹۶٬۵۰۰٬۰۰۰ تومان" */
export function toman(value: number): string {
  return `${faNum(value)} تومان`;
}

export function discountPercent(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

export function clampQty(qty: number, stock: number): number {
  return Math.min(MAX_ITEM_QUANTITY, Math.max(0, Math.min(qty, stock)));
}

/** Digits-only normalizer for Persian/Arabic input. */
export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function orderCode(): string {
  return `MP-${Math.floor(10000 + Math.random() * 89999)}`;
}

export function orderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
