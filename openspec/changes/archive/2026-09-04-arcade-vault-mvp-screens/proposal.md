## Why

Arcade Vault has an approved retro-arcade visual design (`resources/templates/`) and a Next.js scaffold whose `globals.css`/`layout.tsx` already carry the full styling port, but no screens exist yet. Building every screen now gives the MVP real, shareable URLs and a navigable product to demo, before any actual game logic is built.

## What Changes

- Add a shared game catalog and score-generation module (`lib/games.ts`) ported from the template's `data.jsx`.
- Add a client-side auth context (`lib/auth-context.tsx`) backed by `localStorage`, mocking sign-in/sign-out/guest and score saving — no backend.
- Add a global `Nav` component (logo, links, credits counter, mobile menu, auth button) and wire it plus a footer into the root layout.
- Add the Biblioteca (library/home) screen with search and category filtering.
- Add the Detalle (game detail) screen with per-game leaderboard, using dynamic routing and `generateStaticParams`.
- Add the Reproductor (player) screen with a simulated score/level HUD, CRT frame, pause, and a game-over modal that saves a score.
- Add the Acceso (auth) screen with sign-in/sign-up tabs, guest access, and social placeholders.
- Add the Salón de la Fama (hall of fame) screen with a podium and ranking table, including the signed-in user's own rank when available.
- Add a 404 screen for unknown game ids.
- Fix `package.json` lint/format/check scripts to target the actual source directories instead of the nonexistent `./src`.

## Capabilities

### New Capabilities
- `game-library`: browsing, searching, and filtering the game catalog on the home screen.
- `game-detail`: viewing a single game's info and leaderboard, and entering play.
- `game-player`: the in-browser play screen with simulated scoring, pause, and score submission.
- `auth`: mock sign-in, sign-up, guest access, and sign-out, persisted to `localStorage`.
- `hall-of-fame`: cross-game leaderboard browsing with the current user's rank highlighted.

### Modified Capabilities
(none — this is greenfield UI on an unmodified scaffold)

## Impact

- Affected code: `app/layout.tsx`, `app/page.tsx` (rewritten), new routes under `app/juegos/[id]/`, `app/juegos/[id]/jugar/`, `app/acceso/`, `app/salon-de-la-fama/`, new `components/` and `lib/` directories, `package.json` scripts.
- No backend, database, or real game logic is introduced. `app/globals.css` is unchanged (already complete).
- No new dependencies.
