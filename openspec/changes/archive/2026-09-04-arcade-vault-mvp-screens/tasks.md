## 1. Shared foundation

- [x] 1.1 Create `lib/games.ts` porting `resources/templates/data.jsx` (`Game` type, `GAMES`, `CATS`, `getGame(id)`, `ScoreRow` type, `seededScores(seed, count)` with the exact LCG constants) and verify `pnpm build` type-checks it with no errors.
- [x] 1.2 Create `lib/auth-context.tsx` (`'use client'`) with `AuthProvider`, `useAuth()` exposing `user`, `signIn`, `signOut`, `saveScore`, persisting `av_user` and `av_scores` to `localStorage`, hydrated in `useEffect` to avoid hydration mismatches; verify by rendering the provider and confirming no hydration warning in the browser console.
- [x] 1.3 Create `components/Nav.tsx` (`'use client'`) porting `resources/templates/nav.jsx`, using `usePathname()` for active-link state and `useAuth()` for the sign-in/user button and mobile menu; verify visually against the template nav.
- [x] 1.4 Update `app/layout.tsx` to wrap children in `AuthProvider`, render `<Nav />` and the footer, and set `lang="es"` and Spanish `metadata`; verify `pnpm build` succeeds and the nav/footer render on every route.

## 2. Library and hall of fame screens

- [x] 2.1 Replace `app/page.tsx` with the Biblioteca screen: hero section (server) plus `components/GameGrid.tsx` and `components/GameCard.tsx` (`'use client'`) porting `biblioteca.jsx`'s search, category chips, empty state, and card tilt/navigation; verify search "cai" narrows to CAÍDA and the PUZZLE chip narrows to `caida`.
- [x] 2.2 Create `app/salon-de-la-fama/page.tsx` and `components/HallOfFame.tsx` (`'use client'`) porting `salon.jsx`'s per-game tabs, podium, ranking table, and signed-in "tu mejor marca" row; verify the row appears only when `useAuth().user` is set.

## 3. Detail and player screens

- [x] 3.1 Create `app/juegos/[id]/page.tsx` (async server component, `const { id } = await params`) with `generateStaticParams` over `GAMES`, `generateMetadata`, and `notFound()` for unknown ids, rendering cover/tags/stats/leaderboard per `detalle.jsx`; verify `pnpm build` prerenders all 8 game ids.
- [x] 3.2 Create `app/juegos/[id]/not-found.tsx` with a neon "juego no encontrado" message and a link back to `/`; verify visiting `/juegos/no-existe` renders it with a 404 status.
- [x] 3.3 Create `components/GamePlayer.tsx` (`'use client'`) porting `reproductor.jsx` (score interval, level thresholds, pause, HUD, CRT decorative arena, game-over modal calling `useAuth().saveScore`) and `app/juegos/[id]/jugar/page.tsx` resolving the game server-side and rendering it; verify score increases every ~220ms, pausing freezes it, and ending shows the save-score modal.

## 4. Auth screen and cleanup

- [x] 4.1 Create `app/acceso/page.tsx` (`'use client'`) porting `auth.jsx`'s sign-in/sign-up tabs, guest button, and social/divider block, calling `useAuth().signIn` then `router.push('/')`; verify submitting a username shows that name in the nav afterward.
- [x] 4.2 Remove the unused `public/*.svg` create-next-app assets no longer referenced after `app/page.tsx` is replaced; verify `pnpm build` has no missing-asset errors.
- [x] 4.3 Update `package.json` `lint`/`format`/`check` scripts to target `.` instead of `./src`; verify `pnpm lint` runs and reports on files under `app/`, `components/`, `lib/`.

## 5. End-to-end verification

- [x] 5.1 Run `pnpm build` and confirm a clean production build with no client-hook-in-server-component errors.
- [x] 5.2 Run `pnpm dev` and manually walk: search/filter on `/` → open a game detail → play it (pause, end, save score) → sign in via `/acceso` → view `/salon-de-la-fama` with personal rank shown → sign out and confirm it disappears; confirm no console errors.
- [x] 5.3 Run `pnpm lint` and confirm it passes clean.
