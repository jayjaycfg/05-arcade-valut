## Context

See `SPEC-001-add-per-game-leaderboard.md` - Why. Relevant current state:

- Supabase deps (`@supabase/ssr`, `@supabase/supabase-js`) and client helpers (`utils/supabase/{client,server,middleware}.ts`) exist but are unused. The Supabase project (`fcmnqwglfywuhidxgxrk`) currently has **no tables and no auth users** — this is a clean slate, not a migration of existing data.
- `app/juegos/[id]/page.tsx` is a fully static route: `generateStaticParams` prerenders all 9 catalog ids, no Request-time API is used today.
- Next.js 16 renamed `middleware.ts` to `proxy.ts`; there is no root proxy file, and `utils/supabase/middleware.ts` is currently dead code (it also never calls `getUser()`, so it would refresh nothing as-is).
- `next.config.ts` does not enable `cacheComponents`, so the project is on the previous (non-PPR) caching model, where `export const revalidate` on a page still works.
- `components/GamePlayer.tsx` captures a 10-character uppercase name at game over and calls the synchronous `saveScore()` in `lib/auth-context.tsx`, which appends to `localStorage['av_scores']` — a value nothing reads back today.

## Goals / Non-Goals

**Goals:**
- Persist real scores per game in Supabase and read them back on the game detail page.
- Keep `/juegos/[id]` cheap to serve (avoid turning 9 static routes into fully dynamic ones).
- Give players a submission identity without requiring sign-up.

**Non-Goals:**
- Server-authoritative score validation (see proposal Non-goals).
- Changing the mock `AuthProvider` sign-in/guest model.
- Introducing a root `proxy.ts` — no server code in this change reads cookies/session, so nothing needs proxy-based session refresh yet.

## Decisions

### Persistence: single `scores` table, nickname denormalized on the row
```sql
create table public.scores (
  id          uuid primary key default gen_random_uuid(),
  game_id     text        not null check (game_id ~ '^[a-z0-9-]{2,40}$'),
  player_id   uuid        references auth.users(id) on delete set null,
  nickname    text        not null check (nickname ~ '^[A-Z0-9_]{1,10}$'),
  score       integer     not null check (score >= 0 and score <= 100000000),
  created_at  timestamptz not null default now()
);
create index scores_game_id_score_idx on public.scores (game_id, score desc, created_at asc);
```
No `profiles` table: the nickname is captured at the moment of the run (matches the existing "TUS INICIALES" input), and a normalized profile would add a join to the hot read for no benefit at this scope. `game_id` is plain text with a format check, not a foreign key to a games table — the catalog lives in code (`lib/games.ts`), not the database; an unknown/stale id simply returns no rows rather than failing a write.

`player_id` is nullable with `on delete set null` (not `not null ... cascade`), so that future cleanup of stale anonymous auth users never deletes leaderboard history. The INSERT policy (below) still requires a real, matching `player_id` on every client-submitted row.

### RLS: public read, owner-only insert, no update/delete
```sql
alter table public.scores enable row level security;

create policy "scores_select_public" on public.scores
  for select to anon, authenticated using (true);

create policy "scores_insert_own" on public.scores
  for insert to authenticated
  with check (player_id = (select auth.uid()));
```
No UPDATE or DELETE policy exists at all, so both are denied by default — scores are append-only. `(select auth.uid())` (not bare `auth.uid()`) is the Supabase-recommended form that avoids per-row re-evaluation. Anonymous Supabase users hold the `authenticated` role, which is exactly what this policy needs — no separate anonymous-specific policy is required.

A `before insert` trigger caps submissions to 5 per `player_id` per minute (raises a Postgres exception) as a cheap guard against scripted spam; it is defense-in-depth, not a security boundary.

### Identity: lazy anonymous auth, orthogonal to the existing mock `AuthProvider`
`supabase.auth.signInAnonymously()` is called only inside the submit path (`ensureAnonSession()`), never on page load or app mount. Calling it eagerly would create a permanent `auth.users` row for every visitor who never plays and risks Supabase's documented 30-signups/hour/IP limit being hit by passive traffic.

