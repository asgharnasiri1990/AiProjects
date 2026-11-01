<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

> **Picking this up mid-stream?** Read `PROGRESS.md` first. It tracks the current
> uncommitted batch, what is verified versus untested, and the open backlog.

## DigitalShop

A storefront with **no database and no mocks**: products, sessions, carts and orders all
live on the public `practice.amirm.me` API (docs at `/api-docs`). Base URL comes from
`NEXT_PUBLIC_API_URL` (`.env.local`, default `https://practice.amirm.me`). Read
`README.md` for the feature tour; this file is the part that bites you.

### The one architectural rule

```
READ  (SSR)     Server Component  ──►  src/lib/api.ts  ──►  practice API
WRITE (client)  Browser  ──►  /api/* route handler  ──►  src/lib/proxy.ts (+ cookie)  ──►  practice API
```

- The bearer token exists **only** in the `shop_session` httpOnly cookie. Never read it in
  a client component, never return it from a route handler, never put it in localStorage.
- Every upstream call goes through `apiFetch()` in `src/lib/api.ts`. Do not `fetch()` the
  practice API directly — you would lose error normalization (`ApiError`) and the timeout
  story.
- Browser writes go through `/api/cart/*`, `/api/orders/*`, `/api/auth/*`. `proxyToApi()`
  attaches the token and clears the cookie on 401.
- Page-level auth checks use `getSessionUser()` (server only). `src/proxy.ts` only checks
  that a cookie is *present* — real validation happens per page.

### Design system & feed

- **Tokens live in `globals.css`** (`@theme`), not a Tailwind config — there is no
  `tailwind.config.*`. Three ramps matter: `primary-*` is **ink** (near-black, used for every
  button/link/ring), `canvas` is the warm off-white page, `accent-*` is Pinterest red and is
  reserved for the wishlist UI. Changing `globals.css` restyles the whole app.
- **Masonry is CSS multi-column** (`masonry-grid.tsx`), so cards must be its direct children —
  spacing and `break-inside-avoid` are applied via child selectors. Heights come from
  `feedAspectRatio(slug)`, capped at 3:4 so the centred artwork in the square API SVGs is never
  clipped. Visual order fills down columns; DOM/tab order stays correct.
- **Pins show name + price only** (plus a tiny category). Descriptions live on the detail page.
- **The heart is a sibling of the card link**, never a child — buttons can't legally nest in
  anchors, and this makes accidental navigation impossible. Titles are `<h2>` so heading order
  stays sequential under the page `<h1>`.
- **Favourites are device-local** (`favorites-context.tsx`, `Product` snapshots, max 100) built on
  `useSyncExternalStore` — no `setState` in an effect, no hydration mismatch, cross-tab sync.
- **`lib/catalog.ts` is the one loader** for `/` and `/shop`. It returns a result object instead of
  throwing so pages render outside any `try/catch` (JSX inside `try` is a lint error here).

### Where things live

| Path | Role |
| --- | --- |
| `src/lib/api.ts` | The only fetch layer; `ApiError`, `MAX_ITEM_QUANTITY`, `imageUrl` |
| `src/lib/types.ts` | API payloads + `CartLine` (single shape for guest *and* server carts) |
| `src/lib/session.ts` | `getSessionToken`, `getSessionUser` (cached per request) |
| `src/lib/proxy.ts` | Authenticated route-handler → API forwarder |
| `src/proxy.ts` | Route guard (Next 16's renamed `middleware.ts`) |
| `src/context/cart-context.tsx` | Guest (localStorage) ↔ server cart, merge on sign-in |
| `src/app/*-view.tsx`, `*-form.tsx` | Client islands; every `page.tsx` stays a Server Component |

### Invariants

- **One cart shape.** Guest and server carts both render from `CartLine[]`. If you add a
  field, add it in `linesFromCart()` *and* the guest `add()` path.
- **Filters are URL state.** Every control writes with `router.replace` and the page
  re-reads `searchParams`. No filter state that the URL doesn't know about, or
  back/forward and sharing break.
- **Quantity always clamps** to `min(stock, MAX_ITEM_QUANTITY)` via `cap()`, on every path
  (buy box, cart stepper, merge). The API rejects >10 anyway.
- Guest cart key: `toman-shop.guest-cart.v1`.

### Gotchas

1. **A failed guest→account merge must never delete the guest cart.** `syncGuestCart()`
   keeps only the lines that failed and retries them on the next sync. Don't "simplify"
   this back into `.catch(() => undefined)` + clear.
2. **Dedupe per-request work with `React.cache`.** `getSessionUser()` is called by the root
   layout *and* the page; the product page is fetched by both `generateMetadata()` and the
   body. Without memoization that is 2× the API calls.
3. **`revalidate` is for public data only.** `apiFetch` sets `cache: "no-store"` by default;
   the two options conflict, so it passes exactly one. Never enable it on a call that
   carries an `Authorization` header. Today only `/categories` is cached (300s).
4. **Proxy matchers need `:path*`.** `["/account"]` protects `/account` but silently leaves
   `/account/orders` open. Use `["/account/:path*", "/checkout/:path*"]`.
5. **`loading.tsx` means `notFound()` yields HTTP 200.** Streaming starts before the check
   runs, so a missing product serves the 404 UI with status 200 plus `noindex`. That is
   documented Next behavior, not a bug — a real 404 costs the loading skeleton.
6. **Dev mode ignores `revalidate`.** To verify caching: `npm run build && npm start`, hit
   the page, then look for an entry in `.next/cache/fetch-cache`.
7. **The API allows 60 requests/minute per client.** A logged-in page view can cost
   `/auth/me` + page data + cart. Budget new fetches accordingly.
8. **Checkout empties the cart.** After placing an order, render counts/totals from
   `order.items`, never from `useCart()` — it is already empty.
9. **ESLint has ~24 pre-existing problems** (React Compiler rules: JSX in `try/catch`,
   `setState` in effects). `npm run build` does not run ESLint. Compare counts
   before/after instead of treating a red lint as your fault.

### Verify

```powershell
npx tsc --noEmit
npm run build
```

Smoke test against a running server: `/shop` (200, real products), `/shop/24` (200),
`/account` as a guest (307 → `/login?next=%2Faccount`), `/account/orders`
(307 → `/login?next=%2Faccount%2Forders`). Use port 3000 only if it is free.
