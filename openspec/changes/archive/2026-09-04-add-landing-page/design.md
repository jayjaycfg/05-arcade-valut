## Context

See proposal.md - Why. Today `app/page.tsx` renders the library (`.av-hero` + `<GameGrid/>`) at `/`. `resources/templates/home-about/home.jsx` + the HOME/ACTIVITY/PRICING blocks of `resources/templates/home-about/styles.css` are the visual reference for the new landing page; they are plain React/CSS, not yet ported into the Next.js app. The app already has a working hand-written CSS custom-property system in `app/globals.css`, a shared `Nav.tsx`, and catalog data in `lib/games.ts` (`GAMES`, `CATS`, `PLAYERS`, `seededScores`). Next.js 16 in this repo has breaking changes vs. training data — consult `node_modules/next/dist/docs/01-app/` before writing route code.

## Goals / Non-Goals

**Goals:**
- Land the marketing page at `/`, catalog at `/games`, with every existing internal link and nav state updated to match.
- Reuse existing catalog/player data for anything the landing page displays as a "fact" (stat counts, activity rows, top players) so it can't contradict the library or hall of fame.
- Keep the landing page's interactive surface (scroll-reveal, hover tilt) isolated to small client components, leaving the page itself a server component.

**Non-Goals:**
- No About Us page, contact form, real analytics, or payment processing (see proposal.md - Impact).
- No change to auth, game player, or hall-of-fame behavior beyond the return-link target.
- No redirect/rewrite from the old `/` library URL to `/games` — out of scope for this change; noted as a risk below.

## Decisions

- **Route split: landing at `/`, catalog at `/games`.** Chosen by the user over keeping the catalog at `/` and adding the landing at `/inicio`, and over nesting the catalog at `/juegos` (which would collide conceptually with `/juegos/[id]`). Accepted inconsistency: the rest of the app uses Spanish slugs (`/juegos`, `/acceso`, `/salon-de-la-fama`); `/games` is English. Rejected alternative: keep catalog at `/` — rejected because it leaves no room for a landing page at the site root.
- **Landing page is a server component.** Only the scroll-reveal observer wrapper and the featured-games rail's hover-tilt need `"use client"`, following the existing precedent in `components/GameCard.tsx` (client component using a ref for mouse-tilt) and `components/GameGrid.tsx` (client component for search/filter state). Keeps the marketing page cheap to render and matches how `app/juegos/[id]/page.tsx` (server) already delegates only the interactive `GamePlayer` to a client component.
- **Derived landing data lives in `lib/home.ts`.** A new module builds featured games (e.g. first N of `GAMES`), stat counts (`GAMES.length`, a fixed or derived play-count figure, "global" ranking copy), recent-activity rows, and top-players-today from `GAMES`/`PLAYERS`/`seededScores(seed, count)` using fixed seeds — not `Math.random()` or `Date.now()` — so server and client render the same output and there's no hydration mismatch. Rejected alternative: hardcode the template's sample rows verbatim — rejected per user decision, since it would drift from real catalog/player data.
- **Styling: extend `app/globals.css`, not a new stylesheet.** Append the template's HOME (`styles.css:930-1070`), ACTIVITY (`1621-1671`), and PRICING (`1672-1744`) blocks, adapting selectors as needed to fit already-ported class names. Skip GAMEPAD (unrelated, virtual d-pad) and ABOUT (out of scope). Continues the existing hand-written CSS + custom-property convention rather than introducing Tailwind utility classes or CSS modules.
- **Nav update is additive.** Add "Inicio" → `/`; keep "Biblioteca" but point it at `/games` and extend `isActive` to match `/games` and `/juegos/*`; do not add "Acerca de" (About Us is out of scope).

## Risks / Trade-offs

- Bookmarks/external links to `/` expecting the catalog will now see the landing page instead → mitigated by updating every in-app link and nav state in this same change; a redirect is not introduced now but could be added later if analytics show visitors bouncing.
- Marketing copy ("miles de partidas jugadas cada día") is flavor text not backed by real telemetry → keep it as generic, non-quantitative claims in copy; only the game count is a derived, factual number.
- `app/globals.css` continues to grow as a single large file → acceptable for this change since it matches the project's existing convention; not addressed here.
