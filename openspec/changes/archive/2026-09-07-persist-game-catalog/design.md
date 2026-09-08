## Context

See proposal.md - Why. Current state: `lib/games.ts` exports a hardcoded `GAMES` array, a synchronous `getGame(id)`, `CATS`, and `seededScores()`. `lib/home.ts` derives `featuredGames`, `stats`, and `recentActivity` as top-level module constants evaluated at import time from `GAMES`. `components/GamePlayer.tsx` picks the real engine with a single hardcoded check (`game.id === 'asteroids'`). The leaderboard already reads Supabase via a deliberately cookie-free server client (`lib/leaderboard-server.ts`) so `/juegos/[id]` stays ISR-prerenderable; `scores.game_id` is `text` with a regex CHECK and no FK. Live DB currently has only `public.scores` (8 rows, all `game_id = 'asteroids'`).

## Goals / Non-Goals

**Goals:**
- Persist the catalog in Postgres/Supabase as the single source of truth, publicly readable, admin-writable only.
- Preserve existing rendering characteristics: `/juegos/[id]` and other catalog-driven pages stay prerenderable (ISR), not forced into fully dynamic rendering.
- Make a catalog read failure observably distinct from "game not found" / "catalog empty" everywhere it's checked.
- Give the DB a real say in what's playable (`playable` flag) without requiring code to know the full game list.

**Non-Goals:**
- Wiring Hall of Fame's score rows to real `scores` data (still `seededScores`) — only its game tabs become catalog-driven.
- An admin UI for editing catalog rows — rows are managed directly via SQL/migrations for now.
- Generated TypeScript DB types (`supabase gen types`) — out of scope; hand-written types continue, matching current convention.

## Decisions

**Table shape mirrors the `Game` type directly.** Columns `id, title, short, long, cat, cover, color, best, plays, playable, sort_order, created_at`. Alternative considered: a JSONB `metadata` blob — rejected, since it loses column-level CHECK constraints and query-ability for no benefit at this scale (9 rows).

**`plays` becomes an integer, not the display string (`'2.1K'`).** The string is a formatting artifact; storing it as text would make the "best recorded score" style sorting/comparison impossible later. Format for display with a small helper at render time.

**`cover` gets a regex CHECK (`^cover-[a-z0-9-]{2,30}$`), not a Postgres enum tied to the 9 known CSS classes.** The DB has no visibility into `app/globals.css`; an enum would need a migration every time a new cover class is added. The regex catches malformed values; a code-side known-covers set with a neutral fallback catches unknown-but-well-formed ones. `color` is a small closed set (`cyan/magenta/yellow/green`) tied to design tokens, so an `in (...)` CHECK is precise and cheap to extend later.

**`sort_order` as an explicit, indexed integer column**, not implicit insertion order or a derived sort (e.g., by `best`). Decouples "which 6 games are featured" from any other ordering concern and survives future re-seeding.

**Migrations split into three files** (`0004_create_games_table.sql`, `0005_seed_games.sql`, `0006_add_scores_game_id_fk.sql`), matching the existing one-concern-per-file convention (`0001` table, `0002` RLS, `0003` trigger). The FK is deliberately last and in its own file: it can only succeed once the seed exists, and isolating it makes that ordering dependency visible in the filename sequence rather than buried inside a larger script.

**FK constraint added as `not valid` then `validate`ed in a second statement**, rather than a single `alter table ... add constraint ... foreign key ...` statement. If an unforeseen orphaned `game_id` exists, the failure localizes to the `validate` step for manual triage instead of the whole migration aborting opaquely.

**RLS**: enable RLS, one `games_select_public` policy (`select` to `anon, authenticated`, `using (true)`), then explicit `revoke insert, update, delete` from both roles — no write policy at all. Mirrors `0002_add_scores_rls_policies.sql`'s public-read pattern; the catalog is admin-managed, so there is intentionally no path for the app to write it.

**Server-side reads via a new `lib/games-server.ts`, cloned from `lib/leaderboard-server.ts`'s shape**: a cookie-free anon `createClient` (`persistSession: false`), `import 'server-only'`, and a never-throws result union — `{ ok: true; games } | { ok: false }` for the list, `{ ok: true; game: Game | null } | { ok: false }` for a single lookup. The three-state single-lookup result (found / definitively absent / read failed) is what makes the not-found-vs-error distinction in the specs implementable. Reads are wrapped in React `cache()` so `generateMetadata` and the page body share one round-trip per request. Alternative considered: reusing `utils/supabase/server.ts` (the cookie-bound client) — rejected for the same reason the leaderboard avoided it: reading `cookies()` would force full dynamic rendering on pages that currently rely on ISR.

