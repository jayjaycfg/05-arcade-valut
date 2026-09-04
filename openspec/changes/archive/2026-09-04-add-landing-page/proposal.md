## Why

Arcade Vault has no landing page: `/` currently renders the game library directly, so a first-time visitor sees a catalog with no pitch, no proof it's free, and no path to create an account. A dedicated home page (hero, value proposition, featured games, live activity, pricing) gives new visitors a reason to sign up before they're dropped into the library.

## What Changes

- Add a new landing page at `/`: hero with CTAs, "¿Por qué Arcade Vault?" feature grid, featured-games rail, stats band, live-activity section, pricing/FAQ, and a final call-to-action.
- **BREAKING**: relocate the game library from `/` to `/games`. Update all in-app "volver"/back links (game detail, hall of fame) and nav active-state logic to point at `/games`.
- Add an "Inicio" link to the nav, pointing at `/`.
- Extend `app/globals.css` with the template's HOME, ACTIVITY, and PRICING style blocks (the GAMEPAD and ABOUT blocks are not needed and are not added).
- Landing content that mirrors existing app data (stat counts, live-activity rows, top players) is derived from `lib/games.ts` (`GAMES`, `PLAYERS`, `seededScores`) rather than hardcoded, so it can't drift from the library or hall of fame.

Out of scope: an "About Us" page and its nav link, a real contact form, real analytics/telemetry, and payments (the pricing card is informational only — the plan is $0).

## Capabilities

### New Capabilities
- `landing-page`: the `/` marketing/home page — hero, feature grid, featured-games rail, stats band, live activity, pricing/FAQ, final CTA, scroll-reveal behavior, and responsive layout.

### Modified Capabilities
- `game-library`: the catalog listing moves from `/` to `/games`; navigation and cross-links are updated accordingly. Search, category filtering, and empty-state behavior are unchanged.

## Impact

- **Affected code**: `app/page.tsx` (replaced with landing content; current library content moves to `app/games/page.tsx`), `components/Nav.tsx` (add "Inicio", update `isActive`), `app/juegos/[id]/page.tsx` (back link), `components/HallOfFame.tsx` (return link), `app/globals.css` (new HOME/ACTIVITY/PRICING style blocks), new `lib/home.ts` (derived landing data), new landing section components under `components/`.
- **Not introduced**: About Us page/route, contact form, real analytics, payment processing, the GAMEPAD CSS block (virtual d-pad, unrelated to the landing page).
- **Dependencies**: none new — reuses existing `lib/games.ts` data and the existing CSS custom-property/BEM styling system.
