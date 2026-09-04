## Context

See `proposal.md` - Why. The `resources/templates/` prototype is a hash-routed single-page React app loaded via CDN/Babel-standalone; `app/globals.css` already contains its full CSS port and `app/layout.tsx` already wires the two Google fonts and background/noise layers. Only the React screens and routing are missing. Next.js 16 in this repo passes `params` as a `Promise` (see `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`), which changes how dynamic routes read their id compared to the training-data version of Next.js.

## Goals / Non-Goals

**Goals:**
- Map the prototype's hash-router states onto real App Router URLs (`/`, `/juegos/[id]`, `/juegos/[id]/jugar`, `/acceso`, `/salon-de-la-fama`).
- Keep the visual output indistinguishable from the prototype by reusing existing CSS classes verbatim rather than introducing new styling.
- Default to Server Components; isolate `'use client'` to the handful of components that need state, effects, or browser storage.

**Non-Goals:**
- No real game engines or scoring logic — the play screen keeps the prototype's timer-based simulated score.
- No real authentication or backend persistence — auth and scores stay in `localStorage`.
- No changes to `app/globals.css` — it is already a complete port.

## Decisions

- **Routing**: Spanish path segments (`/juegos/[id]`, `/juegos/[id]/jugar`, `/acceso`, `/salon-de-la-fama`) instead of literal hash-state ports, so URLs read naturally in the shipped, Spanish-language product. Rejected alternative: keep the client-side hash router as-is — would forgo real URLs, SSR, and static generation for detail pages, which the prototype couldn't do because it only ran as static files.
- **Data module (`lib/games.ts`)**: a plain TypeScript module (not a server action or fetch) since the catalog is static mock data; port the prototype's `data.jsx` array and its seeded pseudo-random score generator (`seededScores`) unchanged, including the exact LCG constants, so given the same id the leaderboard is stable across server and client renders (avoids hydration mismatches without needing `useEffect`-gated randomness).
- **Auth (`lib/auth-context.tsx`)**: a client-side React context reading/writing `localStorage["av_user"]` and `localStorage["av_scores"]`, matching the prototype's `app.jsx` state shape (`{name: string} | null`). Alternative considered: cookies for SSR-visible auth — rejected as unnecessary complexity for a mock with no server component that needs to know the user.
- **Server/client split**: `app/juegos/[id]/page.tsx` stays a pure Server Component (static content + `generateStaticParams`); only `GamePlayer`, `GameCard` (pointer-tilt), `GameGrid` (search/filter state), `HallOfFame` (tab state), `Nav` (mobile menu + auth-driven button), and the `/acceso` page (form state) are client components, plus the `AuthProvider` itself.
- **Not-found handling**: use Next's `notFound()` + a route-scoped `app/juegos/[id]/not-found.tsx` rather than manual conditional rendering, so unknown ids return a proper 404 status.

## Risks / Trade-offs

- [Hydration mismatch if auth state is read synchronously from `localStorage` during render] → Initialize `user` to `null` and hydrate inside `useEffect`, matching the prototype's own lazy-initializer-then-effect pattern; accept a one-frame flash of "signed out" nav state on reload.
- [Duplicating the prototype's inline pixel-art "game" animation adds client-only visual code with no real gameplay] → Keep it exactly as decorative CSS-driven markup (as the prototype does) rather than building any canvas/game-loop abstraction, since real games are explicitly out of scope.
- [Spanish route segments diverge from typical English Next.js examples] → Acceptable since all UI copy is already Spanish; consistent with the product's audience.
