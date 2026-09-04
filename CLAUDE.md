# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault — a platform for playing games online and competing for high scores (see README.md). The codebase is currently a fresh, unmodified `create-next-app` scaffold (Next.js 16, App Router, React 19, TypeScript, Tailwind CSS v4) — no application code has been written yet.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint (flat config in `eslint.config.mjs`)

No test runner is configured yet.

## Architecture notes

- App Router lives under `app/`; `app/layout.tsx` is the root layout, `app/page.tsx` the home route.
- Path alias `@/*` maps to the repo root (`tsconfig.json`).
- Styling is Tailwind CSS v4 via `@tailwindcss/postcss` (`postcss.config.mjs`), with global styles in `app/globals.css`.
- **This is not the Next.js you know**: Next.js 16 in this repo has breaking changes vs. training data. Before writing App Router code, consult the bundled docs at `node_modules/next/dist/docs/01-app/` (also `02-pages/` and `03-architecture/`) and follow deprecation notices there.

## Spec-driven development

This project follows spec-driven design using `openSpec`

## Skills

- Always use /frontend-design to design UI.