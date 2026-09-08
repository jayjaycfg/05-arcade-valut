import { notFound } from "next/navigation";
import { GamePlayer } from "@/components/GamePlayer";
import { getGameById } from "@/lib/games-server";

export default async function GamePlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getGameById(id);
  // Same not-found-vs-error split as app/juegos/[id]/page.tsx: a read
  // failure must not render as a 404.
  if (!result.ok) throw new Error("Failed to load game catalog");
  const game = result.game;
  if (!game) notFound();

  return <GamePlayer game={game} />;
}
