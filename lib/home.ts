import { getAllGames } from "./games-server";
import { type Game, seededScores } from "./games";

/** Number of games shown in the landing page's featured-games rail. */
export const FEATURED_GAME_COUNT = 6;

export type Stat = { n: string; u: string; s: string };

export type ActivityColor = "cyan" | "magenta" | "yellow" | "green";

export type ActivityRow = {
	player: string;
	game: string;
	score: number;
	timeAgo: string;
	color: ActivityColor;
};

// Fixed, non-real-time labels so the section reads as "live" without claiming
// real telemetry (see design.md - Risks / Trade-offs).
const ACTIVITY_TIME_LABELS = [
	"hace 2 min",
	"hace 5 min",
	"hace 8 min",
	"hace 12 min",
	"hace 18 min",
	"hace 24 min",
	"hace 31 min",
];
const ACTIVITY_COLORS: ActivityColor[] = [
	"magenta",
	"yellow",
	"green",
	"cyan",
	"cyan",
	"green",
	"yellow",
];

export type TopPlayerRow = { rank: number; name: string; score: number };

/** Top-players-today list, drawn from the same seeded score generator used
 * across the app. Pure/deterministic, no DB dependency, so it stays a module
 * constant rather than joining `getHomeData()`. */
export const topPlayersToday: TopPlayerRow[] = seededScores(777, 5).map((row) => ({
	rank: row.rank,
	name: row.name,
	score: row.score,
}));

export type HomeData = {
	featuredGames: Game[];
	stats: Stat[];
	recentActivity: ActivityRow[];
};

/** Assembles the landing page's catalog-derived content in one read. The
 * catalog can no longer be read synchronously at module load time (it's a
 * persisted table, not a hardcoded array), so this replaces what used to be
 * three top-level constants. Never throws: on a catalog read failure it
 * degrades to an empty rail and a literal stats fallback rather than
 * crashing the root route. */
export async function getHomeData(): Promise<HomeData> {
	const result = await getAllGames();
	if (!result.ok) {
		return {
			featuredGames: [],
			stats: [
				{ n: "—", u: "JUEGOS", s: "CATÁLOGO NO DISPONIBLE" },
				{ n: "MILES", u: "DE PARTIDAS", s: "JUGADAS CADA DÍA" },
				{ n: "GLOBAL", u: "RANKING", s: "COMPITE CON EL MUNDO" },
			],
			recentActivity: [],
		};
	}

	const { games } = result;
	const featuredGames = games.slice(0, FEATURED_GAME_COUNT);

	const stats: Stat[] = [
		{ n: `${games.length}+`, u: "JUEGOS", s: "Y CONTANDO" },
		{ n: "MILES", u: "DE PARTIDAS", s: "JUGADAS CADA DÍA" },
		{ n: "GLOBAL", u: "RANKING", s: "COMPITE CON EL MUNDO" },
	];

	// Recent-scores ticker: the top recorded score for a rotating slice of the
	// catalog, seeded deterministically per game so repeated renders (and
	// server/client hydration) always produce the same rows.
	const recentActivity: ActivityRow[] =
		games.length === 0
			? []
			: ACTIVITY_TIME_LABELS.map((timeAgo, i) => {
					const game = games[i % games.length];
					const [topScore] = seededScores(game.id.length * 13 + i * 5 + 1, 1);
					return {
						player: topScore.name,
						game: game.title,
						score: topScore.score,
						timeAgo,
						color: ACTIVITY_COLORS[i % ACTIVITY_COLORS.length],
					};
				});

	return { featuredGames, stats, recentActivity };
}
