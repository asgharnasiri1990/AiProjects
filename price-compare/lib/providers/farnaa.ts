import {
  decodeEntities,
  detectOrigin,
  matchesModel,
  normalize,
  parsePrice,
  parseRamGb,
  parseStorageGb,
  looksLikePhone,
  stripTags,
} from "../format";
import type { Offer, Provider, SearchInput } from "../types";

const BASE = "https://www.farnaa.com";

const HEADERS: Record<string, string> = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  "accept-language": "fa-IR,fa;q=0.9,en;q=0.6",
  accept: "text/html,application/xhtml+xml",
};

/**
 * Split the server-rendered list into one HTML chunk per product card.
 * Search results live in `col-md-3` grid cells; the `item trs-3` cards are a
 * separate carousel further down the page.
 */
function splitCards(html: string): string[] {
  const starts = [...html.matchAll(/<div class="col-md-3[^"]*"/g)];
  return starts.map((match, index) => {
    const start = match.index ?? 0;
    const end = starts[index + 1]?.index ?? html.length;
    return html.slice(start, end);
  });
}

function toOffer(chunk: string, input: SearchInput): Offer | null {
  const titleMatch = chunk.match(
    /class="title-box[^"]*"[\s\S]{0,200}?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/,
  );
  if (!titleMatch) return null;

  const href = decodeEntities(titleMatch[1]);
  const title = stripTags(titleMatch[2]);
  if (!title) return null;
  if (!looksLikePhone(title)) return null;
  if (!matchesModel(title, input.model)) return null;

  const priceMatch = chunk.match(
    /class="pric[^"]*"[\s\S]{0,300}?<ins[^>]*>([\s\S]*?)<\/ins>/,
  );
  const price = priceMatch ? parsePrice(stripTags(priceMatch[1])) : null;
  if (!price) return null;

  const storageGb = parseStorageGb(title) ?? undefined;
  if (input.storageGb != null && storageGb !== input.storageGb) return null;

  const colors = [
    ...new Set(
      [...chunk.matchAll(/wz-matrix-tooltip-text[^>]*>([^<]+)</g)].map((m) =>
        decodeEntities(m[1]),
      ),
    ),
  ].filter(Boolean);

  const requested = normalize(input.color);
  const matchedColor = requested
    ? colors.find((color) => normalize(color).includes(requested))
    : undefined;

  // Card meta tags sit just before the grid cell, so they belong to the next
  // product. Read availability from this card's own markup instead.
  const inStock = !/ناموجود/.test(chunk);

  const url = href.startsWith("http") ? href : `${BASE}${href}`;

  return {
    shopId: "farnaa",
    shopLabel: "فرنا",
    title,
    price,
    url,
    color: matchedColor ?? colors[0],
    colors: colors.length ? colors : undefined,
    storageGb,
    ramGb: parseRamGb(title) ?? undefined,
    origin: detectOrigin(title),
    inStock,
  };
}

export const farnaa: Provider = {
  id: "farnaa",
  label: "فرنا",
  async search(input) {
    const url = `${BASE}/search?q=${encodeURIComponent(input.query)}`;
    const response = await fetch(url, {
      signal: input.signal,
      headers: HEADERS,
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`پاسخ ${response.status}`);

    const html = await response.text();
    const cards = splitCards(html);
    if (!cards.length) throw new Error("ساختار صفحه تغییر کرده است");

    return cards
      .map((chunk) => toOffer(chunk, input))
      .filter((offer): offer is Offer => offer !== null);
  },
};
