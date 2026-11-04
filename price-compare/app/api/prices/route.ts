import { NextRequest, NextResponse } from "next/server";
import { findBrand } from "@/lib/brands";
import { PROVIDERS } from "@/lib/providers";
import { createCustomProvider } from "@/lib/providers/custom";
import type {
  Offer,
  PricesResponse,
  Provider,
  SearchInput,
  ShopStatus,
} from "@/lib/types";

const TIMEOUT_MS = 9000;
const MAX_CUSTOM_SITES = 4;

interface ProviderRun {
  status: ShopStatus;
  offers: Offer[];
}

function bad(message: string) {
  return NextResponse.json(
    { error: message },
    { status: 400, headers: { "cache-control": "no-store" } },
  );
}

function messageOf(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message;
    if (/abort/i.test(message)) return "پاسخی نداد (۹ ثانیه)";
    if (
      message.startsWith("پاسخ ") ||
      message.includes("ساختار") ||
      message.includes("قیمتی") ||
      message.includes("آدرس")
    ) {
      return message;
    }
  }
  return "خطا در دریافت قیمت";
}

function safeHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "سایت دلخواه";
  }
}

function isValidOffer(offer: Offer): boolean {
  return (
    Number.isFinite(offer.price) &&
    offer.price > 0 &&
    typeof offer.title === "string" &&
    /^https?:\/\//.test(offer.url)
  );
}

function dedupe(offers: Offer[]): Offer[] {
  const seen = new Set<string>();
  const out: Offer[] = [];

  for (const offer of offers) {
    const key = `${offer.shopId}::${offer.url}::${offer.price}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(offer);
  }

  return out;
}

async function runProvider(
  provider: Provider,
  input: SearchInput,
): Promise<ProviderRun> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = Date.now();

  try {
    const raw = await provider.search({ ...input, signal: controller.signal });
    const offers = dedupe(raw.filter(isValidOffer));

    return {
      offers,
      status: {
        id: provider.id,
        label: provider.label,
        status: offers.length ? "ok" : "empty",
        count: offers.length,
        ms: Date.now() - started,
      },
    };
  } catch (error) {
    return {
      offers: [],
      status: {
        id: provider.id,
        label: provider.label,
        status: "error",
        count: 0,
        ms: Date.now() - started,
        message: messageOf(error),
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const model = (params.get("model") ?? "").trim();
  if (!model) return bad("مدل گوشی را وارد کنید.");

  const brand = findBrand((params.get("brand") ?? "").trim());
  const storageRaw = (params.get("storage") ?? "").trim();
  const storageGb = /^\d+$/.test(storageRaw) ? Number(storageRaw) : null;
  const color = (params.get("color") ?? "").trim();

  const selected = new Set(
    (params.get("sites") ?? "").split(",").filter(Boolean),
  );

  const providers: Provider[] = PROVIDERS.filter((provider) =>
    selected.has(provider.id),
  );

  for (const slot of params.getAll("custom").slice(0, MAX_CUSTOM_SITES)) {
    const separator = slot.indexOf("|");
    if (separator < 0) continue;

    const name = slot.slice(0, separator).trim();
    const url = slot.slice(separator + 1).trim();
    if (!url) continue;

    providers.push(
      createCustomProvider(
        `custom-${providers.length + 1}`,
        name || safeHost(url),
        url,
      ),
    );
  }

  if (!providers.length) return bad("حداقل یک فروشگاه انتخاب کنید.");

  const brandQuery = brand?.query ?? "";
  const query = [brandQuery, model, storageGb ? `${storageGb}GB` : ""]
    .filter(Boolean)
    .join(" ");

  const input: SearchInput = {
    brand: brandQuery,
    brandLabel: brand?.label ?? "",
    model,
    storageGb,
    color,
    query,
  };

  const runs = await Promise.all(
    providers.map((provider) => runProvider(provider, input)),
  );

  const offers = runs
    .flatMap((run) => run.offers)
    .sort((a, b) => {
      const stockDelta = Number(a.inStock === false) - Number(b.inStock === false);
      return stockDelta !== 0 ? stockDelta : a.price - b.price;
    });

  const body: PricesResponse = {
    query: {
      brand: brandQuery,
      brandLabel: brand?.label ?? "",
      model,
      storageGb,
      color,
      text: query,
    },
    fetchedAt: new Date().toISOString(),
    offers,
    floor: offers.find((offer) => offer.inStock !== false) ?? offers[0] ?? null,
    shops: runs.map((run) => run.status),
  };

  return NextResponse.json(body, {
    headers: { "cache-control": "no-store" },
  });
}
