import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Leaderboard } from "@/components/Leaderboard";
import { GAMES, getGame } from "@/lib/games";
import { getTopScores } from "@/lib/leaderboard-server";

// Cookie-free read (see lib/leaderboard-server.ts), so this route stays
// prerenderable via generateStaticParams; content refreshes at most once a
// minute instead of forcing fully dynamic rendering (design.md - Rendering).
export const revalidate = 60;

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const game = getGame(id);
  return { title: game ? `${game.title} · Arcade Vault` : "Arcade Vault" };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  const scoresResult = await getTopScores(id);
  const bestScore =
    scoresResult.ok && scoresResult.rows.length > 0 ? scoresResult.rows[0].score : game.best;

  return (
    <div className="av-detail fade-in">
      <div>
        <div className="detail-cover">
          <div className={`cover-bg ${game.cover}`} />
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
              <div className="v">{game.plays}</div>
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
