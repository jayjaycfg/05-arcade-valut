## Context

`resources/started-games/02-asteroids/game.js` is a 510-line vanilla script written for a bare `index.html`: it grabs `document.getElementById('canvas')` and a fixed `800x600` context at module load, attaches `keydown`/`keyup` listeners to `window`, keeps all game state (`ship`, `asteroids`, `score`, `lives`, `level`, `state`) as file-scope `let`/`const` globals, draws its own HUD and "GAME OVER" text directly on the canvas, and self-starts (`initGame(); requestAnimationFrame(loop);`) as a side effect of being loaded. None of that survives being imported into a React component unchanged: React may mount/unmount/remount the component (dev Strict Mode double-invokes effects), the canvas element doesn't exist until React renders it, module-level globals would be shared/re-run oddly across script evaluations, and the HUD/game-over UI needs to come from the existing React `GamePlayer` chrome, not be redrawn on the canvas.

See proposal.md - Why/What Changes for the motivation and scope (only the new `asteroids` catalog game, no shared adapter abstraction yet; the pre-existing `rocas` entry is untouched).

## Goals / Non-Goals

**Goals:**
- Turn the script into a factory function `createAsteroidsGame(canvas, callbacks)` that owns its own closures instead of module globals, so it can be instantiated fresh per mount and cleanly torn down.
- Keep the ported engine's game logic (physics, splitting, scoring, collision) byte-for-byte equivalent to the original — this is a wrapping exercise, not a rewrite of the rules.
- Give `GamePlayer` a single, narrow integration point: mount a canvas, get a controller object back (`{ pause(), resume(), reset(), destroy() }`), and receive state updates via a callback.

**Non-Goals:**
- A generic `GameEngine` interface other games will implement — out of scope per proposal (only one game is wired up).
- Changing the engine's visuals, controls, difficulty, or scoring values.
- Server-side rendering of the canvas (it only ever runs client-side, same as the rest of `GamePlayer`).

## Decisions

**Factory function over class, over keeping the file as-is.** Wrap the existing classes (`Bullet`, `Asteroid`, `Ship`, `Particle`, `PowerUp`) and the `update`/`draw`/`loop` functions inside `createAsteroidsGame(canvas, { onState, onGameOver })`, closing over `ctx`, `W`, `H`, and all former globals as local variables. Returns `{ pause, resume, reset, destroy }`. Rejected: converting to a class — the original code is written as free functions closing over shared state, and preserving that shape (just inside a factory closure) minimizes the diff against the known-working original and lowers the risk of introducing a gameplay bug during the port. Rejected: leaving the file loading itself as a `<script src>` inside an `<iframe>` — would work with minimal porting, but breaks the shared HUD requirement (score/lives/level must render in the existing React chrome, not the canvas) and complicates pause (can't easily suspend an iframe's RAF loop from outside without `postMessage` plumbing).

**Own keyboard listeners scoped to `window`, added on mount / removed on unmount, gated by a `running` flag.** The original already listens on `window` (not the canvas), which is correct for this game (arrow keys shouldn't require canvas focus) — kept as-is. Pausing sets `running = false`; the loop checks it each frame and skips `update()` (bullets/ship/asteroids freeze) while still allowed to no-op-render; the `keydown` handler also short-circuits while `!running` so held keys don't queue up input that fires the instant it resumes. Alternative considered: removing/re-adding listeners on every pause/resume — rejected as unnecessary churn when a boolean flag does the same job more simply.

**State reported via a callback invoked once per frame, not via React state living inside the engine.** `createAsteroidsGame` calls `onState({ score, lives, level, gameOver })` at the end of each `update()`. `GamePlayer` stores that in `useState` and renders the existing HUD markup from it, same shape as today's simulated `score`/`lives`/`level` state. Rejected: exposing mutable getters and having `GamePlayer` poll them in a `requestAnimationFrame` of its own — a callback is simpler and keeps the engine as the single owner of its render loop.

**`reset()` re-runs `initGame()`-equivalent logic inside the same closure instead of destroy+recreate.** Matches the "Reset starts a fresh game" requirement in `asteroids-game` and avoids a canvas-context re-acquire and listener re-attach on every replay. `destroy()` (called on unmount) cancels the RAF handle and removes the `window` listeners — the only two things that outlive a paused state.

**Add a new `asteroids` catalog entry to `lib/games.ts` and branch in `GamePlayer` on `game.id === 'asteroids'`.** Simplest way to scope this to one game without inventing a registry/abstraction the proposal explicitly defers, and without touching the pre-existing `rocas` entry (a different game, still simulated). The new entry uses the same `Game` type as every other row — title/short/long/cat/cover/color/best/plays — filled in with copy appropriate to this game (e.g. sourced from `resources/started-games/02-asteroids/README.md`). When `id === 'asteroids'`, render a `<AsteroidsGame>` client component (owns the canvas + engine instance via `useRef`/`useEffect`) instead of the simulated-ticker `useEffect`; the surrounding HUD/pause/end-game/modal JSX in `GamePlayer` is reused unchanged, driven by whichever state source is active.

## Risks / Trade-offs

- [React Strict Mode double-invokes mount effects in dev, which would create two engine instances / two listener sets if not guarded] → `useEffect` in `AsteroidsGame` creates the engine and returns a cleanup that calls `destroy()`; because `destroy()` fully removes listeners and cancels the RAF handle, the extra mount/unmount pair Strict Mode performs is harmless (first instance is destroyed before the second is created).
- [Fixed `800x600` canvas may not fit the `crt-screen` container at all viewport sizes] → out of visual-polish scope for this change; canvas keeps its native size and is left to the container's existing overflow/centering behavior. Flag to the user as a follow-up if it looks cramped once wired in.
- [Porting a 510-line file by hand risks subtle behavior drift from the original] → keep the diff mechanical (wrap in closures, replace module-level `document.getElementById`/`window` self-start with factory params, remove the canvas-drawn HUD/game-over text since React now owns that) and avoid touching gameplay constants or formulas.

## Migration Plan

No data migration. Rollout is a single PR; rollback is reverting it (or just the `GamePlayer` branch and the new `lib/games.ts` entry) to remove `asteroids` from the catalog entirely — no persisted state depends on the engine, and `rocas` is unaffected either way.
