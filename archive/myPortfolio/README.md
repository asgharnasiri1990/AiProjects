# Portfolio

A bilingual (فارسی / English) personal portfolio for a front-end engineer and
interface designer. One page tells the story — hero, selected work, about,
skills, experience, contact — and every project links to its own case study.

No database, no API, no runtime data: every route is statically prerendered.

## Stack

Next.js 16.4.3 (App Router) · React 19.3 · TypeScript 5 · Tailwind CSS v4.

## Run it

```powershell
cd myPortfolio
npm install
npm run dev
```

The dev server picks the first free port (3000 is usually the shop).

```powershell
npm run build   # the real gate: compiles + type-checks every route
npm start
```

## Make it yours

All copy lives in three files — nothing is hard-coded in components:

| File | What is in it |
| --- | --- |
| `src/content/profile.ts` | Name, initials, email, socials, hero photo |
| `src/content/copy.ts` | Every UI string, stat, skill group and job, per locale |
| `src/content/projects.ts` | Case studies: title, summary, sections, trade-off, metrics |
| `src/content/posts.ts` | Field-log entries: date, summary, blocks of prose |
| `src/content/archive.ts` | Smaller builds: real repos, links and stack |

Edit those, then replace the site metadata in `src/app/[locale]/layout.tsx`
(title/description come from `copy.ts`). The header monogram is drawn from
`profile.initials`, so it updates with the name.

Colours, fonts and the fluid type scale are `@theme` tokens in
`src/app/globals.css`; changing that one file restyles the whole site.

## Images

`public/images/portrait.webp` is the hero photo (your GitHub avatar); the other
four — `kaveh`, `parvaz`, `saba`, `daftar` — are placeholder covers from
Unsplash (free to use). Replace them keeping the same names, or point
`profile.photo` and each project's `cover` at new files.

Covers are cropped to **4:3** in the grid and **21:9** on case-study pages; the
hero is **4:5**. Use images at least 1200px wide, and prefer warm, uncluttered
shots so the grid stays coherent. Cards load through `next/image`; no
configuration is needed for files in `public/`.

## Routes

| URL | Page |
| --- | --- |
| `/` | Redirects to the saved locale, Persian by default |
| `/fa`, `/en` | Home: work, about, field log, contact |
| `/fa/work/<slug>`, `/en/work/<slug>` | Case study |
| `/fa/log`, `/en/log` | Field-log index |
| `/fa/log/<slug>`, `/en/log/<slug>` | A single entry |
| anything else under a locale | Themed 404 |

`src/proxy.ts` (Next 16's `middleware.ts`) adds the locale to bare URLs and
remembers an explicit language choice in the `NEXT_LOCALE` cookie.

## Project layout

```
src/app/[locale]/layout.tsx        root layout: <html lang dir>, header, footer
src/app/[locale]/page.tsx          home
src/app/[locale]/work/[slug]/      case study
src/app/[locale]/log/              field log: index + [slug] entry
src/app/global-not-found.tsx       standalone 404 for unmatched URLs
src/components/                    header, footer, cards, contact form, icons
src/content/                       profile, copy, projects and posts
src/lib/i18n.ts                    locales, direction, path switching
src/lib/styles.ts                  shared button/focus classes
```

The contact form has no backend: it validates locally and opens a pre-filled
`mailto:` message. That is intentional — keep it working without JavaScript or
a server.

## Features

- Bilingual routing with a saved language preference and `hreflang` alternates
- Static case studies with a "trade-off" note and results
- Field log with reading time, tags and next-entry navigation
- Archive of real repositories from GitHub, linked outward
- Locally validated contact form (mailto; nothing stored)
- Photos through `next/image`, cropped per slot
