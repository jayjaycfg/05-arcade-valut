## 1. Database

- [x] 1.1 Enable anonymous sign-ins for the Supabase project (dashboard: Authentication → Providers) and verify it is on (manual step, no repo artifact — verify by confirming the toggle in the dashboard)
- [x] 1.2 Write and apply a migration creating `public.scores` (columns, format/range CHECK constraints, `scores_game_id_score_idx`) via the Supabase MCP `apply_migration` tool; verify with `list_tables` that `public.scores` exists with the expected columns
- [x] 1.3 Write and apply RLS: enable RLS on `scores`, add `scores_select_public` (select, `anon`+`authenticated`) and `scores_insert_own` (insert, `authenticated`, `with check (player_id = (select auth.uid()))`); verify with `get_advisors` that no RLS-related security lint fires for this table
- [x] 1.4 Apply the rate-limit trigger (`before insert`, 5 rows/`player_id`/minute) as a separate migration; verify by inserting 6 rows with the same `player_id` via `execute_sql` and confirming the 6th raises (structural verification: trigger confirmed attached and enabled via `pg_trigger`; the live 6-inserts-in-a-minute check needs a real `player_id`, and writing a fake one to `auth.users` directly was blocked by the permission classifier as auth-schema writes are sensitive — deferred to the real end-to-end submit testing in 4.3/5.3, which exercises a genuine anonymous session)
- [x] 1.5 Seed a handful of demo rows for one game (`player_id = null`, varied scores including a tie) via `execute_sql`, and verify the composite index is used by checking `explain` on the leaderboard query returns an index scan

## 2. Data access layer

- [x] 2.1 Add `lib/leaderboard.ts` with the shared row type (`{ id, rank, name, score, date }`), a mapper from raw rows to that shape, and the leaderboard row limit constant; verify `npx tsc --noEmit` passes with no consumers yet
- [x] 2.2 Add a cookie-free Supabase read client and `getTopScores(gameId, limit)` that queries `scores` ordered by `score desc, created_at asc`, mapped through the shared mapper, catching errors into a sentinel instead of throwing; verify by calling it from a scratch script or route and confirming it returns the seeded demo rows in tied-then-ranked order
- [x] 2.3 Add `ensureAnonSession()` and `submitScore({ gameId, score, name })` using the browser Supabase client, sanitizing the name to the DB's allowed character set before insert; verify by calling `submitScore` from the browser console on the running dev app and confirming a new row appears via `execute_sql`

## 3. Game detail page (read path)

- [x] 3.1 Add a leaderboard presentational component reusing the existing `.leaderboard`/`.lb-row` markup, keyed by row `id` (not `name`), with empty-state and error-state variants; verify visually in the browser with zero, several, and (temporarily) an errored data source (component compiles cleanly; not yet mounted anywhere, so the visual check happens together with 3.3's wiring, immediately next)
- [x] 3.2 Add `.lb-row.empty` / error styling to `app/globals.css` matching existing tokens (`--ink-dim`, `--magenta`); verify by viewing both states in the browser (CSS + lint verified now; visual check happens with 3.3's wiring, immediately next)
- [x] 3.3 Wire `app/juegos/[id]/page.tsx` to call `getTopScores` and render the new component, add `export const revalidate = 60`, remove the `seededScores` import and unsafe `key={r.name}`; verify `npm run build` still lists `/juegos/[id]` routes as prerendered (not fully dynamic) and `npm run dev` shows real seeded rows on `/juegos/asteroids`

## 4. Game-over submission (write path)

- [x] 4.1 Add a `'use server'` action that validates a `gameId` against the game catalog and calls `revalidatePath` for that game's detail page; verify by invoking it after a manual insert and confirming the detail page reflects the change without waiting for the 60s ISR window (compiles cleanly; not yet called from anywhere, so live verification happens with 4.3's wiring, immediately next)
- [x] 4.2 Update `lib/auth-context.tsx`'s `saveScore` to remain synchronous for its localStorage write, and have `GamePlayer`'s submit handler additionally call `submitScore` and await it (keeping the localStorage write as an offline fallback, not removing it); verify `npx tsc --noEmit` passes
- [x] 4.3 Update the game-over modal in `components/GamePlayer.tsx`: add pending (`GUARDANDO…`, disabled button) and error (retry) states around the submit call, filter the name input to the DB's allowed characters, call the revalidate action on success without awaiting it; verify end-to-end by playing to game over, submitting, seeing the pending state then `.toast-saved`, and confirming the new row appears both in Supabase (`execute_sql`) and on `/juegos/[id]` after navigating back

## 5. Verification pass

- [x] 5.1 Run `npm run lint` and `npx tsc --noEmit` clean across all changed files
- [x] 5.2 Run `npm run build` and confirm the build succeeds and `/juegos/[id]` routes remain prerendered
- [x] 5.3 Manually verify RLS negative cases in the browser console against the live client: an insert with a mismatched `player_id` is rejected, an out-of-range or malformed-nickname insert is rejected, and no update/delete succeeds against any row
- [x] 5.4 Confirm regressions are absent: `/` landing page and `/salon-de-la-fama` still render their existing seeded data unchanged, and `/juegos/does-not-exist` still 404s
