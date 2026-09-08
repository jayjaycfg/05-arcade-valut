## Why

The game catalog is a hardcoded array in `lib/games.ts` — the whole list ships to the browser (it's imported by Client Components), it can't be edited without a redeploy, and `scores.game_id` has no foreign key to anything, so nothing stops a leaderboard entry from referencing a game that doesn't exist. Only one game (`asteroids`) is actually playable today; the rest are placeholders with no code-side way to distinguish them from the database.

## What Changes

- Add a `public.games` table (Supabase/Postgres) as the persisted source of truth for the catalog, seeded with the current 9 entries.
- Add a `playable` flag per game so the UI can distinguish real games from coming-soon placeholders without relying on a hardcoded id check.
- **BREAKING**: Add a foreign key from `scores.game_id` to `games.id` (`on delete restrict`), so a score can no longer reference a nonexistent game.
- Replace the hardcoded `GAMES` array and synchronous `getGame()` lookup with async, server-side Supabase reads (`lib/games-server.ts`), following the existing cookie-free read pattern used by the leaderboard.
- Introduce a code-side engine registry (`lib/game-engines.ts`) mapping a game id to its React engine component, replacing the single hardcoded `game.id === 'asteroids'` check in `GamePlayer`.
- Distinguish "game not found" (404) from "catalog failed to load" (error state) everywhere a game is looked up — a data-source failure must never render as a 404.
- Refactor `lib/home.ts`'s top-level catalog-derived constants (`featuredGames`, `stats`, `recentActivity`) into an async `getHomeData()`, since they can no longer be computed synchronously at import time.

## Capabilities

### New Capabilities
- `game-catalog`: Defines the persisted game catalog — required fields, the `playable` flag, public read access, and catalog read-failure semantics.

### Modified Capabilities
- `game-library`: Catalog listing is now sourced from persisted records instead of a hardcoded list; add an explicit error state when the catalog fails to load.
- `game-detail`: Distinguish a real "unknown game" (not-found) from a catalog read failure (error state, not 404).
- `hall-of-fame`: Per-game leaderboard tabs are now sourced from the persisted catalog instead of the hardcoded list.
- `game-player`: A game marked not-playable in the catalog shows the coming-soon arena even if a matching engine happens to exist in the registry.

## Impact

- **Database**: new `public.games` table + RLS policy (public read, no writes); new FK constraint on `public.scores.game_id`.
- **Code removed**: `GAMES` array and sync `getGame()` from `lib/games.ts`.
- **Code added**: `lib/games-server.ts` (server-side catalog reads), `lib/game-engines.ts` (engine registry), `app/juegos/[id]/error.tsx`.
- **Code modified**: `app/page.tsx`, `app/games/page.tsx`, `app/juegos/[id]/page.tsx`, `app/juegos/[id]/jugar/page.tsx`, `app/salon-de-la-fama/page.tsx`, `components/GameGrid.tsx`, `components/HallOfFame.tsx`, `components/GamePlayer.tsx`, `lib/home.ts`, `app/actions/revalidate-leaderboard.ts`.
- **Out of scope**: Hall of Fame's score rows stay on `seededScores` fake data — only its game tabs become catalog-driven. Wiring the podium/table to real `scores` is a separate change.
