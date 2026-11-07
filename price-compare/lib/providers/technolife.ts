import {
  detectColor,
  detectOrigin,
  decodeEntities,
  matchesModel,
  parsePrice,
  parseRamGb,
  parseStorageGb,
  looksLikePhone,
} from "../format";
import type { Offer, Provider, SearchInput } from "../types";

const BASE = "https://www.technolife.com";

const HEADERS: Record<string, string> = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "accept-language": "fa-IR,fa;q=0.9,en;q=0.6",
  accept: "text/html,application/xhtml+xml",
};

interface TechnoIcon {
  font?: string;
  value?: string;
}

interface TechnoProduct {
  name?: string;
  code?: string;
  normal_price?: number;
  discounted_price?: number | null;
  available?: number;
  icons?: TechnoIcon[];
}

function readNextData(html: string): unknown {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function isProduct(value: unknown): value is TechnoProduct {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.name === "string" &&
    (typeof record.normal_price === "number" ||
      typeof record.discounted_price === "number")
  );
}

/** Walk the dehydrated state and find the `results` array of the search query. */
function findProducts(root: unknown): TechnoProduct[] {
  const stack: unknown[] = [root];
  const seen = new Set<unknown>();
  let guard = 0;

  while (stack.length && guard++ < 100_000) {
    const node = stack.pop();
    if (!node || typeof node !== "object" || seen.has(node)) continue;
    seen.add(node);

    if (Array.isArray(node)) {
      for (const child of node) stack.push(child);
      continue;
    }

    const record = node as Record<string, unknown>;

    if (Array.isArray(record.results) && record.results.some(isProduct)) {
      return record.results.filter(isProduct);
    }

    for (const child of Object.values(record)) stack.push(child);
  }

  return [];
}

/** Map numeric product id -> real href, e.g. 70016 -> /product-70016/slug. */
function readProductHrefs(html: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const match of html.matchAll(/href="(\/product-(\d+)\/[^"?#]*)/g)) {
    if (!map.has(match[2])) map.set(match[2], match[1]);
  }
  return map;
}

function storageFromIcons(icons: TechnoIcon[] | undefined): number | undefined {
  if (!icons) return undefined;
  for (const icon of icons) {
    if (!icon.value) continue;
    if (icon.font && /hard-disk|hdd|storage/i.test(icon.font)) {
      return parseStorageGb(icon.value) ?? undefined;
    }
  }
  return undefined;
}

function toOffer(
  product: TechnoProduct,
  hrefs: Map<string, string>,
  input: SearchInput,
): Offer | null {
  const title = decodeEntities(product.name ?? "");
  if (!title) return null;
  if (!looksLikePhone(title)) return null;
  if (!matchesModel(title, input.model)) return null;

  const price = parsePrice(
    product.discounted_price && product.discounted_price > 0
      ? product.discounted_price
      : product.normal_price,
  );
  if (!price) return null;

  const storageGb =
    storageFromIcons(product.icons) ?? parseStorageGb(title) ?? undefined;

  if (input.storageGb != null && storageGb !== input.storageGb) return null;

  const digits = (product.code ?? "").replace(/\D/g, "");
  const href = digits ? hrefs.get(digits) : undefined;
  const url = href
    ? `${BASE}${href}`
    : digits
      ? `${BASE}/product-${digits}`
      : `${BASE}/product/list/search?keywords=${encodeURIComponent(input.query)}`;

  const color = detectColor(title);

  return {
    shopId: "technolife",
    shopLabel: "تکنولایف",
    title,
    price,
    url,
    color,
    colors: color ? [color] : undefined,
    storageGb,
    ramGb: parseRamGb(title) ?? undefined,
    origin: detectOrigin(title),
    inStock: (product.available ?? 0) > 0,
  };
}

export const technolife: Provider = {
  id: "technolife",
  label: "تکنولایف",
  async search(input) {
    const url = `${BASE}/product/list/search?keywords=${encodeURIComponent(input.query)}`;
    const response = await fetch(url, {
      signal: input.signal,
      headers: HEADERS,
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`پاسخ ${response.status}`);

    const html = await response.text();
    const products = findProducts(readNextData(html));

    if (!products.length) throw new Error("ساختار صفحه تغییر کرده است");

    const hrefs = readProductHrefs(html);
    return products
      .map((product) => toOffer(product, hrefs, input))
      .filter((offer): offer is Offer => offer !== null);
  },
};
