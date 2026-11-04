# Progress — price-compare

> **Read this before touching code.** It is the single source of truth for what
> exists and what is next. Update it at the end of every session (see the last
> section). `AGENTS.md` holds the rules; this file holds the state.

| | |
| --- | --- |
| **Last updated** | 2026-11-04 |
| **Current state** | **v1 built and verified.** Two live shops (Technolife, Farnaa) + custom URL slots. `tsc`, `lint`, `build` and an end-to-end smoke test pass. |
| **Next action** | None required. Optional: more adapters, pagination, per-color floor. |

## Status

| Area | State | Notes |
| --- | --- | --- |
| Planning / UX decisions | ✅ done | See decisions below. |
| Project docs | ✅ done | `AGENTS.md`, `PROGRESS.md`. |
| Scaffold (`package.json`, configs) | ✅ done | Mirrors `../flight-tracker`; package `price-compare`. |
| `app/layout.tsx` (fa, RTL, Vazirmatn, no-flash theme) | ✅ done | |
| `app/page.tsx` (form + results) | ✅ done | Brand/model/storage/color, shops, custom slots, states. |
| `app/api/prices/route.ts` | ✅ done | Validation, fan-out, 9s timeout per shop, sorted `PricesResponse`. |
| Provider registry + types | ✅ done | `lib/providers/index.ts`, `lib/types.ts`. |
| Technolife adapter | ✅ done | `/product/list/search?keywords=` → `__NEXT_DATA__.results`. |
| Farnaa adapter | ✅ done | `/search?q=` → server-rendered `col-md-3` cards. |
| Digikala adapter | ⛔ dropped | JS shell + API timeout; see scraping log. |
| Generic adapter for custom URLs | ✅ done | JSON-LD → meta → text price; blocks private hosts. |
| Result filtering by storage/color | ✅ done | Storage strict; colour is a soft filter that keeps unknown-colour rows. |
| Floor / colour grouping / timestamps | ✅ done | Floor card, colour chips, local update time. |
| Theme tokens + no-flash script + toggle | ✅ done | Light + dark, decision 11. |
| Verify (`typegen`, `tsc`, `build`, `lint`) | ✅ done | All green; no lint errors. |
| Dev-server end-to-end smoke test | ✅ done | Search, floor, sorted rows, cheapest badge, theme toggle, error row. |

Legend: ✅ done · 🟡 in progress · ⬜ not started · ⛔ blocked.

## Decisions (do not re-open without the user)

1. **Folder / package:** `price-compare/`, package name `price-compare`.
   Chosen by the user from three options.
2. **Language:** Persian only, RTL. No i18n, no English toggle.
3. **Form fields:** brand (select), model (free text), storage (select),
   color (free text + quick suggestions). User explicitly asked for more
   than a single search box, then picked the "hybrid" control style.
4. **Shops:** ready shops as checkboxes, **plus a few empty slots** where the
   user types a site name + URL and it is parsed on the spot. This is the
   user's own interpretation of "چند فیلد خالی".
5. **Failure behaviour:** error row only. **No demo/fake data**, no silent
   fallback. Chosen by the user.
6. **Persistence:** none for data. No DB, no search history, no saved offers.
   The single exception is `localStorage.theme` for the theme choice
   (decision 11).
7. **v1 scope (from nabzebazaar.ir as UX reference):** market floor, per-shop
   sorted rows, specification block (brand/model/storage/RAM/color/origin),
   per-color price grouping when the source exposes it, last-updated time.
8. **Explicitly out of scope for v1:** 30-day price chart, basket analyzer,
   import-cost calculator, accounts/auth, price-drop alerts, Android app.
   The chart is impossible without persistence; the rest is B2B scope.
9. **Copying the reference:** UX pattern only. No logo, name, copy, images,
   markup or CSS from `nabzebazaar.ir`.
10. **Paid subscription: deferred (2026-11-04).** No pricing page, no checkout,
    no auth and no payment gateway in v1. A subscription is meaningless while
    the app is stateless, and there is no gated feature yet. Revisit only after
    the free comparator works and a premium capability exists (e.g. price
    history, drop alerts, exports). Do not add a mock «تعرفه» page — a pricing
    page without a real checkout erodes trust.
11. **Theme: light + dark with a switch (2026-11-04).** User chose "هر دو با
    سوییچ". Implement like `myportfolio2`: `data-theme` on `<html>`, token
    values swapped in `globals.css`, a no-flash script as the first child of
    `<body>`, and a header toggle. Never use `dark:` variants — they are not
    wired to this theme. This is the only use of `localStorage`.
12. **Shipping adapters: Technolife + Farnaa only (2026-11-04).** These are the
    only shops that answered with parseable prices from this network. Digikala,
    Torob, Mobile140, Pishromobile, Hamrahtel, MeghdadIT and Gooshi were
    probed and dropped (reasons in the scraping log). Custom slots cover
    everything else. Do not re-add a provider that was dropped without a fresh
    probe and a working parse.
