import type { ScoreRow } from '@/lib/games';

/** Max rows shown on a game's leaderboard panel. */
export const LEADERBOARD_LIMIT = 10;

/** Raw shape of a row as returned by the `scores` table. */
export type LeaderboardEntry = {
	id: string;
	nickname: string;
	score: number;
	created_at: string;
};

/**
 * A leaderboard row for display, compatible with the existing `ScoreRow`
 * markup (`.leaderboard` / `.lb-row`), plus a stable `id` for React keys —
 * `ScoreRow.name` alone is not unique once real nicknames can repeat.
 */
export type LeaderboardRow = ScoreRow & { id: string };

/** Formats an ISO timestamp as `dd/mm/yyyy` using UTC parts, matching the
 * existing `seededScores` date format without going through
 * `toLocaleDateString` (which can differ by server/client locale and risks
 * a hydration mismatch if this ever renders on both). */
export function formatScoreDate(isoDate: string): string {
	const d = new Date(isoDate);
	const day = String(d.getUTCDate()).padStart(2, '0');
	const month = String(d.getUTCMonth() + 1).padStart(2, '0');
	const year = d.getUTCFullYear();
	return `${day}/${month}/${year}`;
}

/** Maps raw `scores` rows (already ordered by score desc, created_at asc)
 * into ranked, display-ready leaderboard rows. */
export function toLeaderboardRows(entries: LeaderboardEntry[]): LeaderboardRow[] {
	return entries.map((entry, i) => ({
		id: entry.id,
		rank: i + 1,
		name: entry.nickname,
		score: entry.score,
		date: formatScoreDate(entry.created_at),
	}));
}
