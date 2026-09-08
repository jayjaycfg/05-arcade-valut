## 1. Database migrations (must land before any code deploy)

- [x] 1.1 Write `supabase/migrations/0004_create_games_table.sql` (table with all columns/CHECKs from design.md, `games_sort_order_idx`, RLS enabled, `games_select_public` policy, revoke insert/update/delete from anon+authenticated) and apply via Supabase MCP `apply_migration`; verify with `list_tables` that `games` exists with RLS enabled and the expected columns
- [x] 1.2 Write `supabase/migrations/0005_seed_games.sql` seeding all 9 current `GAMES` entries (idempotent `on conflict (id) do update`, `playable = true` only for `asteroids`, `plays` converted to integers) and apply it; verify `select count(*) from games` returns 9 and `select id from games where playable` returns only `asteroids`
- [x] 1.3 Write `supabase/migrations/0006_add_scores_game_id_fk.sql` (`not valid` FK from `scores.game_id` to `games.id` `on delete restrict`, then `validate constraint`) and apply it; verify with `list_tables` that the FK is present, and confirm an insert into `scores` with an unknown `game_id` is rejected

## 2. Server-side catalog data layer

- [x] 2.1 Add `playable` and `sortOrder` fields to the `Game` type in `lib/games.ts`; remove the `GAMES` array and synchronous `getGame()`; keep `type Game`, `CATS`, and `seededScores()`
- [x] 2.2 Create `lib/games-server.ts` cloning the cookie-free client pattern from `lib/leaderboard-server.ts` (`persistSession: false`, `import 'server-only'`, never-throws result unions), exporting `getAllGames(): Promise<{ ok: true; games: Game[] } | { ok: false }>` and `getGameById(id): Promise<{ ok: true; game: Game | null } | { ok: false }>`, both wrapped in React `cache()`, ordered by `sort_order`
- [x] 2.3 Add a small `formatPlays()` helper (e.g. `12400` → `'12.4K'`) and a known-covers set with a neutral fallback for unrecognized `cover` values

## 3. Engine registry

- [x] 3.1 Create `lib/game-engines.ts` exporting a `Record<string, ComponentType>` (statically imported, not `next/dynamic`, per design.md) mapping `asteroids` to `AsteroidsGame`, plus a `getEngine(id)` lookup
- [x] 3.2 Update `components/GamePlayer.tsx`: replace `const isAsteroids = game.id === 'asteroids'` (and its uses at the score/level/pause logic and the render branch) with an effective-playability check (`game.playable && getEngine(game.id)`), falling back to the simulated arena in both `playable && !engine` and `!playable && engine` cases; verify Asteroids still plays and restart (`asteroidsRef.current?.reset()`) still works via manual test

## 4. Page and component wiring

- [x] 4.1 Update `app/juegos/[id]/page.tsx`: `generateStaticParams` uses `getAllGames()` and returns `[]` on `{ ok: false }`; `generateMetadata` uses `getGameById` and never throws; page body distinguishes `game: null` (`notFound()`) from `{ ok: false }` (throw); keep `export const revalidate = 60`
- [x] 4.2 Add `app/juegos/[id]/error.tsx` as the error boundary for catalog read failures on the detail page
- [x] 4.3 Update `app/juegos/[id]/jugar/page.tsx` with the same not-found-vs-error split as 4.1
- [x] 4.4 Update `app/games/page.tsx` to be async, call `getAllGames()`, add `export const revalidate = 300`, and pass `games` (or an error flag) as a prop into `GameGrid`
- [x] 4.5 Update `components/GameGrid.tsx` to accept `games` as a prop instead of importing `GAMES`, and show an error-state message (distinct from the existing "no results" message) when the catalog failed to load
- [x] 4.6 Update `app/salon-de-la-fama/page.tsx` to be async, call `getAllGames()`, and pass `games` as a prop into `HallOfFame`
- [x] 4.7 Update `components/HallOfFame.tsx` to accept `games` as a prop instead of importing `GAMES`, guard the `useState(GAMES[0].id)` initializer against an empty array, and show an empty-state message when there are no games
- [x] 4.8 Replace the three top-level constants in `lib/home.ts` (`featuredGames`, `stats`, `recentActivity`) with a single async `getHomeData()`; keep `topPlayersToday` as a module constant
- [x] 4.9 Update `app/page.tsx` to be an async Server Component calling `getHomeData()` once, add `export const revalidate = 300`, and pass results as props into `GamesRail`, `StatsBand`, `ActivitySection`
- [x] 4.10 Update `app/actions/revalidate-leaderboard.ts` to validate `gameId` via `getGameById` instead of the removed `GAMES` array, returning an explicit failure on `{ ok: false }`

## 5. Verification

- [x] 5.1 Run `npm run build` and confirm `/juegos/[id]` prerenders all 9 game ids via `generateStaticParams`
- [x] 5.2 Run `npm run dev` and manually verify: `/` renders the rail and stats; `/games` lists 9 cards with working search/category filters; `/juegos/asteroids` shows detail plus the real leaderboard; `/juegos/asteroids/jugar` plays and restart resets the engine; `/juegos/bloque-buster/jugar` shows the coming-soon arena; `/juegos/no-existe` shows 404
- [x] 5.3 Simulate a catalog read failure (e.g. temporarily point the Supabase URL env var at an unreachable host) and verify `/juegos/asteroids` renders the error boundary (not a 404) while `/` still renders without crashing; restore the env var afterward
- [x] 5.4 Run `npm run lint` and fix any resulting issues
