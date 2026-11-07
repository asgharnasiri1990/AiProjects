# Portfolio v3

A monochrome, single-page portfolio built to match a supplied reference: giant
fade-to-grey type, a soft-edged portrait, pill navigation, a numbered services
accordion and a full-bleed black "LET'S TALK" band.

English is the default; Persian is a full RTL translation. Every route is static.

## Stack

Next.js 16.4.3 (App Router) · React 19.3 · TypeScript 5 · Tailwind CSS v4.
Fonts are self-hosted from npm (`@fontsource-variable/*`) — **no Google Fonts at
build or runtime**, so this works offline and behind a filter.

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
| `src/content/profile.ts` | Name, email, socials, portrait path |
| `src/content/copy.ts` | Every string, per locale (add to `Copy` **and** both locales) |
| `src/content/work.ts` | The three featured projects and their categories |
| `src/app/[locale]/page.tsx` | The whole page: hero, about, work, services, band |
| `src/app/globals.css` | Tokens, the display gradient, the portrait mask, the rise animation |
| `src/proxy.ts` | Locale redirects; English default, `NEXT_LOCALE` cookie |

## Design notes

- **One accent, none:** pure black / white / grey. No shadows, no colour.
- **The headline** uses Archivo's width axis (`font-stretch: 112%`) and a
  black→grey clipped gradient. Persian uses Vazirmatn and no tracking.
- **The avatar** is `avatar.jpg` — a 200 × 200 grayscale crop shown in the
  header next to the wordmark, at the same size as the social buttons. The hero
  has no large portrait.
- **Work order:** this site first (01), then DigitalShop (02), then Flight
  lookup (03). This is the order in `src/content/work.ts` and on the page.
- **Work screenshots** are real captures of `shop/`, `flight-tracker/` and this
  app, stored as `work-shop.webp`, `work-flight.webp`, `work-site.webp`.
- **Services** are the five labels from the reference, as requested.
- **Stats** are real: 03 shipped apps, 18 routes in the shop build, 100
  accessibility score. Do not replace them with invented numbers.

## Routes

`/` → 307 `/en` · `/en` and `/fa` → the page · anything else → themed 404.
Project cards link to their GitHub source in a new tab.
