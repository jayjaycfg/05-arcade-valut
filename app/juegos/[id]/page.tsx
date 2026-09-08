import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Leaderboard } from "@/components/Leaderboard";
import { formatPlays, safeCover } from "@/lib/games";
import { getAllGames, getGameById } from "@/lib/games-server";
import { getTopScores } from "@/lib/leaderboard-server";

// Cookie-free read (see lib/leaderboard-server.ts), so this route stays
// prerenderable via generateStaticParams; content refreshes at most once a
// minute instead of forcing fully dynamic rendering (design.md - Rendering).
export const revalidate = 60;

export async function generateStaticParams() {
  const result = await getAllGames();
  // A build-time catalog outage degrades to on-demand rendering (default
  // `dynamicParams: true`) instead of failing the whole build.
  if (!result.ok) return [];
  return result.games.map((g) => ({ id: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getGameById(id);
  const game = result.ok ? result.game : null;
  return { title: game ? `${game.title} · Arcade Vault` : "Arcade Vault" };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getGameById(id);
  // A read failure is a distinct error condition, not evidence the game is
  // missing — it must not render as a 404 (game-detail spec: "Catalog read
  // failure is not treated as unknown game"). `error.tsx` handles the throw.
  if (!result.ok) throw new Error("Failed to load game catalog");
  const game = result.game;
  if (!game) notFound();

  const scoresResult = await getTopScores(id);
  const bestScore =
    scoresResult.ok && scoresResult.rows.length > 0 ? scoresResult.rows[0].score : game.best;

  return (
    <div className="av-detail fade-in">
      <div>
        <div className="detail-cover">
          <div className={`cover-bg ${safeCover(game.cover)}`} />
        </div>
        <div style={{ marginTop: 20 }} className="detail-info">
          <div className="detail-tags">
            <span>{game.cat}</span>
            <span>1 JUGADOR</span>
            <span>TECLADO / TÁCTIL</span>
            <span>RETRO 1985</span>
          </div>
          <h2 className="neon-cyan">{game.title}</h2>
          <p>{game.long}</p>
          <div className="stat-strip">
            <div>
              <div className="l">Partidas</div>
              <div className="v">{formatPlays(game.plays)}</div>
            </div>
            <div>
              <div className="l">Mejor global</div>
              <div
                className="v"
                style={{ color: "var(--magenta)", textShadow: "0 0 6px rgba(255,0,110,0.5)" }}
              >
                {bestScore.toLocaleString("es-ES")}
              </div>
            </div>
            <div>
              <div className="l">Dificultad</div>
              <div
                className="v"
                style={{ color: "var(--yellow)", textShadow: "0 0 6px rgba(245,255,0,0.5)" }}
              >
                ★ ★ ★ ☆ ☆
              </div>
            </div>
          </div>
          <div className="detail-actions">
            <Link className="btn xl pulse" href={`/juegos/${game.id}/jugar`}>
              ▶ JUGAR AHORA
            </Link>
            <Link className="btn ghost lg" href="/games">
              VOLVER AL VAULT
            </Link>
          </div>
        </div>
      </div>

      <aside>
        <Leaderboard gameId={id} result={scoresResult} />
      </aside>
    </div>
  );
}
