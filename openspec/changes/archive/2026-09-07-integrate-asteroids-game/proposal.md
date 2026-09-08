## Why

The play screen (`game-player`) currently simulates every game with a random-tick score counter — no game is actually playable. A complete, working Asteroids clone already exists at `resources/started-games/02-asteroids/` (vanilla JS canvas game). Wiring it in as a new catalog entry turns one game into a real, playable experience and establishes the pattern for retrofitting the rest.

## What Changes

- Add a new catalog entry `asteroids` to `lib/games.ts` (title, description, category, cover, etc.) so it appears in the game library/detail screens alongside the existing games. The existing `rocas` entry ("Pulveriza asteroides en gravedad cero") is untouched and keeps its current simulated placeholder — it is a different, pre-existing catalog game and is not being replaced.
- Port `resources/started-games/02-asteroids/game.js` into the app as a self-contained, mountable game engine (no `document`/`window`-scoped globals, no `index.html` dependency) that renders into a canvas the player provides and reports state via callbacks instead of drawing its own HUD/game-over overlay.
- Wire the ported engine into the new `asteroids` game only; `GamePlayer` renders it in place of the simulated score-ticker for that game ID, keeping the simulated ticker as the fallback for every other catalog entry (including `rocas`).
- Score, lives, and level shown in the existing HUD come from the real engine's state instead of the interval-based simulation, for this game only.
- Pause suspends the engine's `requestAnimationFrame` loop and freezes input instead of just overlaying a message.
- "FIN" / ship-losing-all-lives ends the session and reuses the existing game-over/score-submission modal, seeded with the engine's real final score.
- "JUGAR DE NUEVO" and unmounting fully reset/tear down the engine (listeners, RAF loop) so repeat plays and navigation away don't leak state or duplicate input handlers.
- **BREAKING**: none (adds a new catalog entry and a behavioral change scoped to that entry; `rocas` and all other games unaffected).

## Capabilities

### New Capabilities
- `asteroids-game`: The ported Asteroids engine's own play rules — ship control, shooting, asteroid splitting/scoring, lives, level progression, and the state it exposes to the host page.

### Modified Capabilities
- `game-player`: For the new `asteroids` game specifically, the HUD, pause, end-session, and restart requirements now describe real engine-driven state instead of always describing the simulated ticker.

## Impact

- **Affected code**: new `components/games/AsteroidsGame.tsx` (or similar) plus a ported, React-safe module under `lib/games/asteroids/`; `components/GamePlayer.tsx` gains a per-game branch to mount it; `lib/games.ts` gains one new `Game` entry (`id: 'asteroids'`) — no schema change, same `Game` type as every other entry.
- **Dependencies**: none added — canvas/RAF only, no new npm packages.
- **Other games**: `rocas`, `bloque-buster`, `caida`, `serpentina`, `gloton`, `invasores`, `ranaria`, `duelo-pixel` keep the current simulated placeholder; not in scope here.
- **Rollback**: revert the `GamePlayer` branch and the new `lib/games.ts` catalog entry (or delete the new engine module) to remove `asteroids` entirely — no data migrations, no persisted-state changes, low risk.

## Non-goals

- Porting or wiring any other existing catalog game (including `rocas`) to a real engine.
- Building a generic multi-game "engine adapter" abstraction — this change hard-codes the `asteroids` branch; a shared adapter interface can be extracted once a second game is ported.
- Persisting in-progress game state (e.g., resume after navigating away) — sessions still reset on remount, matching current `game-player` behavior.
- Leaderboard/backend changes — score submission still goes through the existing `saveScore` flow unchanged.