13. **Colour is a soft filter.** Technolyfe exposes colour as hex swatches, not
    names, so many rows have no detectable colour. Selecting a colour keeps
    matching rows **and** rows with unknown colour, and the UI says how many
    were unknown. Storage is strict: when a storage is selected, an offer whose
    storage could not be parsed is dropped.

## Scraping log

Re-verify before relying on any row; Iranian shops change markup and block
ranges often. Test with a browser `user-agent` and `accept-language: fa-IR`.

| Date | Source | Status | Finding |
| --- | --- | --- | --- |
| 2026-11-04 | `technolife.com/product/list/search?keywords=` | 200 | ~1 MB HTML; real search results in `__NEXT_DATA__` → `data.pages[0].results[]`. **Used.** `/search?q=` is a JS landing page with unrelated products — do not use it. |
| 2026-11-04 | `farnaa.com/search?q=` | 200 | Server-rendered `col-md-3` product cells; price in `.pric ins`, colours in `.wz-matrix-tooltip-text`. **Used.** `item trs-3` cards on the same page are a carousel, not search results. Meta tags precede the cell and belong to the **previous** product. |
| 2026-11-04 | `digikala.com/search?q=` | 200 | ~14 KB JS shell; `__NEXT_DATA__` `pageProps` empty. Dropped. |
| 2026-11-04 | `api.digikala.com/v1/search` | timeout | Request timed out from this network. |
| 2026-11-04 | `torob.com` | refused | `ECONNREFUSED`. |
| 2026-11-04 | `mobile140.com` | TLS error | `ERR_TLS_CERT_ALTNAME_INVALID`. |
| 2026-11-04 | `pishromobile.com` | refused | Served a WooCommerce list once, then `ECONNREFUSED`. |
| 2026-11-04 | `hamrahtel.com` | refused | `ECONNREFUSED`. |
| 2026-11-04 | `meghdadit.com` | 404 | Tested `/search/…` and `/Search?…`. |
| 2026-11-04 | `gooshi.online` | 200 | Angular template (`{{item.price}}`); prices arrive client-side. |

## Known gaps

- Only two live shops. A third adapter would materially improve the comparison.
- Technolyfe colours are hex swatches, so colour matching is usually unknown
  there (decision 13).
- Only the first results page is read. The cheapest offer is almost always
  there, but not guaranteed.
- Farnaa's search returns loose matches (e.g. "S24 ultra" for "S24"); model
  matching is token-based and deliberately not exact.
- Custom URLs are best-effort: JSON-LD, meta tags or the first price-looking
  number. Pages behind a bot challenge will show an error row.

## Next steps (optional, in order of value)

1. Probe and add one more shop adapter (candidate: a WooCommerce store that
   stays reachable). Follow the provider contract, add it to
   `lib/providers/index.ts` and `lib/shops.ts`.
2. Read a second results page only if the first page yields no priced offer.
3. Per-colour floor prices (currently the floor is across all colours).
4. Only if the user asks: price history (needs a database), alerts (needs a
   scheduler), or a pricing page (needs auth + a gateway).

## Session log

- **2026-11-04** — Requirements gathered. Folder, language, form fields, shop
  selection, fallback behaviour and persistence decided. Reachability probe of
  five shops. UX reference (`nabzebazaar.ir`) reviewed; scope fixed. Docs
  created; no code yet.
- **2026-11-04** — Paid subscription discussed and deferred: no auth, no
  checkout, no pricing page in v1 (decision 10).
- **2026-11-04** — UI direction fixed: Tailwind + hand-built components, no UI
  library, no shop logos, light + dark themes with a header switch
  (decision 11).
- **2026-11-04** — Built v1: scaffold, layout, form, API, Technolife + Farnaa
  adapters, custom URL provider, floor/colour/timestamps, theme toggle.
  `typegen`, `tsc`, `lint`, `build` and an end-to-end browser smoke test pass.
  Dropped the unreachable shops (decision 12). Fixed two parser bugs found in
  testing: Farnaa meta-tag ownership and unit-less storage ("ظرفیت ۲۵۶ رم ۱۲").
  Fixed the cheapest badge (JSON gives `floor` and `offers[0]` different object
  identities).

## How to update this file

1. Change the **Last updated** row and **Current state**.
2. Move the rows in **Status** forward (`⬜` → `🟡` → `✅`); mark blockers `⛔`.
3. Append any new decision under **Decisions** with date + reason. Never delete
   a decision — supersede it with a new numbered one.
4. Add scraping findings to **Scraping log** (URL, status, what changed).
5. Rewrite **Next steps** so it reflects reality.
6. Add one line to **Session log**: date, what was done, what is left.
