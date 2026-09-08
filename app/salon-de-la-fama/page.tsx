import { HallOfFame } from "@/components/HallOfFame";
import { getAllGames } from "@/lib/games-server";

export const metadata = {
  title: "Salón de la Fama · Arcade Vault",
};

export const revalidate = 300;

export default async function SalonDeLaFamaPage() {
  const result = await getAllGames();
  return <HallOfFame games={result.ok ? result.games : []} />;
}
