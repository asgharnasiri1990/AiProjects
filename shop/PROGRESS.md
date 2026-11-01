# DigitalShop — progress & handoff

> Handoff note for whoever picks this up next. **Read this first, then `AGENTS.md`.**
> `AGENTS.md` explains how the app works; this file explains *where the work stands*.

**Last updated:** 2026-11-01
**State:** clean tree at `fe37e1a`. Redesign **Phase 1 shipped**, Phase 2 queued.

---

## TL;DR

A batch of correctness + API-traffic fixes is **done, built, smoke-tested and committed**
(`3421519`), but **not tested through a real login/checkout**. Redesign Phase 1
(ink tokens, pill primitives, DigitalShop brand) is committed as `fe37e1a`. The app is a
clean, working Next 16 storefront; nothing here is half-finished or broken.

Next sensible action: **implement Phase 2** (masonry grid + product card), then decide on
the lint backlog (§6). `flight-tracker/` is out of scope for now.

---

## 0. Redesign track (Pinterest-inspired) — in progress

Plan approved 2026-11-01. Decisions locked by the user:

1. **Brand → `DigitalShop`** (the app previously used three names).
2. **Black CTAs, Pinterest red `#E60023` for hearts only** — violet removed entirely.
3. **Home page becomes a discovery feed** (Phase 6).
4. **Product cards show name + price + tiny category** — no description.
5. **One phase at a time**, pausing for review after each.

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Design tokens + UI primitives + brand rename | ✅ **done · `fe37e1a`** |
| 2 | Masonry grid + new product card | ✅ **done — awaiting review** |
| 3 | Header, search pill, category nav | ✅ **done — awaiting review** |
| 4 | Favorites (localStorage) + `/favorites` | ✅ **done — awaiting review** |
| 5 | Product detail page redesign | ✅ **done — awaiting review** |
| 6a | Home discovery feed | ✅ **done — awaiting review** |
| 6b | Cart / checkout / account visual alignment | not started |
| 7 | Responsive/a11y/perf pass + docs | planned |

Phase 1 touched: `globals.css` (ink ramp replaces violet, `--color-canvas` `#FAF9F6`,
`--color-accent-*` red), `ui/button.tsx` (pill radius, ink primary, new secondary),
`ui/badge.tsx`, `ui/input.tsx` (`rounded-xl`, ink focus ring), `ui/skeleton.tsx`,
plus the brand rename in `layout.tsx`, `login/page.tsx`, `signup/page.tsx`,
`site-footer.tsx`, `README.md`. **No layout or logic changed.**

Verified: `tsc` clean, `npm run build` exit 0, computed styles in the browser
(body `rgb(250,249,246)`, ink `rgb(28,27,25)` for logo/cart badge), dark mode
(`rgb(14,14,13)`), `<title>` now `Shop | DigitalShop`.

Phase 2 touched: **new** `lib/aspect.ts` (stable slug-hashed ratios, 1:1 → 5:6),
**new** `components/masonry-grid.tsx` (CSS columns 2/3/4 + `break-inside-avoid`),
rewritten `components/product-card.tsx` (edge-to-edge image, hover zoom/lift,
category + name + price, white out-of-stock pill), `ui/skeleton.tsx` (masonry-shaped
skeleton), `app/shop/page.tsx` (grid container swap only), `app/shop/loading.tsx`.
Verified live: 12 cards, 3 columns, heights `556/439/439/527/…`, filters and sorting
still drive the URL (`?category=books&sort=price` → 4 cards, ascending prices).

Note: multi-column fills **down** each column, so visual order ≠ DOM order (tab order
stays correct). Accepted trade-off — see §6.

Phase 3 touched: **new** `components/search-bar.tsx` (URL-driven `?q=` pill, 400ms
debounce, works from any page) and **new** `components/category-nav.tsx` (chip row driving
`?category=`, count in each chip); `components/shop-filters.tsx` slimmed to sort / in-stock /
price (search and chips moved out, "Clear all" still resets everything);
`components/site-header.tsx` restructured (search inline on `lg+`, own row below on
smaller screens); `app/shop/page.tsx` + `app/shop/loading.tsx` updated to match.

