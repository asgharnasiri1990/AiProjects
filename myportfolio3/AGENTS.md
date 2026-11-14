<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Portfolio v3

A reference-driven portfolio: warm paper, near-black ink, hairline rules, pill
controls, a giant fade headline and a black closing band — with one lime signal
(`#c6f24e`) used as a surface, never as text. The hero is a full lime block in
both themes, so the page opens and closes on colour.
**English is the default locale**; Persian is a full RTL translation of the same
copy. This is the live portfolio; `archive/myportfolio2/` is kept for reference.

### The one architectural rule

```
URL  /en or /fa  ──►  app/[locale]/layout.tsx (root layout, <html lang dir>)
                      └── page.tsx  — hero, about, work, services, contact band
```

There is **one page**. The nav is anchor links (`#home`, `#about`, `#services`,
`#work`); project cards link to GitHub sources. Do not add case-study routes
unless the owner asks — this version is deliberately a single page.

`src/proxy.ts` redirects locale-less URLs; `defaultLocale` is `en`. Bare `/`
goes to `/en` unless the `NEXT_LOCALE` cookie says otherwise.

### Fonts are self-hosted

`@fontsource-variable/archivo` (import `standard.css` — it carries the width
axis), `vazirmatn`, `jetbrains-mono`. **Never switch back to `next/font/google`:**
Google Fonts is unreachable from this environment and the build fails with a
module-not-found error. The fonts are bundled; the site builds offline.

### Design rules

- **One signal colour, everything else warm neutral.** No shadows, no second
  hue. The palette is a warm neutral ramp (all tokens tinted toward ochre,
  `#fbfaf6` paper → `#17150f` ink) plus exactly one accent: `signal`
  (`#c6f24e`). Signal is a **surface, never text** — it is ~1.35:1 on paper, so
  anything sitting on it uses `signal-ink` (`#17150f`). The accent is a
  structural block, not confetti: the whole hero, the closing headline, the
  active filter pill and active service row, the work-card index badges, the
  closing CTA, and every pill hover (plus `::selection`). Keep it to those and
  do not add a second hue.
- **The hero does not follow the theme.** It is `bg-signal text-signal-ink` in
  paper *and* ink. Its headline uses `.hero-on-signal` (a fixed ink →
  transparent-ink gradient) instead of `.display-fade-l/r`, the availability
  ticker strip under it is `bg-signal-ink text-signal`, and the `CircleLink`
  inside that strip takes `onDark`. At `lg` the headline sits in an
  `@container` box padded by the width of the absolutely positioned side
  columns (`lg:px-56`) and is sized in `cqw`, so it can never run under the
  statement column.
- **Display type** uses `.display-wide` (`font-stretch: 112%`) and
  `.display-fade` (black→grey clipped gradient). Persian must not get
  `tracking-*` or `uppercase`; use `latinLabel` / `displayTracking`.
- **The avatar** is `public/images/avatar.jpg` (200 × 200, grayscale) and lives
  in the header next to the `PORTFOLIO.` wordmark at `h-9 w-9` — the same size as
  the social icon buttons. The hero has no portrait; do not re-add a large photo
  without asking.
- **Themes:** paper (default) and ink. Tokens are overridden on
  `html[data-theme="ink"]` in `globals.css`; never write `dark:` variants. The
  theme is read from the `theme` cookie **on the server** in
  `[locale]/layout.tsx` (so the first paint and hydration agree), and the header
  toggle flips the attribute and writes the cookie. Do not add a pre-hydration
  script that mutates `<html>`; that causes a hydration mismatch.
- **Reveal:** `components/reveal.tsx` adds `reveal-hidden` only to elements
  below the fold after mount, then `reveal-in` via IntersectionObserver. Content
  must never be hidden by default CSS.
- **Counters:** `components/count-up.tsx` animates the stat numbers from zero the
  first time they enter the viewport. The server HTML contains the final value
  (no-JS and reduced-motion users see it); the component only mutates its own
  text node after hydration. Do not move the per-frame update into React state.
