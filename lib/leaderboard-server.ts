import { createClient } from '@supabase/supabase-js';
import { LEADERBOARD_LIMIT, type LeaderboardEntry, type LeaderboardRow, toLeaderboardRows } from '@/lib/leaderboard';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// This is a deliberately cookie-free client, NOT `utils/supabase/server.ts`.
// `utils/supabase/server.ts` reads `cookies()`, a Request-time API that would
// force `/juegos/[id]` into fully dynamic rendering (see design.md -
// "Rendering: cookie-free server read + ISR"). The leaderboard read is
// public (RLS grants `select` to `anon`), so it needs no session at all.
// Call `getTopScores` only from server code — it is never bundled for the
// client (no `'use client'` importer should reach it), but it also never
// touches secrets beyond the already-public anon key, so nothing catastrophic
// happens if that boundary slips; it would just be redundant with the
// browser client in `lib/leaderboard-client.ts`.
function createReadOnlyClient() {
	if (!supabaseUrl || !supabaseKey) return null;
	return createClient(supabaseUrl, supabaseKey, {
		auth: { persistSession: false, autoRefreshToken: false },
	});
}

export type GetTopScoresResult = { ok: true; rows: LeaderboardRow[] } | { ok: false };

/** Reads the top scores for one game, ranked descending with ties broken by
 * earliest submission. Never throws — a missing config or a failed request
 * both resolve to `{ ok: false }` so the caller can render an error state
 * instead of failing the whole page (see game-detail spec: "Leaderboard
 * fails to load"). */
export async function getTopScores(
	gameId: string,
	limit = LEADERBOARD_LIMIT,
): Promise<GetTopScoresResult> {
	const client = createReadOnlyClient();
	if (!client) return { ok: false };

	const { data, error } = await client
		.from('scores')
		.select('id, nickname, score, created_at')
		.eq('game_id', gameId)
		.order('score', { ascending: false })
		.order('created_at', { ascending: true })
		.limit(limit);

	if (error || !data) {
		console.error('getTopScores failed', error);
		return { ok: false };
	}

	return { ok: true, rows: toLeaderboardRows(data as LeaderboardEntry[]) };
}
