# Portfolio v3

A single-page portfolio built to match a supplied reference: a warm paper ramp,
giant fade type, a lime hero, an avatar in the header, pill navigation, a
numbered services accordion and a full-bleed black "OPEN TO WORK" band.

English is the default; Persian is a full RTL translation. The theme is read from
a cookie on the server, so routes render dynamically — there is no data fetching.

## Stack

Next.js 16.4.3 (App Router) · React 19.3 · TypeScript 5 · Tailwind CSS v4.
Fonts are self-hosted from npm (`@fontsource-variable/*`) — **no Google Fonts at
build or runtime**, so this works offline and behind a filter.

For link previews, set `NEXT_PUBLIC_SITE_URL` (for example
`https://your-domain.com`) in the deployment environment; on Vercel
`VERCEL_PROJECT_PRODUCTION_URL` is used automatically. The 1200 × 630 card is
`public/og.png`.

## Run it

```powershell
cd myportfolio3
npm install
npm run dev
```

```powershell
npm run build   # the real gate
npm start
```

## What is where

| File | Role |
| --- | --- |
| `src/content/profile.ts` | Name, email, socials, avatar |
| `src/content/copy.ts` | Every string, per locale (add to `Copy` **and** both locales) |
| `src/content/work.ts` | The four featured projects and their categories |
| `src/app/[locale]/page.tsx` | The whole page: hero, about, work, services, band |
| `src/app/globals.css` | Tokens, theme overrides, gradients, reveal |
| `src/proxy.ts` | Locale redirects; English default, `NEXT_LOCALE` cookie |

## Design notes

- **One accent, none:** pure black / white / grey. No shadows, no colour.
- **Themes:** paper (default) and ink, toggled in the header. The choice lives in
  the `theme` cookie **and** is rendered on the server, so there is no flash and
  no hydration mismatch.
- **The headline** uses Archivo's width axis (`font-stretch: 112%`) and a
  black→grey clipped gradient. Persian uses Vazirmatn and no tracking.
- **The avatar** is `avatar.jpg` — a 200 × 200 grayscale crop shown in the
  header next to the wordmark, at the same size as the social buttons. The hero
  has no large portrait.
- **Work order:** this site (01), then DigitalShop (02), Flight lookup (03) and
  Phone price comparator (04), in `src/content/work.ts`.
- **Work screenshots** are real captures of `shop/`, `flight-tracker/`,
  `price-compare/` and this app, stored as `work-shop.webp`,
  `work-flight.webp`, `work-price.webp` and `work-site-2.webp`.
- **Services** are the five labels from the reference, as requested.
- **Stats** are real: 03 shipped apps, 18 routes in the shop build, 100
  accessibility score. Do not replace them with invented numbers.

## Analytics

- **Vercel Analytics** is mounted in the layout (`@vercel/analytics/next`).
  Enable **Web Analytics** in the Vercel project to see devices, browsers,
  countries and page views.
- **Device counter + `/stats`:** create an **Upstash Redis** store in Vercel
  (Storage → Upstash) and connect it to the project. `/en/stats` (or `/fa/stats`)
  is public and linked from the footer, with today / 7 / 30 days / all time and
  the last 100 visits (device model, OS, browser, Tehran time). Locally the
  counts are written to `.data/stats.json` and `.data/visits.json`.
- **Umami / Plausible** are optional. Set the matching env vars from
  `.env.example` and enable **only one**; both would double-count.
- Only aggregate device/OS/browser counts are stored — no IP addresses, raw user
  agents or cookies. The public `/stats` page is `noindex`; a secret
  `/[locale]/s/<STATS_PATH>` alias exists for the owner's bookmark.

## Routes

`/` → 307 `/en` · `/en` and `/fa` → the page · anything else → themed 404.
Project cards link to their GitHub source in a new tab.
