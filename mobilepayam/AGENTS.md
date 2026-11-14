<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

> **Picking this up mid-stream? Read `PROGRESS.md` first.** It holds the current
> state, what is verified vs untested, and the next steps. This file holds the
> rules that do not change.

# mobilepayam

Persian (RTL) storefront for phones and accessories, Digikala-inspired.
**Front-end only for now:** no backend, no database. The catalog is a typed
seed plus a `localStorage` store, so the admin panel really edits data and the
shop reflects it immediately.

## Stack & commands

Next.js **16.4.3** (App Router) · React **19.3** · TypeScript 5 · Tailwind **v4**
(via `@tailwindcss/turbopack`, no `postcss.config`, no `tailwind.config`).

Run everything **inside this folder**:

```powershell
npm install
npm run dev          # http://localhost:3000
npx tsc --noEmit     # types
npm run build        # the real gate
```

## Visual source of truth

`../mockups/mobilepayam/digikala.html` + `digikala.css`.

- The two other mockups (`lux.html`, `energetic.html`) were **rejected** — do not
  copy their styling.
- Palette: brand `#ef4056`, canvas `#f5f5f6`, surface white, ink `#3f4064`,
  ink-strong `#23243f`, muted `#81858b`, line `#e4e4e8`.
- Tokens live **only** in `src/app/globals.css` (`@theme`). Do not hard-code
  hex values in components.
- Density matters: compact cards, 8–12px radius, thin borders, red only for
  price/discount/CTA.

## Architecture (no backend)

```
seed data          src/data/catalog.ts        (6 categories, 24 products)
catalog store      src/lib/store.ts           (localStorage + useSyncExternalStore)
cart store         src/lib/cart.ts            (localStorage)
UI                 src/components, src/app
```

- **One catalog store.** Components read through `useCatalog()`; only the store
  imports the seed. Editing a product in `/admin` must update `/shop` without a
  reload (same store instance).
- **Persistence keys are versioned:** `mobilepayam.catalog.v1`,
  `mobilepayam.cart.v1`, `mobilepayam.orders.v1`, `mobilepayam.used.v1`.
  Bump the version when the shape changes; never migrate silently.
- **SSR safety:** render the seed on the server (`getServerSnapshot` = seed) and
  let `useSyncExternalStore` swap to stored data after hydration. Never read
  `localStorage` during render.
- **Orders** are created client-side at checkout with a code like `MP-10482`,
  stored in `localStorage`, and read by `/track` and `/account`.
- **Admin** is real but device-local: CRUD + order statuses, plus a "reset to
  seed" action and a **demo passcode gate** (`ADMIN_DEMO_CODE = "1234"` in
  `src/lib/store.ts`, unlock flag in `mobilepayam.admin.v1`). The gate is
  cosmetic, not security — it runs entirely in the browser. Real auth means a
  server session plus a role check on every mutation.
- **Used phones** are their own collection (`UsedListing`): multiple images,
  optional video (mp4 or YouTube/Aparat), free-text description and specs.
  Images/videos are **URLs** entered in admin; there is no upload/storage. The
  public detail page renders a placeholder when `images` is empty.

## Routes

| Route | Kind | Notes |
| --- | --- | --- |
| `/` | server + client islands | home: slider, categories, featured, offer |
| `/shop` | server shell | filters/sort live in the URL |
| `/shop/[slug]` | dynamic | product detail; variants |
| `/used` | server shell | used-phone listings, filters in the URL |
| `/used/[slug]` | dynamic | gallery, video, description, specs |
| `/cart` | client | qty steppers, coupon |
| `/checkout` | client | address, shipping, gateway **or** SHEBA + receipt upload |
| `/checkout/result` | client | success/failure, order code |
| `/track` | client | order lookup by code |
| `/login` | client | simulated, no real auth |
| `/account` | client | profile + orders |
| `/categories` | server | all categories |
| `/about` | server | story, stats |
| `/faq` | server | FAQ + returns/warranty |
| `/contact` | server | contact details |
| `/admin` | client | products, categories, orders |

## Invariants

1. **Prices are integer Toman.** Format with `toLocaleString("fa-IR")`; no
   decimals, no currency floats.
2. **Quantity always clamps** to `min(stock, MAX_ITEM_QUANTITY)` — 10 — on the
   product page, the cart stepper and any merge path.
3. **Filters are URL state.** Every control writes `searchParams`; there is no
   filter state the URL does not know about.
4. **Variants are first-class:** a product has `variants[]` (color/storage) each
   with its own `price` and `stock`. The card shows the cheapest available one.
5. **Persian numerals in UI**, but phone numbers and IBAN stay LTR (`.ltr`).
6. **localStorage is untrusted input:** parse defensively, fall back to the seed
   on any error.
7. **Images:** `/images/products/*`; when missing, render the shared
   `ProductArt` SVG fallback rather than a broken image.

## Gotchas

- Next 16: `params`/`searchParams` are **Promises**; use generated
  `PageProps<"...">` / `LayoutProps<"...">` types, never hand-written prop types.
- `middleware.ts` is `proxy.ts` here; not needed yet.
- A known repo-wide lint trap: **JSX inside `try/catch`** and `setState` in
  effects are React Compiler errors. Use result objects and derive state.
- `npm run build` does **not** run ESLint; run `npm run lint` separately and
  compare the count against `PROGRESS.md` instead of assuming a regression.
- Images are `unoptimized` in `next.config.ts`; keep files small.
- The seed is the SSR snapshot. If you change `catalog.ts`, users with an old
  `v1` store will not see new products until they reset — bump the key version
  when that matters.

## Verify

```powershell
npx tsc --noEmit
npm run build
```

Smoke routes (dev server): `/`, `/shop`, `/shop/iphone-16-pro-max`, `/cart`,
`/checkout`, `/track`, `/account`, `/admin`, `/categories`, `/about`, `/faq`,
`/contact`.