**Engine registry (`lib/game-engines.ts`) uses a static import, not `next/dynamic`.** `AsteroidsGame` is a `forwardRef` exposing `{ pause, resume, reset }`, and `GamePlayer.restart()` calls `asteroidsRef.current?.reset()`. `next/dynamic` does not forward refs, so switching to it would silently break restart. With exactly one engine today, the code-splitting benefit of `next/dynamic` doesn't outweigh that risk; revisit when a second engine is added.

**Effective playability = `playable && registry has an entry`.** Both directions matter: `playable && !engine` (data ahead of code, e.g. mid-rollout) falls back to the simulated arena rather than crashing; `!playable && engine exists` (e.g. a rollback) also falls back — the DB flag is a real kill switch, not just a hint.

**`GameGrid` and `HallOfFame` (both Client Components) receive `games` as a prop from an async Server Component parent**, rather than fetching client-side. Client-side fetching would blank the prerendered HTML on `/games` (SEO/first-paint loss), add a per-visitor round-trip for a 9-row table, and create a second error surface to handle. The existing filtering logic (search + category, `useMemo`) needs no server involvement and is unchanged.

**`lib/home.ts`'s `featuredGames`, `stats`, `recentActivity` collapse into one async `getHomeData()`** (call once per request), replacing top-level constants that can no longer be computed synchronously. `topPlayersToday` stays a module constant — it's pure `seededScores` output with no DB dependency. `app/page.tsx` becomes an async Server Component calling `getHomeData()` once and passing results down; `GamesRail`, `StatsBand`, `ActivitySection` become prop-taking Server Components instead of importing the constants directly.

**Not-found vs. error stays a hard split, per game-catalog and game-detail specs**: `game: null` → `notFound()`; `{ ok: false }` → throw, caught by a new `app/juegos/[id]/error.tsx` (none exists today). `generateMetadata` must not throw on a read failure — falls back to a generic title. `generateStaticParams` returns `[]` on `{ ok: false }` and relies on default `dynamicParams: true`, so a build-time outage degrades to on-demand rendering rather than failing the build.

**ISR revalidation windows added explicitly.** supabase-js's `fetch` does not participate in the Next.js fetch cache, so a page reading the catalog without its own `revalidate` export would freeze at build-time values forever. Add `export const revalidate = 300` to `app/page.tsx`, `app/games/page.tsx`, and the Hall of Fame page; `/juegos/[id]` already sets `revalidate = 60`.

**`app/actions/revalidate-leaderboard.ts` switches from validating `gameId` against the in-memory `GAMES` array to calling `getGameById`**, returning an explicit failure on `{ ok: false }` rather than silently accepting an unverifiable id.

## Risks / Trade-offs

- **FK addition could fail if an orphaned `game_id` exists in `scores`.** → Mitigation: `not valid` + separate `validate constraint` step localizes any failure; live DB already confirmed all 8 existing rows are `'asteroids'`, so this is a defense against future drift, not a known current problem.
- **A DB outage during a cold ISR revalidation could serve stale catalog data past its 300s window if Supabase stays down.** → Mitigation: acceptable for a game catalog (low change frequency); the error boundary still protects the page from crashing, and stale-while-revalidate behavior is the intended ISR trade-off, not a bug.
- **Static-import engine registry doesn't scale past a couple of engines** (every engine ships in the initial bundle). → Mitigation: explicitly deferred; revisit with `next/dynamic` + a ref-forwarding wrapper once a second engine exists.
- **`cover` regex CHECK doesn't prevent referencing a CSS class that doesn't exist in `app/globals.css`.** → Mitigation: code-side known-covers set with a neutral fallback class catches this at render time; accepted as a soft constraint since the DB has no visibility into the stylesheet.

## Migration Plan

1. Apply `0004_create_games_table.sql` (table + RLS) via Supabase MCP `apply_migration`.
2. Apply `0005_seed_games.sql` (idempotent upsert of all 9 current entries, `playable = true` only for `asteroids`).
3. Apply `0006_add_scores_game_id_fk.sql` (`not valid` FK + `validate constraint`).
4. Verify via `list_tables` (games exists, RLS enabled, FK present and validated) and `select count(*) from games`.
5. Deploy code changes only after all three migrations are applied and verified — the app reads `playable` and `sort_order`, which don't exist before step 1.
6. Rollback: migrations are additive (new table, new FK) and reversible independently — drop the FK first, then the table, if a rollback is needed; no destructive change to `scores` at any step.
