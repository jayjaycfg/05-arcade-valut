## Why

Every leaderboard in Arcade Vault is fake: `seededScores()` generates deterministic scores from a hardcoded player list, and the existing `saveScore()` writes to `localStorage['av_scores']`, which nothing ever reads. Players cannot actually compete. Supabase is already installed and configured (client/server helpers, populated env vars, MCP access) but unused. This change wires it up for the one capability that most needs to be real: a per-game leaderboard.

## What Changes

- Add a `scores` table in Supabase (RLS-protected: public read, owner-only insert, no update/delete).
- Add lazy Supabase anonymous authentication, triggered only when a player submits a score (not on page load).
- Replace the fake leaderboard on the game detail page (`/juegos/[id]`) with real data read from Supabase.
- Change the game-over score submission in `GamePlayer` from a synchronous localStorage write to an async Supabase insert, with loading/error/retry UI. The existing localStorage write is kept as an offline fallback.
- Add empty-state and error-state UI for the leaderboard panel.

## Capabilities

### New Capabilities
(none — this extends existing capabilities rather than introducing a new one)

### Modified Capabilities
- `game-detail`: the leaderboard section now reads real, persisted per-game scores instead of `seededScores()`, and must handle empty and error states.
- `game-player`: the end-of-session score submission now persists to Supabase (via anonymous identity) instead of only localStorage, with pending/failure feedback.

## Impact

- New: `scores` table + RLS policies + indexes (Supabase migration, applied via MCP).
- New: `lib/leaderboard.ts` (data access: `getTopScores`, `submitScore`, `ensureAnonSession`), `components/GameLeaderboard.tsx`.
- Modified: `app/juegos/[id]/page.tsx` (drop `seededScores` import, render real data, fix an existing unsafe `key={r.name}` React key), `components/GamePlayer.tsx` (async submit handler, pending/error UI).
- Unchanged by design: `lib/auth-context.tsx`'s mock sign-in stays as-is; `seededScores()` stays and keeps feeding `lib/home.ts` (landing page) and `components/HallOfFame.tsx` (Salón de la Fama), because the landing-page spec requires deterministic activity data — reconciling Hall of Fame with real data is out of scope here.
- New dependency posture: none — `@supabase/ssr` and `@supabase/supabase-js` are already installed and unused.

## Non-goals

- No global `/leaderboard` index route — per-game panel only.
- No rewiring of `lib/home.ts` or `components/HallOfFame.tsx` to real data (landing page must stay deterministic; Hall of Fame is left for a follow-up change).
- No real user accounts — identity is Supabase anonymous auth plus a player-chosen nickname, not sign-up/sign-in.
- No server-authoritative score validation, replay verification, or anti-cheat beyond basic RLS ownership and column constraints. Scores are computed client-side and are inherently spoofable; this change does not attempt to fix that, only to make the leaderboard real and shared.
- No changes to the root-level absence of `proxy.ts` (Next.js 16's renamed middleware) — not needed since all Supabase access here is client-side.

## User-visible impact & rollback

**User-visible impact**: players seeing a game's detail page now see genuine scores from real play sessions (starting empty, per game) instead of fabricated ones; submitting a score at game over now takes a moment (network round trip) and can fail (shown inline, with the existing localStorage save still happening as a fallback).

**Rollback**: revert the application commit(s). The `scores` table and its migration are additive — dropping the table (a follow-up migration) fully reverts the database side with no impact on other tables, since nothing else references it.
