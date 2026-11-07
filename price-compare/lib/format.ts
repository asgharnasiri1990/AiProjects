const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Convert Persian/Arabic-Indic digits to ASCII so regexes and Number() work. */
export function toLatinDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
  "&shy;": "",
  "&#x200c;": "\u200c",
  "&#x200b;": "",
  "&zwnj;": "\u200c",
};

export function decodeEntities(input: string): string {
  return input
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp|shy|#x200c|#x200b|zwnj);/gi, (m) => {
      return ENTITIES[m.toLowerCase()] ?? m;
    })
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripTags(input: string): string {
  return decodeEntities(input.replace(/<[^>]*>/g, " "));
}

/** Lowercase, unify Arabic/Persian letters, drop ZWNJ and diacritics. */
export function normalize(input: string): string {
  return toLatinDigits(input)
    .toLowerCase()
    .replace(/[\u064a\u0649]/g, "ی")
    .replace(/\u0643/g, "ک")
    .replace(/[\u200c\u200e\u200f]/g, " ")
    .replace(/[\u064b-\u0652]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse a toman price from text such as "۳۱۸,۹۹۹,۰۰۰ تومان". */
export function parsePrice(raw: string | number | null | undefined): number | null {
  if (typeof raw === "number") {
    return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : null;
  }
  if (!raw) return null;

  const cleaned = toLatinDigits(raw).replace(/[٬,،\s]/g, "");
  const match = cleaned.match(/(\d{4,})(?:\.\d+)?/);
  if (!match) return null;

  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : null;
}

/**
 * Storage in GB. A phone title mentions RAM and storage in the same string
 * ("رم ۸ و ظرفیت ۲۵۶ گیگابایت"), so take the largest GB/TB value.
 */
export function parseStorageGb(text: string): number | null {
  const source = toLatinDigits(text);

  // Titles often write "ظرفیت ۲۵۶ رم ۱۲ گیگابایت": the capacity has no unit of
  // its own, so read it first and treat a unit-less value as GB.
  const capacity = source.match(
    /(?:ظرفیت|حافظه(?:\s*داخلی)?)\s*[:：]?\s*(\d+(?:\.\d+)?)\s*(ترابایت|TB|گیگابایت|گیگ|GB|مگابایت|MB)?/i,
  );

  if (capacity) {
    const amount = Number(capacity[1]);
    const unit = (capacity[2] ?? "").toLowerCase();
    const isMb = unit === "مگابایت" || unit === "mb";

    if (Number.isFinite(amount) && amount > 0 && !isMb) {
      const gb = unit === "ترابایت" || unit === "tb" ? amount * 1024 : amount;
      if (gb >= 16) return Math.round(gb);
    }
  }

  const values: number[] = [];

  for (const match of source.matchAll(
    /(\d+(?:\.\d+)?)\s*(ترابایت|ترا|TB|گیگابایت|گیگ|GB)/gi,
  )) {
    const amount = Number(match[1]);
    if (!Number.isFinite(amount) || amount <= 0) continue;
    const unit = match[2].toLowerCase();
    const isTb = unit === "ترابایت" || unit === "ترا" || unit === "tb";
    values.push(Math.round(isTb ? amount * 1024 : amount));
  }

  if (!values.length) return null;
  const largest = Math.max(...values);
  return largest >= 16 ? largest : null;
}

export function parseRamGb(text: string): number | null {
  const match = toLatinDigits(text).match(/(?:رم|RAM)\s*[:：]?\s*(\d+)/i);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : null;
}

const ORIGINS: Array<[RegExp, string]> = [
  [/ویتنام/, "ویتنام"],
  [/امارات/, "امارات"],
  [/هند\b/, "هند"],
  [/چین/, "چین"],
  [/CH\/A/i, "چین"],
  [/ZA\/A/i, "ZA"],
  [/LL\/A/i, "آمریکا"],
];

export function detectOrigin(title: string): string | undefined {
  for (const [pattern, label] of ORIGINS) {
    if (pattern.test(title)) return label;
  }
  return undefined;
}

const COLOR_WORDS = [
  "مشکی",
  "سفید",
  "آبی",
  "سبز",
  "قرمز",
  "طلایی",
  "نقره‌ای",
  "نقره ای",
  "خاکستری",
  "بنفش",
  "صورتی",
  "تیتانیوم",
  "کرم",
  "زرد",
  "نارنجی",
  "قهوه‌ای",
];

export function detectColor(title: string): string | undefined {
  const normalized = normalize(title);
  return COLOR_WORDS.find((word) => normalized.includes(normalize(word)));
}

/** Family/brand words that carry no model identity inside a product title. */
const MODEL_STOPWORDS = new Set([
  "galaxy",
  "apple",
  "samsung",
  "xiaomi",
  "phone",
  "mobile",
  "گوشی",
  "مدل",
  "5g",
  "4g",
  "lte",
]);

export function matchesModel(title: string, model: string): boolean {
  const normalized = normalize(model).split(" ").filter(Boolean);
  const tokens = normalized.filter((token) => !MODEL_STOPWORDS.has(token));
  const required = tokens.length ? tokens : normalized;
  if (!required.length) return true;

  const haystack = normalize(title);
  return required.every((token) => haystack.includes(token));
}

const ACCESSORY_START =
  /^(قاب|کاور|گلس|محافظ|شارژر|کابل|هدفون|هندزفری|پاوربانک|ساعت|مچ‌بند|مچ بند|آداپتور|تبلت|لپ‌تاپ|لپ تاپ|کتاب|کیف)/;

const PHONE_HINT = /گوشی|\b(iphone|galaxy|redmi|pixel|poco|honor|reno|mate|oneplus)\b/i;

export function looksLikePhone(title: string): boolean {
  const trimmed = title.trim();
  if (ACCESSORY_START.test(trimmed)) return false;
  return PHONE_HINT.test(trimmed);
}

export function faNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export function formatTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
