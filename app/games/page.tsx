import { GameGrid } from "@/components/GameGrid";
import { getAllGames } from "@/lib/games-server";

export const revalidate = 300;

export default async function GamesPage() {
  const result = await getAllGames();

  return (
    <div className="fade-in">
      <section className="av-hero">
        <h1 className="flicker">ARCADE VAULT</h1>
        <div className="sub">
          INSERTA UNA MONEDA PARA JUGAR <span className="blink">_</span>
        </div>
      </section>

      <GameGrid games={result.ok ? result.games : []} failed={!result.ok} />
    </div>
  );
}
