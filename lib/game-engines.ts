import { AsteroidsGame } from '@/components/games/AsteroidsGame';

/** Maps a game id to its real, playable React engine component. Static
 * imports only (not `next/dynamic`): `AsteroidsGame` is a `forwardRef`
 * exposing `{ pause, resume, reset }`, and a dynamic import would not
 * forward that ref, silently breaking restart/pause. Whether a game
 * actually uses its engine also depends on the catalog's `playable` flag —
 * see `game-player` spec: "Catalog playable flag gates engine use". */
const ENGINES = {
	asteroids: AsteroidsGame,
} as const;

export type EngineGameId = keyof typeof ENGINES;

export function getEngine(id: string) {
	return Object.hasOwn(ENGINES, id) ? ENGINES[id as EngineGameId] : undefined;
}
