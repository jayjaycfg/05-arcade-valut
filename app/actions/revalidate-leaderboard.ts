"use server";

import { revalidatePath } from "next/cache";
import { getGameById } from "@/lib/games-server";

/**
 * Busts the ISR cache for a game's detail page right after a score is
 * submitted, so the leaderboard doesn't wait for the page's own 60s
 * `revalidate` window (see design.md - Rendering).
 *
 * Server Functions are reachable via direct POST requests, not just through
 * the app's UI (Next.js docs - Mutating Data), so `gameId` is validated
 * against the real catalog before doing anything — this only busts a public,
 * non-sensitive cache, but there is no reason to let an arbitrary string
 * through. A catalog read failure also results in no-op, matching the
 * "fail closed" behavior of the previous check.
 */
export async function revalidateLeaderboard(gameId: string): Promise<void> {
  const result = await getGameById(gameId);
  if (!result.ok || !result.game) return;
  revalidatePath(`/juegos/${gameId}`);
}
