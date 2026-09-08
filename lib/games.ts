export type Game = {
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
	sortOrder: number;
};

/** Chip order for the catalog filter UI. 'TODOS' is synthetic (shows every
 * category); the rest match the `games.cat` CHECK constraint. Kept as a
 * hardcoded constant since chip order is a design choice, not derived data. */
export const CATS = ['TODOS', 'ARCADE', 'PUZZLE', 'SHOOTER', 'VERSUS'];

/** Formats a raw play count for display, e.g. 12400 -> '12.4K'. Below 1000
 * the exact number is shown. */
export function formatPlays(plays: number): string {
	if (plays < 1000) return String(plays);
	return `${(plays / 1000).toFixed(1)}K`;
}

/** The `cover-*` CSS classes actually defined in `app/globals.css`. The
 * `games.cover` column only checks the naming pattern, not membership in
 * this set, since the database has no visibility into the stylesheet — an
 * unrecognized value falls back to the plain `cover-bg` background instead
 * of rendering a broken/empty cover. */
const KNOWN_COVERS = new Set([
	'cover-bricks',
	'cover-tetro',
	'cover-snake',
	'cover-glot',
	'cover-invaders',
	'cover-rocas',
	'cover-asteroids',
	'cover-rana',
	'cover-duelo',
]);

export function safeCover(cover: string): string {
	return KNOWN_COVERS.has(cover) ? cover : '';
}

const PLAYERS = [
	'PX_KAI',
	'NEONFOX',
	'Z3R0COOL',
	'M00NRYU',
	'VAULT_07',
	'GLITCHA',
	'ATARI_KID',
	'CYBER_LU',
	'MAGENTA88',
	'SCANLINE',
	'BIT_LORD',
	'ARKADYA',
	'DROID_X',
	'RGB_QUEEN',
	'PIXEL_DAD',
	'RETROVIRA',
	'VECTORX',
	'JOY_STK',
];

export type ScoreRow = {
	rank: number;
	name: string;
	score: number;
	date: string;
};

/** Deterministic fake leaderboard data. Still used by the landing page
 * (`lib/home.ts`, which requires deterministic activity content) and by
 * `components/HallOfFame.tsx`. The real per-game leaderboard on a game's
 * detail page reads persisted scores via `lib/leaderboard-server.ts`
 * instead — see openspec/changes/add-per-game-leaderboard. */
export function seededScores(seed: number, count = 12): ScoreRow[] {
	let s = seed;
	const rand = () => {
		s = (s * 9301 + 49297) % 233280;
		return s / 233280;
	};
	const used = new Set<string>();
	const rows: ScoreRow[] = [];
	for (let i = 0; i < count; i++) {
		let name: string;
		do {
			name = PLAYERS[Math.floor(rand() * PLAYERS.length)];
		} while (used.has(name) && used.size < PLAYERS.length);
		used.add(name);
		const base = Math.floor(50000 + rand() * 250000);
		const score = base - i * Math.floor(2000 + rand() * 4000);
		const day = String(1 + Math.floor(rand() * 28)).padStart(2, '0');
		const mon = String(1 + Math.floor(rand() * 12)).padStart(2, '0');
		rows.push({ rank: i + 1, name, score: Math.max(score, 1000), date: `${day}/${mon}/2026` });
	}
	return rows.sort((a, b) => b.score - a.score).map((r, i) => ({ ...r, rank: i + 1 }));
}
