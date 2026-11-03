<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Portfolio v2

A bilingual (فارسی / English) portfolio for Asghar Nasiri. Swiss-grid design:
ink on paper, hairline rules, mono numerals, one accent disc. Every word is data,
so adding work means adding an object — not writing JSX.

**Everything is real.** The three case studies describe code that exists in this
repo (`shop/`, `flight-tracker/`, this app). There are no invented metrics, no
fake employers and no placeholder history. If a number cannot be verified from the
code, it does not go on the site.

### The one architectural rule

```
URL  /fa or /en  ──►  app/[locale]/layout.tsx (the root layout, renders <html lang dir>)
                      ├── page.tsx                 home (hero, work index, archive, contact)
                      ├── work/page.tsx            all work
                      ├── work/[slug]/page.tsx     case study
                      ├── archive/page.tsx         repository archive
                      ├── about/page.tsx           bio, tools, path
                      └── contact/page.tsx         email + mailto form
```

- **The root layout lives in `app/[locale]/`, not `app/`.** Never add an
  `app/layout.tsx`; the nested layout owns `<html lang dir>`. That is why
  `experimental.globalNotFound` exists — unmatched URLs need their own document.
- **`src/proxy.ts` owns locale routing.** Bare paths redirect to the saved locale
  (`NEXT_LOCALE` cookie) or Persian. Never hard-code `/fa` in a link; take
  `locale` from props.
- **Everything is static.** `generateStaticParams` fills both locales and every
  slug. There is no fetching, no CMS and no `revalidate`.

### Content and design

- `src/content/profile.ts` — identity and contact details. Nothing else defines them.
- `src/content/copy.ts` — every string, per locale. Add a field to `Copy` **and**
  both locales or the build fails (that is the point).
- `src/content/work.ts` — case studies. `slug` becomes `/fa/work/<slug>`.
  `figures` must be countable facts; `sections` are constraint / build / trade-off;
  `notes` are the three decisions behind the work.
- `src/content/archive.ts` — real repositories from `github.com/asgharnasiri1990`.
  Every entry must point at a repo that exists. Do not invent repos to fill the grid.
- `src/lib/styles.ts` — `shell`, focus ring, tracking helpers, `metalButton`.
- `src/app/globals.css` — design tokens (`@theme`) and the metal button. There is
  no `tailwind.config`.

**Type**: `Inter Tight` (Latin), `Vazirmatn` (Persian glyphs), `JetBrains Mono`
(all numerals, labels, indexes). Persian falls through automatically because
Inter Tight has no Arabic glyphs.

**The metal button** (`.metal-button` in `globals.css`) is pure CSS: a chrome
gradient, a rotating specular band and an outer ring. It is the only loud element
on the site — one per page. It is not the 21st.dev WebGL shader; do not add
`@paper-design/shaders` without asking.

**Cards** (archive, case-study decisions) are `rounded-xl`, `bg-paper`, a hairline
border and no shadow; the archive adds a hand-drawn `SketchRing`. The work index is
deliberately *not* cards — it is a printed index and carries the hierarchy.

### RTL rules

- Use logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`).
  Never `left`/`right` for layout.
- **No `tracking-*` or `uppercase` on Persian text** — letter-spacing breaks
  connected script. Use `displayTracking(locale)` / `labelStyle(locale)`.
- **Never put `dir="ltr"` on a block element.** It flips `text-align: start` and
  sends numbers and their labels to opposite edges. Isolate instead:
  `<p><bdi dir="ltr">60s</bdi></p>`. Inline elements inherit alignment from the
  parent; blocks do not.
- Persian needs looser leading: the hero uses `leading-[1.06]` for `fa` and
  `leading-[0.95]` for `en`; `[dir="rtl"] p` gets `line-height: 2.05` in CSS.
- Icons that imply direction carry `rtl:-scale-x-100`; the back arrow uses
  `rtl:rotate-180`.

### Gotchas

1. **`PageProps` / `LayoutProps` only exist after type generation.** Run
   `npx next typegen` before `npx tsc --noEmit` on a fresh clone.
2. **Typed routes are off.** `Link href` takes plain strings.
3. **`[...rest]` is the themed 404**; `global-not-found.tsx` is the outer safety
   net and renders its own `<html>`/`<body>`.
4. **`not-found.tsx` gets no props** — it reads the locale from `usePathname()`.
5. **A `gap-px bg-line` grid must not sit directly inside `shell`.** The shell's
   padding shows the hairline background as a grey band; wrap the grid in an inner
   `<div className={shell}>` (see the facts strip).
6. **The hero height is capped**: `min-h-[min(calc(100dvh-3.5rem),52rem)]`. Without
   the cap, a tall monitor stretches the hero over the whole page.
7. **The contact form is mailto-only** — it validates in the browser and opens a
   prefilled message. No server, no storage. Do not swap it for a server action;
   the site is static by design.
8. **Screenshot tools can clip RTL pages** and Chrome headless clamps windows to a
   ~500px minimum width. Measure `scrollWidth === clientWidth` before trusting a
   "broken mobile" capture.

### Verify

```powershell
npx next typegen
npx tsc --noEmit
npm run build
npm run lint
```

Smoke test a running server: `/` → 307 `/fa`, `/fa` and `/en` → 200,
`/fa/work/digital-shop` → 200, `/en/work/flight-lookup` → 200, `/fa/nope` → 404.