- **Header order:** avatar + `PORTFOLIO.` (never shrinks, never wraps), then the
  social icons from `lg` — below that the bar is too tight and the socials live
  in the contact band (and in the open menu on phones), plus the theme toggle.
  The nav pills appear from `md` and must stay `whitespace-nowrap`; the language
  switch stays beside the theme toggle; below 360px the wordmark is hidden so
  the bar stays on one line.
- **Mobile:** root font is 17px under 640px, work cards are one column, and
  labels/body copy are bumped up; desktop keeps two columns and the smaller labels.
- **Work images** are real screenshots (`work-*.webp`), rendered grayscale.
  Do not replace them with stock photos; keep the `work.ts` sources real.
- **Services** are intentionally the five labels from the reference (the
  owner's choice): UI/UX, WEB DESIGN, LANDING PAGE DESIGN, UI DESIGN FIGMA,
  MOBILE APP DESIGN. The accordion opens one row at a time.
- **Facts** are verifiable: 03 apps, 18 routes in the shop build, 100
  accessibility score. Never invent metrics.
- **The contact form** (`components/contact-form.tsx`) closes the black band and
  is mailto-only: it validates locally and then opens the visitor's mail app.
  Do not add a backend, storage or a third-party form service without asking —
  the site has no database and the privacy promise in `AGENTS.md` has to hold.

### Gotchas

1. `PageProps` / `LayoutProps` only exist after `npx next typegen`.
2. Typed routes are off; `Link href` takes strings.
3. The root layout is inside `[locale]`, so `experimental.globalNotFound` in
   `next.config.ts` is required for unmatched URLs.
4. `not-found.tsx` gets no props — it reads the locale from `usePathname()`.
5. Screenshots via the browser tool can clip RTL pages; Chrome headless
   (`--headless=new --screenshot`) is a reliable fallback and is what the work
   images were captured with.
6. The `@fontsource` CSS is imported in `layout.tsx` before `globals.css`; keep
   that order.
7. The theme cookie makes `/[locale]` dynamic (`ƒ` in the build). That is
   intentional and is what keeps first paint and hydration in sync; do not add a
   pre-hydration script that mutates `<html>`.

### Checkpoint

`PROGRESS.md` records the current state. `v3-stable-2026-11-07` is the
known-good tag; before a risky update, restore/fork with
`git checkout v3-stable-2026-11-07` (or `git switch -c <branch>` from it).

### Analytics

- **Vercel Analytics** is installed (`@vercel/analytics/next`, `<Analytics />`
  in the locale layout). Enable Web Analytics in the Vercel project for the
  device/browser/country dashboard.
- **Umami / Plausible** are optional and env-gated
  (`NEXT_PUBLIC_UMAMI_SRC` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID`,
  `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`). Do not enable both at once.
- **Custom device counter:** `components/visit-tracker.tsx` posts once per page
  load to `/api/visit`; `lib/stats.ts` classifies the user-agent and increments
  aggregate counts only — a lifetime counter plus a per-UTC-day bucket
  (`stats:day:YYYY-MM-DD`) so the page can show today / 7 / 30 days. It uses
  Vercel KV / Upstash REST when `KV_REST_API_URL` + `KV_REST_API_TOKEN` (or the
  `UPSTASH_*` pair) exist, and a gitignored `.data/stats.json` locally. On
  Vercel without KV it stores nothing.
- **The stats screen is public:** `/[locale]/stats` (linked from the closing band
  footer as `STATS` / `آمار`) with today / 7 / 30 days / all-time ranges. Because
  it is public it must stay `noindex` and must never show anything but aggregate
  buckets — never IPs, raw user agents or cookies. `/[locale]/s/<STATS_PATH>` is
  a secret alias kept for the owner's bookmark; the slug lives in an env var
  because this repository is public.

### Verify

```powershell
npx next typegen
npx tsc --noEmit
npm run lint
npm run build
```

Smoke test: `/` → 307 `/en`, `/en` and `/fa` → 200, `/en/nope` → 404.
