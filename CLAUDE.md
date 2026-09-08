# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault — a platform for playing games online and competing for high scores (see README.md). Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Supabase (Postgres + Auth) as the backend. Package manager is **pnpm** (see `packageManager` in `package.json`).

Implemented so far:
- Landing page (`app/page.tsx`) with hero, feature grid, games rail, pricing, and activity sections (`components/home/`).
- Game catalog (`app/games`, `app/juegos/[id]`), backed by a Postgres `games` table (`lib/games.ts`, `lib/games-server.ts`).
- Playable game route (`app/juegos/[id]/jugar`) with a game engine abstraction (`lib/game-engines.ts`) — currently implements Asteroids (`lib/games/asteroids/engine.ts`, `components/games/AsteroidsGame.tsx`).
- Per-game leaderboard / Hall of Fame (`components/Leaderboard.tsx`, `components/HallOfFame.tsx`, `app/salon-de-la-fama`, `lib/leaderboard*.ts`) backed by a `scores` table with RLS policies and a rate-limit trigger.
- Auth (`app/acceso`, `lib/auth-context.tsx`, `utils/supabase/{client,server,middleware}.ts`) via `@supabase/ssr` + `@supabase/supabase-js`.
- Server actions in `app/actions/` (e.g. `revalidate-leaderboard.ts`).

## Commands

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — run the production build
- `pnpm lint` — run Biome lint (`biome lint .`)
- `pnpm format` — Biome format, writes changes
- `pnpm check` — Biome check (lint + format), writes changes

**Linting/formatting is Biome-based** (`biome.json`), not the `eslint.config.mjs` flat config that ships with the scaffold — `pnpm lint` no longer runs ESLint. The ESLint config still exists but isn't wired into an npm script.

No test runner is configured yet.

## Architecture notes

- App Router lives under `app/`; `app/layout.tsx` is the root layout, `app/page.tsx` the home route. Spanish-named routes (`app/juegos`, `app/acceso`, `app/salon-de-la-fama`) are the user-facing URLs; `app/games` also exists as a catalog route.
- Path alias `@/*` maps to the repo root (`tsconfig.json`).
- Styling is Tailwind CSS v4 via `@tailwindcss/postcss` (`postcss.config.mjs`), with global styles in `app/globals.css`.
- Supabase: client/server/middleware helpers live in `utils/supabase/`; SQL migrations live in `supabase/migrations/` (scores table, RLS policies, rate-limit trigger, games table + seed, scores→games FK).
- **This is not the Next.js you know**: Next.js 16 in this repo has breaking changes vs. training data. Before writing App Router code, consult the bundled docs at `node_modules/next/dist/docs/01-app/` (also `02-pages/` and `03-architecture/`) and follow deprecation notices there.

## Spec-driven development

This project follows spec-driven design using `openSpec`. Specs live in `openspec/specs/` (one per feature area: `asteroids-game`, `auth`, `game-catalog`, `game-detail`, `game-library`, `game-player`, `hall-of-fame`, `landing-page`); completed change proposals are moved to `openspec/changes/archive/`.

## MCP servers

- `supabase` (`.mcp.json`, remote HTTP MCP) — scoped to project `fcmnqwglfywuhidxgxrk` with docs/account/database/debugging/development/functions/branching features enabled. Use it to inspect schema, run migrations, and check advisors/logs before changing Supabase-backed code.

## Skills

- Always use /frontend-design to design UI.
- openSpec workflow is handled by the built-in `openspec-*` skills (propose, apply-change, sync-specs, archive-change, explore, update-change) under `.claude/skills/`.