This is a second, independent identity layer from `lib/auth-context.tsx`'s `av_user`:
- `av_user` (localStorage) = **display identity** — what nickname prefills the game-over input, what `Nav` shows.
- Supabase anonymous auth = **device identity** — the `player_id` RLS checks on insert.

The existing guest path (`signIn(null)`) is unaffected; guests can still submit scores (they get an anonymous Supabase identity at submit time, nickname defaults to `INVITADO`). No account is required to appear on a leaderboard, consistent with the proposal's non-goals.

### Rendering: cookie-free server read + ISR, not a cookie-bound Suspense read
Three options were weighed for `/juegos/[id]`:
1. **Cookie-bound server read (`utils/supabase/server.ts`) wrapped in `<Suspense>`.** Rejected — without `cacheComponents` enabled, touching `cookies()` forces the whole route to dynamic rendering regardless of the Suspense boundary; it also mixes session state into a page meant to be shared/cached.
2. **Client-side fetch in a `'use client'` component.** Viable fallback — page stays fully static, leaderboard populates post-hydration. Costs a loading flash and no SSR'd content.
3. **Cookie-free server read (`createClient(url, anonKey)` with `persistSession: false`, no cookies touched) + `export const revalidate = 60` on the page. ← chosen.** All 9 routes stay prerenderable; content refreshes at most once a minute; unknown ids still 404 via `notFound()` since `dynamicParams` defaults to `true`. The read authenticates as `anon`, which the public SELECT policy already allows, so no session handling is needed server-side at all.

Because ISR alone could show a stale board for up to 60s right after a submit, the submit flow also calls a small `'use server'` action that validates the `gameId` against the catalog and calls `revalidatePath` for that game's detail page — fire-and-forget from the client, not blocking the save confirmation.

If build-time DB coupling from option 3 turns out to be unacceptable (e.g., builds must succeed with no DB reachable), option 2 is the documented fallback; the data-access module (`getTopScores`) is shared by both, so switching is a page-level change only.

### Data access shape
- `lib/leaderboard.ts` — pure types/mapping (isomorphic, no Supabase import): the row shape returned to callers stays `{ rank, name, score, date }` compatible with the existing `.leaderboard`/`.lb-row` markup, plus an `id` field so React keys are stable (the current page's `key={r.name}` is unsafe once names can repeat — this change fixes that).
- Server-side read and client-side write are separate modules so the read path never accidentally pulls in cookie-bound auth code.

## Risks / Trade-offs

- **Client-submitted scores are spoofable** → accepted and documented in the proposal's Non-goals; RLS ownership + column constraints + rate-limit trigger are the only guards.
- **ISR staleness (≤60s) if the revalidate action fails silently** → acceptable degradation; the leaderboard still updates on the next natural revalidation window.
- **Build-time DB read (option 3) means `next build` depends on Supabase being reachable** → mitigated by having `getTopScores` catch and return an error sentinel rather than throw, so a DB outage degrades to the error-state UI, not a failed build.
- **Anonymous sign-ins must be enabled in the Supabase dashboard** (Auth → Providers) → manual, one-time project configuration outside this repo; submission fails with a distinguishable error until it's done.
- **Hall of Fame / landing page keep showing fake data for the same games now shown truthfully on the detail page** → accepted scope boundary (proposal Non-goals); flagged as a known inconsistency for a follow-up change.

## Migration Plan

1. Apply the `scores` table + RLS + indexes as one Supabase migration via MCP; apply the rate-limit trigger as a second, independently revertible migration.
2. Enable anonymous sign-ins in the Supabase dashboard (manual).
3. Ship the read path first (detail page reads `getTopScores`) — safe on its own, degrades to empty state with zero existing rows.
4. Ship the write path (`GamePlayer` submit flow) once the read path is verified.

**Rollback**: revert the application commit(s); drop the `scores` table in a follow-up migration (additive-only, nothing else references it).
