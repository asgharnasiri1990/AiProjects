<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# price-compare

Persian (RTL) phone-price comparator for the Iranian market. The user enters a
phone's **brand, model, storage and color**, picks shops, and gets the market
floor price plus a sorted per-shop price list.

**Read `PROGRESS.md` first.** It records what actually exists, what was decided,
and what is next. Do not rebuild what is already there; do not re-open settled
decisions without asking the user.

## Non-negotiables

1. **No fake data, ever.** A shop that fails, times out or changes markup gets a
   `status: "error"` row with a short Persian message. Never substitute demo
   prices, never silently drop the shop, never fall back to hard-coded offers.
2. **No data persistence.** No database, no cookies, no server cache beyond a
   single request, no history. The user chose "بدون ذخیره". The **only**
   exception is `localStorage.theme`, which stores the light/dark choice (see
   `PROGRESS.md` decision 11). Do not store searches, offers or user data.
3. **Persian + RTL only.** `<html lang="fa" dir="rtl">`. All copy is Persian.
4. **Failures stay local.** Adapters may throw (HTTP status, changed markup,
   blocked network). `runProvider` in the route catches each shop separately,
   records `status: "error"` and keeps the rest. No adapter may crash the whole
   request.
5. **One request per shop, with a timeout.** No retry loops, no crawling beyond
   the first results page — the cheapest offer is almost always there.

## Architecture

```
app/
  layout.tsx              root layout: <html lang="fa" dir="rtl">, Vazirmatn
  page.tsx                "use client" search form + results
  globals.css             Tailwind v4 entry + design tokens
  api/prices/route.ts     GET handler; validates params, fans out, normalizes
lib/
  types.ts                SearchInput, Offer, ShopStatus, PricesResponse
  format.ts               digits, price/storage parsing, model matching
  brands.ts               brand/storage/color options for the form
  shops.ts                adapter metadata used by the form checkboxes
  providers/index.ts      registry ([technolife, farnaa])
  providers/technolife.ts __NEXT_DATA__ `results` array
  providers/farnaa.ts     server-rendered HTML cards
  providers/custom.ts     user-supplied URL (JSON-LD / meta / regex)
```

### Data flow

```
form (client)
  → GET /api/prices?brand=&model=&storage=&color=&sites=technolife,farnaa&custom=<name|url>
  → route validates, builds a query string ("Apple iPhone 15 Pro 256GB")
  → Promise.allSettled over selected providers (each isolated + timeout)
  → post-filter offers by storage/color when the title exposes them
  → sort by price asc
  → { query, fetchedAt, floor, offers, shops[] }
```

### Provider contract

```ts
export interface SearchInput {
  brand: string;            // Latin query token ("Apple") — "" = any
  brandLabel: string;       // Persian label for display
  model: string;            // what the user typed
  storageGb: number | null; // null = "همه"
  color: string;            // "" = any
  query: string;            // composed: "Apple iPhone 15 Pro 256GB"
  signal?: AbortSignal;     // aborted by the route after 9s
}

export interface Offer {
  shopId: string;
  shopLabel: string;
  title: string;
  price: number;            // toman, integer
  url: string;              // absolute product/search link
  color?: string;
  colors?: string[];        // every colour label found on the card
  storageGb?: number;
  ramGb?: number;
  origin?: string;
  inStock?: boolean;
}

export interface Provider {
  id: string;
  label: string;
  search(input: SearchInput): Promise<Offer[]>;
}
```

Rules:

- Prices are **toman integers**. Strip `,`, `٬`, `٫`, Persian digits and
  `تومان`/`ریال` before `Number()`.
- `url` must be absolute and open the product (or the shop's search page when
  there is no stable product URL).
- Set `inStock: false` instead of dropping an out-of-stock item when the page
  exposes it; the UI shows it greyed out.
- Adapters live in `lib/providers/<id>.ts` and export a `Provider`. Register in
  `lib/providers/index.ts`; the form's checkbox list is derived from the
  registry, so adding a shop must not require editing the UI.

## Scraping reality (verified 2026-11-04, re-check before trusting)

