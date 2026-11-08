# Progress — portfolio v3

## Checkpoint: 2026-11-07

**Tag:** `v3-stable-2026-11-07`
This is the known-good state before the next round of updates. If a later
change breaks the design or the build, return here.

```powershell
git fetch --tags
git checkout v3-stable-2026-11-07
# or, to keep working on a branch from it:
git switch -c before-updates v3-stable-2026-11-07
```

## What is done

- **Warm paper palette + signal lime** (2026-11-09): every neutral is tinted
  toward the same ochre (`paper #fbfaf6` → `ink #17150f`), `line` is dark enough
  to read, About and Services sit on the `wash` surface for value rhythm. One
  accent — `signal` `#c6f24e` — used as a surface, never text: the hero block,
  the availability strip (inverted), the closing headline, the active filter
  pill and service row, the card index badges, the closing CTA, and every pill
  hover. The hero no longer follows the theme.
- English default (`/en`), Persian RTL (`/fa`); `/` redirects to the saved
  `NEXT_LOCALE` cookie, otherwise English.
- Monochrome reference layout: centred fade-to-grey hero, avatar beside the
  `PORTFOLIO.` wordmark, three stat boxes, large filter pills, 2-column project
  grid on desktop / 1 column on mobile, numbered services accordion with circle
  arrows, black `LET'S TALK` band.
- Paper + ink themes. The theme is read from the `theme` cookie **on the server**
  so there is no flash and no hydration mismatch; the header toggle writes it.
- Scroll-reveal for sections and cards (`components/reveal.tsx`), plus the stat
  counters that count up from zero when they enter the viewport
  (`components/count-up.tsx`). Both honour `prefers-reduced-motion`.
- Mobile typography pass: 17px root on phones, larger labels, 40px header
  controls, socials + language in the header/menu.
- Projects: This site (01), DigitalShop (02), Flight lookup (03), Phone price
  comparator (04). Real screenshots, links to GitHub.
- Socials: GitHub, LinkedIn, Instagram (`asghar.nasiri`).
- Fonts are self-hosted from npm (`@fontsource-variable/*`); Google Fonts is
  never requested. `npm run dev` works offline.
- `tsc`, `lint` and `build` are clean.

## Known trade-offs

- The locale layout reads the theme cookie, so `/[locale]` renders dynamically
  (`ƒ` in the build output). There is still no data fetching or database.
- The work-card screenshot for “This site” is `work-site-2.webp`; renaming it
  again is the quick way to bust the Next image cache.
- Services use the five reference labels by the owner's choice, including
  “Mobile app design”.

## Run

```powershell
cd myportfolio3
npm install
npm run dev     # or: npm run build && npm start
```

Production runs on port 3000.
