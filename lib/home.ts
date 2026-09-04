import { GAMES, type Game, seededScores } from "./games";

/** Number of games shown in the landing page's featured-games rail. */
export const FEATURED_GAME_COUNT = 6;

export const featuredGames: Game[] = GAMES.slice(0, FEATURED_GAME_COUNT);

export type Stat = { n: string; u: string; s: string };

/** Stats band content. Game count is derived from the live catalog, not hardcoded. */
export const stats: Stat[] = [
	{ n: `${GAMES.length}+`, u: "JUEGOS", s: "Y CONTANDO" },
	{ n: "MILES", u: "DE PARTIDAS", s: "JUGADAS CADA DÍA" },
	{ n: "GLOBAL", u: "RANKING", s: "COMPITE CON EL MUNDO" },
];

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

/**
 * Recent-scores ticker: the top recorded score for a rotating slice of the
 * catalog, seeded deterministically per game so repeated renders (and
 * server/client hydration) always produce the same rows.
 */
export const recentActivity: ActivityRow[] = ACTIVITY_TIME_LABELS.map((timeAgo, i) => {
	const game = GAMES[i % GAMES.length];
	const [topScore] = seededScores(game.id.length * 13 + i * 5 + 1, 1);
	return {
		player: topScore.name,
		game: game.title,
		score: topScore.score,
		timeAgo,
		color: ACTIVITY_COLORS[i % ACTIVITY_COLORS.length],
	};
});

export type TopPlayerRow = { rank: number; name: string; score: number };

/** Top-players-today list, drawn from the same seeded score generator used across the app. */
export const topPlayersToday: TopPlayerRow[] = seededScores(777, 5).map((row) => ({
	rank: row.rank,
	name: row.name,
	score: row.score,
}));
