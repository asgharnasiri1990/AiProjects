import { decodeEntities, parsePrice, stripTags } from "../format";
import type { Offer, Provider, SearchInput } from "../types";

const HEADERS: Record<string, string> = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "accept-language": "fa-IR,fa;q=0.9,en;q=0.6",
  accept: "text/html,application/xhtml+xml",
};

interface Candidate {
  title: string;
  price: number;
  url: string;
}

/** Block obvious SSRF targets: only http(s) and no loopback/private hosts. */
function assertSafeUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("آدرس معتبر نیست");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("فقط آدرس http یا https مجاز است");
  }

  const host = url.hostname.toLowerCase();
  const isPrivate =
    host === "localhost" ||
    host === "::1" ||
    host.endsWith(".local") ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host);

  if (isPrivate) throw new Error("آدرس‌های داخلی مجاز نیستند");

  return url;
}

function withQuery(template: string, query: string): string {
  if (template.includes("{q}")) {
    return template.replaceAll("{q}", encodeURIComponent(query));
  }
  return template;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [value];
}

function typeOf(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const type = (value as Record<string, unknown>)["@type"];
  return asArray(type).join(" ").toLowerCase();
}

function candidateFromProduct(value: unknown): Candidate | null {
  if (!value || typeof value !== "object") return null;
  const product = value as Record<string, unknown>;
  if (!typeOf(product).includes("product")) return null;

  const title =
    typeof product.name === "string" ? decodeEntities(product.name) : "";

  for (const offer of asArray(product.offers)) {
    if (!offer || typeof offer !== "object") continue;
    const record = offer as Record<string, unknown>;
    const price = parsePrice(
      (record.price as string | number | undefined) ??
        (record.lowPrice as string | number | undefined) ??
        (record.highPrice as string | number | undefined),
    );
    if (!price) continue;

    const url =
      typeof record.url === "string"
        ? record.url
        : typeof product.url === "string"
          ? product.url
          : "";

    return { title, price, url };
  }

  return null;
}

function collectJsonLd(node: unknown, out: Candidate[], depth = 0): void {
  if (!node || typeof node !== "object" || depth > 12) return;

  if (Array.isArray(node)) {
    for (const child of node) collectJsonLd(child, out, depth + 1);
    return;
  }

  const product = candidateFromProduct(node);
  if (product) {
    out.push(product);
    return;
  }

  for (const child of Object.values(node as Record<string, unknown>)) {
    collectJsonLd(child, out, depth + 1);
  }
}

function readJsonLd(html: string): Candidate[] {
  const out: Candidate[] = [];

  for (const match of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      collectJsonLd(JSON.parse(match[1]), out);
    } catch {
      // A malformed block is normal; skip it.
    }
  }

  return out;
}

function readPageTitle(html: string): string {
  const og = html.match(
    /<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i,
  )?.[1];
  if (og) return decodeEntities(og);

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title ? stripTags(title) : "";
}

function readMetaPrice(html: string): number | null {
  const patterns = [
    /<meta[^>]+property="product:price:amount"[^>]+content="([^"]*)"/i,
    /<meta[^>]+property="og:price:amount"[^>]+content="([^"]*)"/i,
    /<meta[^>]+itemprop="price"[^>]+content="([^"]*)"/i,
    /<meta[^>]+name="product_price"[^>]+content="([^"]*)"/i,
  ];

  for (const pattern of patterns) {
    const price = parsePrice(html.match(pattern)?.[1]);
    if (price) return price;
  }

  return null;
}

function readTextPrice(html: string): number | null {
  const text = stripTags(html);
  const match = text.match(/([0-9۰-۹][0-9۰-۹,٬\s]{5,})\s*(?:تومان|ریال)/);
  return parsePrice(match?.[1]);
}

function bestCandidate(html: string, pageUrl: string): Candidate | null {
  const title = readPageTitle(html);
  const candidates = readJsonLd(html);

  const metaPrice = readMetaPrice(html);
  if (metaPrice) candidates.push({ title, price: metaPrice, url: pageUrl });

  if (!candidates.length) {
    const textPrice = readTextPrice(html);
    if (textPrice) candidates.push({ title, price: textPrice, url: pageUrl });
  }

  if (!candidates.length) return null;

  return candidates
    .map((candidate) => ({
      ...candidate,
      url: candidate.url || pageUrl,
    }))
    .sort((a, b) => a.price - b.price)[0];
}

/**
 * A user-supplied site. The URL may contain `{q}`, which is replaced with the
 * encoded search query; without it the page is fetched as-is. One site yields
 * one offer (the cheapest price found on that page).
 */
export function createCustomProvider(
  id: string,
  label: string,
  template: string,
): Provider {
  return {
    id,
    label,
    async search(input: SearchInput) {
      const target = assertSafeUrl(withQuery(template, input.query));

      const response = await fetch(target, {
        signal: input.signal,
        headers: HEADERS,
        cache: "no-store",
        redirect: "follow",
      });

      if (!response.ok) throw new Error(`پاسخ ${response.status}`);

      const html = await response.text();
      const candidate = bestCandidate(html, response.url || target.toString());
      if (!candidate) throw new Error("قیمتی در صفحه پیدا نشد");

      const offer: Offer = {
        shopId: id,
        shopLabel: label,
        title: candidate.title || label,
        price: candidate.price,
        url: candidate.url,
        inStock: true,
      };

      return [offer];
    },
  };
}
