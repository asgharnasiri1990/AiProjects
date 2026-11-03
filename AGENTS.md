# AiProjects

Four **independent** Next.js apps in one git repo. There is no workspace tooling, no
root `package.json`, and no shared code: each app owns its `package.json`,
`node_modules`, and `AGENTS.md`. Always `cd` into the app directory before running
anything — `npm install` / `npm run dev` at the repo root does nothing useful.

| Folder | Package name | What it is |
| --- | --- | --- |
| `shop/` | `online-shop` | **TomanShop** — a storefront (products, cart, auth, checkout) built entirely on the public `practice.amirm.me` API. See `shop/AGENTS.md` before touching it. |
| `flight-tracker/` | `expense-tracker` ⚠️ | Single-page flight lookup with one route handler, `app/api/flight/route.ts`. The package name is a leftover from an earlier project — the folder name is the real one. |
| `myPortfolio/` | `portfolio` | The first bilingual portfolio attempt (Swiss-warm, paper + moss). Superseded by `myportfolio2/`; kept for reference. |
| `myportfolio2/` | `portfolio-v2` | **The live portfolio** — bilingual (فارسی/English), Swiss-grid, static, no database. Hero, work index, case studies, archive, about, contact. Content in `src/content/`. See `myportfolio2/AGENTS.md`. |

All four apps use the same stack: **Next.js 16.4.3 (App Router) · React 19.3 · TypeScript 5 · Tailwind CSS v4**.

## Read the framework first

These are Next 16, not the Next you may know. Conventions that differ from most
training data:

- `middleware.ts` was renamed to **`proxy.ts`** (`export default function proxy(req)`);
  the file sits in `src/` or the project root, next to `app/`.
- Route props are generated types: `PageProps<"/shop">`, `LayoutProps<"/">`.
  Do not hand-write `{ params, searchParams }` interfaces.
- `params` and `searchParams` are **Promises** — always `await` them.

Each app's `AGENTS.md` starts with an auto-managed block that says this. Before
writing code, read the relevant guide in that app's `node_modules/next/dist/docs/`.
That directory is the source of truth for this exact version; when a doc disagrees
with your memory, the doc wins.

> The `<!-- BEGIN:nextjs-agent-rules --> … <!-- END:nextjs-agent-rules -->` block is
> written and re-added by `next dev`. It is upserted in place, so content you add
> **outside** the block is preserved. Never edit inside it.

## Verify before committing

Run these inside the app you changed:

```powershell
npx tsc --noEmit      # types
npm run build         # real gate: compiles + type-checks all routes
```

`npm run lint` currently fails in `shop/` on pre-existing React Compiler rules
(JSX inside `try/catch`, `setState` inside effects). That is **not** a regression
signal — record the count before and after your change and compare. `next build`
does not run ESLint, so a green build does not mean a green lint.

## Conventions

- PowerShell on Windows. Prefer `Get-Content`, `Select-String`, `Invoke-WebRequest`
  over grep/sed/curl idioms.
- Dev servers commonly run on **port 3000** for one app at a time; `next dev` will
  pick another port if it is taken. Only one app can hold it.
- Env files are real and gitignored: `.env.local` exists in both apps. Never commit
  them, and never print secrets into a commit message or a log.
- Don't reformat or reorganize a file you were not asked to change. These apps are
  hand-polished; large diffs hide the actual fix.

## API budget (matters for `shop/`)

The practice API rate-limits to **60 requests/minute per client**. Server Components
call it directly, so a single page view can cost several requests. Before adding a
fetch, ask whether it can be deduped (`React.cache`), cached (`revalidate`), or
merged into an existing call.
