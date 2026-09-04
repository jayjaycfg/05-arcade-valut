## 1. Route move

- [x] 1.1 Move the current catalog screen from `app/page.tsx` to `app/games/page.tsx` (consult `node_modules/next/dist/docs/01-app/` for Next.js 16 routing conventions first); verify `/games` renders the existing library and `/` no longer does
- [x] 1.2 Update `components/Nav.tsx`: add an "Inicio" link to `/`, point "Biblioteca" at `/games`, extend `isActive` to match `/games` and `/juegos/*`, in both the desktop nav and the mobile slide-over panel; verify each nav link highlights correctly on `/`, `/games`, and `/juegos/[id]`
- [x] 1.3 Update the "VOLVER AL VAULT" link in `app/juegos/[id]/page.tsx` and the return-to-library link in `components/HallOfFame.tsx` to point at `/games`; also updated `app/acceso/page.tsx` (sign-in/guest redirects) and `app/juegos/[id]/not-found.tsx` ("volver al vault"), which pointed at the old `/` library and would otherwise violate the existing auth/game-detail specs' "return to library" behavior; verify all links/redirects navigate to `/games`

## 2. Derived landing data

- [x] 2.1 Add `lib/home.ts` exporting featured games (subset of `GAMES`), stat counts (including a game count derived from `GAMES.length`), recent-activity rows, and top-players-today, built from `GAMES` and `seededScores(seed, count)` (which itself draws from the module-private `PLAYERS` list) with fixed seeds (no `Math.random()`/`Date.now()`); verified deterministic — every input is a pure function of static data and fixed seeds, with no time- or randomness-based source

## 3. Styling

- [x] 3.1 Append the HOME, ACTIVITY, and PRICING style blocks from `resources/templates/home-about/styles.css` (lines 930-1070, 1621-1671, 1672-1725) into `app/globals.css`; `.fade-in`/`.slide-in`/`.spinner`/`.tw-section` (styles.css:1726-1744) were already ported, so only the non-duplicate PRICING rules through `.faq-a` were appended; did not port GAMEPAD or ABOUT; build verified in 5.1

## 4. Landing page components

- [x] 4.1 Build the hero section (eyebrow, three-line headline, subcopy, "EXPLORAR JUEGOS" → `/games` and "CREAR CUENTA" → `/acceso` CTAs, scroll cue, decorative floating pixel silhouettes marked `aria-hidden`); verify both CTAs navigate correctly and the silhouettes are hidden from the accessibility tree
- [x] 4.2 Build the feature grid section (4 accent-colored cards: classic games, free access, ladder boards, growing catalog); verify all 4 cards render with icon, title, and description
- [x] 4.3 Build the featured-games rail from `lib/home.ts`, each card linking to `/juegos/{id}`, plus a "VER TODOS LOS JUEGOS" link to `/games`; verify selecting a featured game navigates to its detail page
- [x] 4.4 Build the stats band from `lib/home.ts`; verify the displayed game count matches `GAMES.length`
- [x] 4.5 Build the live-activity section (recent-scores list, top-players list) from `lib/home.ts`, with a "VER SALÓN" link to `/salon-de-la-fama`; verify the link navigates correctly and the lists match the data module's output
- [x] 4.6 Build the pricing/FAQ section ($0 plan card with feature checklist and CTA to `/acceso`, 3 FAQ items); verify the CTA navigates to `/acceso`
- [x] 4.7 Build the final call-to-action section linking to `/games`; verify the CTA navigates correctly
- [x] 4.8 Add a client-side scroll-reveal wrapper (IntersectionObserver-based) applied to each section, and confirm all content renders fully in its final, visible state when JavaScript/IntersectionObserver is unavailable (falls back to visible when IntersectionObserver is undefined; a global `<noscript>` style in `app/layout.tsx` forces `.reveal` visible when JS itself is disabled); verified by inspecting rendered HTML/CSS logic
- [x] 4.9 Assemble `app/page.tsx` as a server component composing all sections in order (hero, features, rail, stats, activity, pricing/FAQ, final CTA); verified by build + manual browse in 5.1/5.2

## 5. End-to-end verification

- [x] 5.1 Run `pnpm build` and `npm run lint`; verified both succeed with no errors (only 6 pre-existing `noDescendingSpecificity` CSS warnings, matching the same top1/top2/top3 pattern already used elsewhere in `globals.css`)
- [x] 5.2 Manually browsed `/`, `/games`, `/juegos/bloque-buster`, `/salon-de-la-fama`, and `/acceso` in Chrome at desktop width: landing renders all 7 sections in order with correct derived content (8+ games, real player/game names in the activity ticker, deterministic top-5), nav active states are correct on every route ("Inicio"/"Biblioteca"/"Salón de la Fama"), and every in-app link/redirect (`VOLVER AL VAULT`, `VOLVER A LA BIBLIOTECA`, hero/rail/pricing/final CTAs, sign-in/guest redirects) resolves to `/games` or `/juegos/{id}` as specified. Mobile-width visual check could not be completed — the sandboxed browser's window would not resize below its default size (`resize_window` reported success but `window.innerWidth` stayed at 1080px); the 980/900/720/520px breakpoints were instead verified by re-reading `app/globals.css`, matching the pre-existing responsive pattern already used elsewhere in the file (e.g. `.av-grid`, hall table)
