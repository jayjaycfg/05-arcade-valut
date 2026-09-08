import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Game } from '@/lib/games';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Raw shape of a row as returned by the `games` table. */
type GameRow = {
	id: string;
	title: string;
	short: string;
	long: string;
	cat: string;
	cover: string;
	color: string;
	best: number;
	plays: number;
	playable: boolean;
	sort_order: number;
};

function toGame(row: GameRow): Game {
	return {
		id: row.id,
		title: row.title,
		short: row.short,
		long: row.long,
		cat: row.cat,
		cover: row.cover,
		color: row.color,
		best: row.best,
		plays: row.plays,
		playable: row.playable,
		sortOrder: row.sort_order,
	};
}

// Deliberately cookie-free client, matching `lib/leaderboard-server.ts` — the
// catalog read is public (RLS grants `select` to `anon`), so it needs no
// session at all, and reading `cookies()` (as `utils/supabase/server.ts`
// does) would force the pages that read the catalog into fully dynamic
// rendering instead of staying ISR-prerenderable.
function createReadOnlyClient() {
	if (!supabaseUrl || !supabaseKey) return null;
	return createClient(supabaseUrl, supabaseKey, {
		auth: { persistSession: false, autoRefreshToken: false },
	});
}

export type GetAllGamesResult = { ok: true; games: Game[] } | { ok: false };
export type GetGameByIdResult = { ok: true; game: Game | null } | { ok: false };

/** Reads the full catalog, ordered by `sort_order`. Never throws — a missing
 * config or a failed request both resolve to `{ ok: false }` so callers can
 * render an error state instead of treating the failure as an empty catalog
 * (see game-catalog spec: "Catalog read failure"). Cached per request so a
 * page and its `generateMetadata` share one round-trip. */
export const getAllGames = cache(async (): Promise<GetAllGamesResult> => {
	const client = createReadOnlyClient();
	if (!client) return { ok: false };

	const { data, error } = await client
		.from('games')
		.select('id, title, short, long, cat, cover, color, best, plays, playable, sort_order')
		.order('sort_order', { ascending: true });

	if (error || !data) {
		console.error('getAllGames failed', error);
		return { ok: false };
	}

	return { ok: true, games: (data as GameRow[]).map(toGame) };
});

/** Looks up one game by id. Resolves `game: null` when the id genuinely does
 * not exist in the catalog, distinct from `{ ok: false }` on a read failure —
 * callers must not treat the latter as "not found" (see game-catalog spec
 * and game-detail spec: "Unknown game handling"). */
export const getGameById = cache(async (id: string): Promise<GetGameByIdResult> => {
	const client = createReadOnlyClient();
	if (!client) return { ok: false };

	const { data, error } = await client
		.from('games')
		.select('id, title, short, long, cat, cover, color, best, plays, playable, sort_order')
		.eq('id', id)
		.maybeSingle();

	if (error) {
		console.error('getGameById failed', error);
		return { ok: false };
	}

	return { ok: true, game: data ? toGame(data as GameRow) : null };
});
