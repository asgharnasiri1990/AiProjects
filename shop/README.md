# DigitalShop

A complete online shop built with **Next.js (App Router)** and **Tailwind CSS**, powered entirely by the [practice.amirm.me API](https://practice.amirm.me/api-docs).

## Features

- **/** — a Pinterest-style discovery feed: compact intro, category pills and a masonry wall of 12 product pins at varied heights.
- **/shop** — the full catalogue as a variable-height masonry grid. Search lives in the site header (debounced, URL-driven), alongside category pills, min/max price, in-stock toggle, sorting (newest / cheapest / most expensive / name) and Previous/Next pagination. Every filter is URL state — shareable and back/forward friendly.
- **/shop/[id]** — image-first product page: large artwork, stock badges, quantity selector, "Add to cart" (disabled when out of stock, capped at 10 per the API) and a Save/Saved wishlist button.
- **/favorites** — the wishlist. Heart any pin and it is kept on this device, with a live count in the header.
- **/cart** — editable quantities, remove per row, order total, "Clear cart" and "Continue shopping". Guests get `localStorage` persistence; logged-in users sync with the API cart, and the guest cart is merged into the account on login.
- **Real authentication** — `/signup` and `/login` with client + server validation and clear error messages. The bearer token is stored in an **httpOnly cookie** (set by Next.js route handlers) and never exposed to client JS. Session survives refresh; logout invalidates the token server-side.
- **Protected routes** — `/account` (profile + order history) and `/checkout` are guarded by middleware; unauthenticated visitors are redirected to `/login?next=…` and returned where they came from after signing in.
- **Checkout** — delivery form (name, phone, address), order summary, order creation, and the API's fake payment (pay / cancel from the account page).
- **States everywhere** — loading skeletons per route, empty states, friendly API/network error states with retry, and a custom 404.
- **Design** — warm off-white canvas, borderless rounded cards with a single ink accent, Pinterest-red hearts only, hover lift and image zoom (both disabled under `prefers-reduced-motion`), light/dark mode (next-themes, system-aware), accessible landmarks and forms (labels, `aria-invalid`, `role="alert"`, focus rings, skip link) and Persian text rendered correctly with Vazirmatn.

## Tech stack

| Piece | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + a small design system (`src/components/ui`) |
| State | React Context (`AuthProvider`, `CartProvider`) + localStorage |
| Theme | next-themes (class-based dark mode) |
| API | practice.amirm.me — see below |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure the API URL
cp .env.example .env.local   # already present, edit if needed

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000. Create an account on `/signup` (username + password, e.g. `sara_1` / `secret123`) and you're ready to shop.

Production build:

```bash
npm run build
npm start
```

### Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://practice.amirm.me` | Base URL of the shop API (no trailing slash). |

## API endpoints used

All data comes from the practice API — nothing is mocked:

| Purpose | Endpoints |
| --- | --- |
| Products | `GET /products` (`search`, `category`, `minPrice`, `maxPrice`, `inStock`, `sort`, `page`, `limit`), `GET /products/{id}` |
| Categories | `GET /categories` |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Cart | `GET /me/cart`, `POST /me/cart/items`, `PATCH /me/cart/items/{productId}`, `DELETE /me/cart/items/{productId}`, `DELETE /me/cart` |
| Orders | `POST /me/orders` (checkout), `GET /me/orders`, `POST /me/orders/{id}/pay`, `POST /me/orders/{id}/cancel` |

### How auth works

The API issues a bearer token. To keep it out of client-side JavaScript:

1. `POST /api/auth/login` (Next route handler) calls the API, then sets the token in an **httpOnly, SameSite=Lax** cookie (`shop_session`).
2. Server components read the cookie to resolve the user (SSR — no flicker).
3. Authenticated browser calls go through thin proxies (`/api/cart`, `/api/orders/...`) that attach the token server-side and forward the response. A 401 clears the stale cookie automatically.
4. `POST /api/auth/logout` invalidates the token with the API and deletes the cookie.

> Note: the API authenticates with **username + password** (it has no email field), so signup validates a username instead of an email address. The API also rate-limits to 60 requests/minute.

## Project structure

```
src/
├── app/                    # App Router pages
│   ├── page.tsx            # / (discovery feed)
│   ├── shop/               # /shop (masonry grid + filters + pagination)
│   │   └── [id]/           # /shop/[id] (product detail)
│   ├── favorites/          # /favorites (device-local wishlist)
│   ├── cart/               # /cart
│   ├── checkout/           # /checkout (protected)
│   ├── account/            # /account (protected, orders)
│   ├── login/  signup/     # Auth pages
│   └── api/                # Route handlers (auth cookie + API proxies)
├── components/
│   ├── ui/                 # Design system: Button, Input, Badge, Skeleton, states…
│   ├── icons.tsx           # Inline SVG icon set
│   ├── masonry-grid.tsx    # CSS-columns masonry (2/3/4 columns)
│   ├── product-card.tsx    # Pin: cover image, category, name, price, heart
│   ├── favorite-button.tsx # Heart toggle (icon or Save/Saved pill)
│   ├── search-bar.tsx      # Header search pill (URL-driven, debounced)
│   ├── category-nav.tsx    # Category pills (?category=)
│   ├── shop-filters.tsx    # Price / sort / in-stock toolbar
│   ├── pagination.tsx
│   ├── site-header.tsx     # Logo, search, saved + cart badges, user menu, theme
│   └── site-footer.tsx
├── context/
│   ├── auth-context.tsx    # Session state (login/signup/logout)
│   ├── cart-context.tsx    # Guest (localStorage) + synced (API) cart
│   └── favorites-context.tsx # Wishlist (localStorage snapshots)
├── lib/
│   ├── api.ts              # API service layer (all fetches live here)
│   ├── catalog.ts          # Shared non-throwing product+category loader
│   ├── aspect.ts           # Stable per-product feed aspect ratio
│   ├── proxy.ts            # Authenticated route-handler proxy helper
│   ├── session.ts          # httpOnly cookie session helpers (server)
│   ├── validation.ts       # Form validation rules
│   ├── format.ts           # Toman / date formatting
│   └── types.ts            # API payload types
└── proxy.ts                # Route guard for /account and /checkout (Next 16 middleware)
```
