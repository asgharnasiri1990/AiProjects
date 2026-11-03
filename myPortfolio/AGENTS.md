<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Portfolio

A bilingual portfolio. Every word is data: `src/content/profile.ts`,
`copy.ts`, `projects.ts`, `posts.ts` and `archive.ts` feed the pages, so new work
means a new entry in a content file, not new JSX.

**Photos** live in `public/images/*.webp`: `profile.photo` is the hero and every
project has a required `cover`. Cards crop to 4:3, case studies to 21:9, the hero
to 4:5 — keep new files at least 1200px wide. Covers are decorative (`alt=""`);
the hero alt lives in `copy.portraitAlt`.

**Archive links are real.** `content/archive.ts` mirrors the owner's public
GitHub repositories; every entry must point at a repository that exists. Do not
invent repos to fill the grid.

**The contact form is mailto-only.** It validates in the browser and opens a
pre-filled message; there is no server, API or storage. Do not swap it for a
server action without checking with the owner — the site is fully static by
design.

### The one architectural rule

```
URL  /fa or /en  ──►  app/[locale]/layout.tsx (the root layout)
                      ├── page.tsx                 home
                      ├── work/[slug]/page.tsx     case study
                      └── log/[slug]/page.tsx      field-log entry
```

- **The root layout lives in `app/[locale]/`, not `app/`.** Do not add an
  `app/layout.tsx`; the nested layout renders `<html lang dir>`. That is why
  `experimental.globalNotFound` in `next.config.ts` exists — without a root
  layout at `app/`, unmatched URLs need their own document.
- **`src/proxy.ts` owns locale routing.** Bare paths are redirected to the
  saved locale (`NEXT_LOCALE` cookie) or Persian. Never hard-code `/fa` in a
  link; take `locale` from props.
- **Everything is static.** `generateStaticParams` fills both locales; there is
  no fetching and no `revalidate`.

### RTL rules

- Use logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`,
  `text-start`). Never `left`/`right` in layout.
- **No `tracking-*` or `uppercase` on Persian text** — letter-spacing breaks
  connected script. Use `displayTracking(locale)` and `eyebrowStyle(locale)`
  from `src/lib/styles.ts`.
- **Numbers that mix symbols need `dir="ltr"`** on an inner element (`6+`,
  `+38%`, `1.1s`), otherwise bidi renders `+6`. Keep the block element's
  direction so it stays aligned with its label.
- Icons that imply direction carry `rtl:-scale-x-100`; the back arrow uses
  `rotate-180 rtl:rotate-0`.

### Gotchas

1. **`PageProps` / `LayoutProps` only exist after type generation.** Run
   `npx next typegen` before `npx tsc --noEmit` on a fresh clone, or the
   globals are missing.
2. **Typed routes are off.** `typedRoutes` is not enabled in `next.config.ts`,
   so `Link href` takes plain strings. Enabling it means every dynamic href
   needs a cast — don't do it casually.
3. **`[...rest]` is the themed 404.** An unhandled path inside a locale hits
   the catch-all, which calls `notFound()`. `global-not-found.tsx` is the
   outer safety net and must render its own `<html>`/`<body>`.
4. **`usePathname()` is the only way to know the locale inside
   `not-found.tsx`** — not-found components receive no props.
5. **Screenshot tools can clip short RTL pages.** The layout is fine when the
   DOM reports `scrollWidth === clientWidth`; force a taller page before
   trusting a capture.
6. **`next dev` rewrites the block at the top of this file.** Add notes below
   it, never inside.
7. **Log bodies are `Block[]`** (`p` | `h2` | `quote`). Adding a kind means
   updating both `content/posts.ts` and the renderer in
   `app/[locale]/log/[slug]/page.tsx`; there is no Markdown parser.

### Verify

```powershell
npx next typegen
npx tsc --noEmit
npm run build
```

Smoke test a running server: `/` → 307 `/fa`, `/fa` and `/en` → 200,
`/en/work/kaveh-storefront` → 200, `/fa/nope` → 404.
