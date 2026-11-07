# AiProjects — repo progress

> **Repo-level state only.** Each app owns its own `PROGRESS.md`; read that
> before working inside an app. This file answers "what exists, what changed
> recently, and where can I go back to?".

| | |
| --- | --- |
| **Last updated** | 2026-11-07 |
| **Current state** | Six independent apps. `price-compare/` v1 is merged into `main` and pushed. |
| **Working checkpoint** | tag `checkpoint-2026-11-07` (see below) |

## Apps

| Folder | Package | State | App-level progress |
| --- | --- | --- | --- |
| `shop/` | `online-shop` | TomanShop storefront on the practice API. | `shop/PROGRESS.md` |
| `flight-tracker/` | `expense-tracker` | Single-page flight lookup; package name is a leftover. | — |
| `myPortfolio/` | `portfolio` | First portfolio attempt; reference only. | — |
| `myportfolio2/` | `portfolio-v2` | Second portfolio; superseded by v3. | — |
| `myportfolio3/` | `portfolio-v3` | Live portfolio, English + Persian. | `myportfolio3/PROGRESS.md` |
| `price-compare/` | `price-compare` | Persian phone price comparator; Technolife + Farnaa + custom URLs. | `price-compare/PROGRESS.md` |

## Recent work

- **2026-11-07** — `price-compare/` v1 built and verified (typecheck, lint,
  build, live API and browser smoke test), committed on `feat/price-compare`,
  merged into `main`, and pushed.
- **2026-11-07** — Hero headline changed to «نبض بازارو بگیر، کف قیمتها رو ببین».
- **2026-11-07** — Repo docs updated: root `AGENTS.md` now lists six apps;
  this file added.

## Checkpoints

| Tag | Commit | What it captures |
| --- | --- | --- |
| `checkpoint-2026-11-07` | `323be73` | price-compare v1 merged + hero headline + portfolio-v3 stable state. |
| `v3-stable-2026-11-07` | `323be73` | Same commit, created earlier for portfolio-v3. |

Tags are pushed to `origin`, so `git fetch --tags` on any clone restores them.

Return to a checkpoint without moving `main`:

```powershell
git checkout checkpoint-2026-11-07
# or start a branch from it
git switch -c restore-2026-11-07 checkpoint-2026-11-07
```

## Next steps

- `price-compare/`: optional third shop adapter, second results page when the
  first has no priced offer, per-colour floor. Details and decisions are in
  `price-compare/PROGRESS.md`.
- Other apps: see their own `PROGRESS.md`; nothing pending at repo level.

## How to update this file

1. Update **Last updated** and **Current state**.
2. Change the app table only when an app is added, removed or its status moves.
3. Add one line per meaningful repo-level change under **Recent work**.
4. Add every new checkpoint tag to the table (tag, full-ish commit, what it
   captures).
5. Keep app-specific detail out of here — put it in that app's `PROGRESS.md`.