| Source | Result |
| --- | --- |
| `technolife.com/product/list/search?keywords=` | 200, ~1 MB HTML. `__NEXT_DATA__` → `dehydratedState.queries[].state.data.pages[0].results[]` with `name`, `code`, `normal_price`, `discounted_price`, `available`, `icons[]`. **Working adapter.** Do not use `/search?q=`: it is a JS landing page with unrelated products. |
| `farnaa.com/search?q=` | 200, ~0.8–1.1 MB server-rendered HTML. Products live in `<div class="col-md-3 …">` cells; title in `.title-box a`, price in `.pric ins` (Persian digits), colours in `.wz-matrix-tooltip-text`. **Working adapter.** The `item trs-3` cards are a separate carousel — do not parse those. |
| `digikala.com/search?q=` | 200 but a ~14 KB JS shell; `__NEXT_DATA__` has empty `pageProps`. Not parseable without their API. **Dropped.** |
| `api.digikala.com/v1/search` | Timed out from this network. |
| `torob.com` | Connection refused. |
| `mobile140.com` | TLS `ERR_TLS_CERT_ALTNAME_INVALID`. |
| `pishromobile.com`, `hamrahtel.com` | Connection refused after a few requests. |
| `meghdadit.com` | Search paths return 404. |
| `gooshi.online` | Angular templates (`{{item.price}}`), client-rendered. Not parseable. |

Farnaa gotcha: `<meta name="product_price">` / `<meta name="availability">`
sit **before** the grid cell, so they belong to the previous product. Read price
from `.pric ins` and availability from `ناموجود` inside the card.

Always send a desktop browser `user-agent` and
`accept-language: fa-IR,fa;q=0.9`. Expect markup changes: parsing must be
defensive (optional chaining, `find` + fallbacks) and must return `[]` rather
than throw.

## UI conventions

- Persian numerals in display (`Intl.NumberFormat("fa-IR")`), Latin numerals
  allowed in `input[type=number]` internals.
- RTL rules from the rest of the repo: logical utilities (`ms-`, `me-`, `ps-`,
  `pe-`, `start-`, `end-`, `text-start`), never `left`/`right` for layout; never
  `dir="ltr"` on a block element — isolate numbers with `<bdi>`; no `tracking-*`
  or `uppercase` on Persian text.
- One card per shop, sorted cheapest first, cheapest carries a «ارزان‌ترین» badge.
- The market-floor summary goes above the list: lowest price, shop name, and
  the last-updated time.
- Empty state, per-shop error state and "no offer matched the color/storage"
  state are distinct — do not collapse them into one message.

### Themes

Two themes: **light** (default) and **dark**. `data-theme="dark"` on `<html>`
swaps token values in `globals.css` and nothing else, so every `var(--color-*)`
utility flips at once.

- **Never write `dark:` variants.** They are not wired to this theme.
- The choice lives in `localStorage.theme`. The no-flash script is the first
  child of `<body>` in `app/layout.tsx`; it reads the saved value (or
  `prefers-color-scheme`) before paint and sets `data-theme`.
- The toggle in the header updates `data-theme` and `localStorage.theme`.
- This is the only permitted use of `localStorage`.

## Conventions of this repo

- Next 16 · React 19 · TypeScript · Tailwind v4. No `tailwind.config`; tokens
  live in `globals.css` (`@theme`).
- `next.config.ts` mirrors the other apps: `cacheComponents: true`,
  `partialPrefetching: true`, Turbopack CSS rule for `@tailwindcss/turbopack`.
- `params`/`searchParams` are Promises; route props are generated types.
- `middleware.ts` is `proxy.ts` in this version (not needed here).
- PowerShell on Windows. Do not reformat files you were not asked to change.

## Verify

Run inside `price-compare/`:

```powershell
npx next typegen
npx tsc --noEmit
npm run build
```

Smoke test with a dev server: search a model that exists on Technolife and
confirm the floor, the sorted rows, and that a deliberately bad custom URL
produces an error row — not a crash and not a fake price.

## Update PROGRESS.md before you finish

Every agent session must append to `PROGRESS.md`:

- move finished items in the status table,
- add any new decision with its date and reason,
- record new scraping findings (URL, status, what broke),
- leave a one-line log entry.

That file is how the next agent avoids starting from zero.
