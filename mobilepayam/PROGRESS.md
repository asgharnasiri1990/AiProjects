# PROGRESS — mobilepayam

> Read this first when picking the project up. `AGENTS.md` has the rules; this
> file has the state, the decisions and what to do next.
> Last updated: 2026-11-14

## Locked decisions (do not reopen without the owner)

| Area | Decision |
| --- | --- |
| Visual direction | **Digikala style** — `../mockups/mobilepayam/digikala.html` |
| Backend | **None for v1** — front-end + sample data |
| Admin | **Real CRUD**, persisted in `localStorage` (device-local) |
| Payment | Simulated gateway **and** SHEBA transfer + receipt upload |
| Auth | Guest checkout + optional simulated login |
| Catalog | 6 categories / 24 products |
| Variants | Color & storage, each with its own price and stock |
| Images | Generated photos for flagship products + graphic fallback |
| Shipping | Tehran courier 89,000 / Tipax 145,000 / pickup free / free over 5,000,000 |
| Language | Persian only (RTL); copy centralized for a later English version |
| Location | `D:\0Term3-github\AiProjects\mobilepayam` |

The rejected mockups (`lux.html`, `energetic.html`) stay only as history.

## Current state

**Done and verified**

- Scaffold: Next 16.4.3, React 19.3, Tailwind v4, tokens in `globals.css`
- Layout, sticky header with red strip + mega menu, footer
- `src/data/catalog.ts` — 6 categories / 24 products with variants and specs
- `src/lib/store.ts` — versioned localStorage stores (catalog, orders, user,
  coupon) on `useSyncExternalStore`, seed as server snapshot
- `src/lib/cart.ts` — cart with stock/10 clamps; `useResolvedCart`
- `src/lib/shipping.ts` — methods, free-over-5M rule
- All 14 routes: `/`, `/shop`, `/shop/[slug]`, `/cart`, `/checkout`,
  `/checkout/result`, `/track`, `/login`, `/account`, `/categories`, `/about`,
  `/faq`, `/contact`, `/admin`
- Admin: product add/edit/delete, category add/delete, order status,
  reset-to-seed — all persisted and reflected in the shop immediately
- Admin demo gate: passcode screen (`1234`, hint shown), unlock persisted in
  `mobilepayam.admin.v1`, "قفل پنل" button to lock again. Not security.
- Used phones: `/used` (brand/condition/sort filters) and `/used/[slug]`
  (gallery, video, description, specs, contact CTA); 5 seeded listings.
- Used admin: add/edit/delete listings with multiple image URLs, a video URL
  (mp4 or YouTube/Aparat) and descriptions; persisted in `mobilepayam.used.v1`.
- Checkout: address + shipping + gateway **or** SHEBA with receipt upload;
  order is created, cart cleared, result page shows the code
- Track: order code lookup with a 4-step timeline (seed orders MP-10482 and
  MP-310 work as demos)
- Account: simulated login, order list, sign-out
- FAQ (with returns section), about, contact, 404

**Not done / blocked**

- **Product photos:** still not wired. Three sources were tried on 2026-11-14:
  - Digikala API/CDN — search/product endpoints return 404 to non-browser
    clients (WAF); the site HTML does not embed product data.
  - Wikimedia Commons — downloads worked but the matches were unusable as
    product shots (hands, boxes, other brands, screen close-ups); all were
    deleted, `public/images/products/` is empty.
  - The image-generation tool still reports `quota exceeded` (free tier,
    retry ~2026-11-15).

  Until then every product renders the `ProductArt` line-art fallback. The
  admin "آدرس تصویر" field and `public/images/products/` both work as soon as
  real files exist. Used listings already accept image/video URLs.
- Real IBAN / brand details: checkout shows the placeholder
  `IR000000000000000000000000` (owner `mobilepayam`, bank ملت).
- Nothing is committed yet; `shop/`, `myportfolio3/` etc. are untouched.

## Verification log

| Check | Result |
| --- | --- |
| `npm run build` | ✅ 15 routes, TypeScript passed |
| `npm run lint` | ✅ 0 problems |
| `npx tsc --noEmit` | ✅ |
| Home renders (10 featured cards, no console errors) | ✅ |
| Add to cart from card and product page → header badge | ✅ |
| Shop filter `?cat=mobile` → 6 products | ✅ |
| Admin add product → 25 items in `localStorage` + visible in `/shop?q=` | ✅ |
| Admin delete product → 24 items persisted | ✅ |
| Mega menu opens (560px, 2 columns) | ✅ |
| Checkout gateway → order code, cart cleared, result page | ✅ |
| Checkout SHEBA → IBAN panel + blocks submit without receipt | ✅ |
| Track `MP-10482` → shipped timeline | ✅ |
| Admin gate: wrong code rejected, `1234` unlocks, "قفل پنل" locks again | ✅ |
| `/used` renders 5 listings, brand/condition filters | ✅ |
| Used detail renders specs + `tel:` CTA | ✅ |
| Admin used: listing with image URL + mp4 → detail shows `<img>` and `<video>` | ✅ |
| Nav hydration mismatch on `/used` fixed (active state after hydration only) | ✅ |

Dev server: **port 3000 is occupied by `myportfolio3` (`next start`)** on this
machine, so mobilepayam runs on **3001** (`npx next dev -p 3001`). If 3000 is
free, plain `npm run dev` picks it.

## Next steps

1. Product photos: retry the image tool after the quota resets (~2026-11-15),
   **or** drop the owner's files into `public/images/products/` and set `image`
   per product (admin field or seed). Do not scrape Digikala/Wikimedia again —
   both produced unusable results. Used listings already accept image/video
   URLs and need no code change.
2. Replace the placeholder IBAN + brand contact details with real values.
3. Optional polish: product reviews section, wishlist, search suggestions,
   coupon persistence already works.
4. Commit on a branch or `main` (owner has not approved a commit yet).

## Known issues / TODOs

- Vazirmatn loads from jsDelivr; **self-host before launch**.
- Receipt images are previewed with an object URL and **not persisted**; the
  order keeps only `receiptName`. Cap/serialize if uploads must survive reload.
- Admin has a **cosmetic** passcode gate only (`1234`, client-side). Anyone can
  bypass it; it exists to stop accidental access, not attackers. Real
  protection requires the backend.
- The seed is the SSR snapshot; changing `catalog.ts` does not update existing
  `v1` stores — bump the storage key when that matters.
- Product page metadata is generated from the seed only; admin-created products
  get the default title (page still renders).
- `Paid` exists in `OrderStatus` for legacy reasons; the UI maps it to
  «پرداخت شده».

## Backlog (post-v1)

- Real backend + database, real orders and users
- Real payment gateway (Zarinpal) and receipt review by an admin
- Auth (OTP), server-side admin permissions
- Search engine, reviews, wishlist, compare
- English version / i18n
- Analytics, sitemap, structured data

## File map (current)

```
mobilepayam/
  src/app/               routes listed above
  src/components/        site-header, site-footer, product-card,
                         product-art, quantity-stepper
  src/data/catalog.ts    seed + selectors (minPrice, totalStock, defaultVariant)
  src/lib/               store.ts, cart.ts, shipping.ts, format.ts, types.ts, ui.ts
  public/images/         (empty until product photos exist)
  ../mockups/mobilepayam/ design references
```