Verified live: `?q=USB` → 4 cards, `?q=watch` → empty state, category click →
`?category=books` + 4 cards + active chip, "Clear all" → `/?` back to 24 cards, zero
console errors, `tsc` + build clean. Note: the DOM contains extra hidden `<div id="S:n">`
nodes — those are Next's streamed Suspense containers, not duplicated UI.

Phase 4 touched: **new** `context/favorites-context.tsx` (device-local wishlist stored as
full `Product` snapshots under `toman-shop.favorites.v1`, capped at 100, built on
`useSyncExternalStore` so SSR/hydration can't mismatch and other tabs stay in sync),
**new** `components/favorite-button.tsx` (`aria-pressed` heart, red only when saved),
**new** `app/favorites/` (masonry of saved pins + empty state + clear all),
`components/icons.tsx` (+`HeartIcon`), `product-card.tsx` (heart is a **sibling** of the
link, never nested in the anchor), `providers.tsx`, `site-header.tsx` (heart link + red
count badge).

Verified live: save → `aria-pressed` flips, header shows "Saved items, 1", localStorage
holds the snapshot; `/favorites` renders the pin after reload (persistence); un-saving
empties the list and writes `[]`. No console errors, `tsc` + build clean.

Lint side-effect: restructuring `app/shop/page.tsx` (data loading in a helper, rendering
outside any `try/catch`) dropped the repo from **24 → 8 problems (6 errors, 2 warnings)**.

Phase 5 touched: `app/shop/[id]/page.tsx` (two-column layout on `lg`, sticky buy panel,
image on a rounded card, badges/price/description re-spaced), `components/add-to-cart-panel.tsx`
(restyled only — identical add logic, full-width button, quantity row, "View cart" affordance),
`components/favorite-button.tsx` (new `showLabel` "Save / Saved" pill), `ui/quantity-selector.tsx`
(pill shape), `app/shop/[id]/loading.tsx` (matches the new layout).

Verified live: product 24 renders title/price/badges/quantity group; Save pill flips to
"Saved" with `aria-pressed` and the header count updates; un-saving restores `[]`.
`generateMetadata`, `notFound()` handling and the max-10 clamp are unchanged.

Phase 6a touched: **new** `lib/catalog.ts` (`loadCatalog()` — the shared, non-throwing
catalogue loader now used by both `/` and `/shop`), `app/page.tsx` rewritten as a
discovery feed (compact intro, category chips, 12-pin masonry, "Browse all products"),
`app/shop/page.tsx` now imports the shared loader instead of its local copy.

Verified live: `/` → 12 cards, 6 chips, 3 columns, CTA present, title
`Discover | DigitalShop` (the root page is in the layout's own segment, so `title.template`
does not apply — set with `title: { absolute }`), zero console errors.

Still pending in this phase: **6b** — cart / checkout / account still use the older
`rounded-2xl border` card style; they inherit the ink tokens but not the borderless
`rounded-3xl` card language yet.

---

## 1. Fix batch — commit `3421519` (6 files, all in `shop/`)

| File | Change | Verified |
| --- | --- | --- |
| `src/app/checkout/checkout-view.tsx` | Success card counts `order.items` instead of the emptied cart | build only |
| `src/context/cart-context.tsx` | `syncGuestCart()` keeps only failed merge lines; `reload()` syncs before GET; `setQuantity` uses `cap()` | build only |
| `src/lib/api.ts` | `apiFetch` gained optional `revalidate` (sets `next.revalidate` **or** `cache: "no-store"`, never both); `/categories` cached 300s | ✅ runtime |
| `src/lib/session.ts` | `getSessionUser` wrapped in `React.cache` | build only |
| `src/app/shop/[id]/page.tsx` | `getProductOnce = cache((id) => getProduct(id))`; corrected a wrong comment about 404 status | ✅ runtime |
| `src/proxy.ts` | matcher → `["/account/:path*", "/checkout/:path*"]` | ✅ runtime |
| `AGENTS.md` | added `## DigitalShop` section below the auto-generated block | n/a |

`git status` also shows an untracked root `../AGENTS.md` (repo-level, covers both apps).
Scope was narrowed to `shop/` — delete it if you don't want it.

## 2. Why these changes (the bug list)

1. **Checkout showed "Items: 0"** — the cart is emptied right after the order is created,
   and the success card read `totalItems` from it. Fixed by summing `order.items`.
2. **Guest cart could silently vanish** — the login merge swallowed every error and then
   cleared localStorage unconditionally. Now failures are retained and retried.
3. **Quantity clamp** — `current.stock || 10` treated stock `0` as a cap of `10`.
4. **Duplicate API calls** — `getSessionUser` ran in both layout and page; the product was
   fetched by both `generateMetadata` and the body. Both now memoized with `React.cache`.
5. **Category churn** — `/categories` now cached for 300s (was fetched on every page view).
6. **Guard gap** — exact-match matchers left future `/account/*` routes unprotected.
7. **False comment** — the product page claimed `notFound()` produced a real 404. It does
   not (see `AGENTS.md` gotcha #5).

## 3. Evidence collected

- `npx tsc --noEmit` → clean.
- `npm run build` → passes; 18 routes + `ƒ Proxy (Middleware)`.
- ESLint → **24 problems (21 errors, 3 warnings)**, identical before and after the change
  (measured with `git stash`), i.e. **no regressions**.
- Live (production `npm start` on port 3100, since stopped):
  - `/shop` → 200 with 24 real products / 5 categories
  - `/shop/24` → 200; `/shop/99999` → 200 with 404 UI + `noindex` (expected, see gotcha)
  - `/account` → `307 /login?next=%2Faccount`
  - `/account/orders` → `307 /login?next=%2Faccount%2Forders` ← proves new matcher
- Categories caching: exactly **1** entry in `.next/cache/fetch-cache` after a request that
  made 2 upstream calls — only the `revalidate` fetch persists.

## 4. **Not** verified — do this before trusting the batch

- **Guest → login cart merge** (`cart-context.tsx`). Needs a real account; no credentials
  were used. This is the riskiest change in the batch.
- **Real checkout** — order creation, payment, and the corrected item count.
- **`React.cache` dedupe** — reasoned from Next/React semantics, never instrumented.
- **Caching in dev** — `next dev` ignores `revalidate`; only `next start` proves it.

Test URL/flow sketch: guest-add 2 items → log in → confirm both appear and
`localStorage["toman-shop.guest-cart.v1"]` is cleared → checkout → success card count.

## 5. Environment right now

- `next dev` for `shop` is **running on port 3000** (started before the edits; it
  hot-reloads, so the changes are live). It is **not** started by this session.
- Check before starting another server: `Get-NetTCPConnection -LocalPort 3000 -State Listen`.
- `.env.local` → `NEXT_PUBLIC_API_URL=https://practice.amirm.me` (gitignored, do not commit).
- The practice API allows **60 requests/minute per client** — it is shared, be gentle.

## 6. Backlog / next steps, in priority order

1. ~~**Commit the current batch**~~ — done as `3421519` and `fe37e1a`.
2. **Lint backlog — 21 errors, 3 warnings**, all pre-existing React Compiler rules:
   - `src/app/shop/page.tsx` — JSX built inside `try/catch` (`react-hooks/error-boundaries`)
   - `src/components/shop-filters.tsx:36-38` — `setState` in effect
   - `src/components/theme-toggle.tsx:13` — `setState` in effect
   - `src/components/site-header.tsx:157` — `setState` in effect
   - `src/context/cart-context.tsx:144` — `loadGuest()` (pre-existing, line moved)
   - `src/app/cart/cart-view.tsx` — 2 unused imports (warnings)
   These need *restructuring*, not suppression: move the data fetch out of `try/catch`
   and render in a component, and replace effect-synced state with derived state.
3. **`/shop` still makes 2 upstream calls** (`/products` + `/categories`). Categories are
   now cached; products must stay fresh-ish because of stock/price.
4. **200 vs 404 for missing products** — product decision, not a bug. A real 404 means
   dropping `src/app/shop/[id]/loading.tsx`.
5. **Optional**: `reload()` in `cart-context.tsx` now performs a side effect (merges before
   fetching) — the name undersells it. Renaming touches `checkout-view.tsx`.

## 7. Definition of done (for whoever finishes)

- [x] Diff reviewed, batch committed (`3421519` fixes, `fe37e1a` redesign Phase 1)
- [ ] Guest→login merge tested manually against a real account
- [ ] Checkout success card shows the correct item count
- [ ] `npx tsc --noEmit` and `npm run build` still pass
- [ ] Lint count is either unchanged at 24 or trending down (never up)
