'use client';

import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

/** Matches the `scores.nickname` CHECK constraint (`^[A-Z0-9_]{1,10}$`). */
function sanitizeNickname(raw: string): string {
	const cleaned = raw.toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 10);
	return cleaned || 'INVITADO';
}

function sanitizeScore(raw: number): number {
	const n = Math.floor(raw);
	if (!Number.isFinite(n) || n < 0) return 0;
	return Math.min(n, 100_000_000);
}

/** Ensures a Supabase session exists, signing in anonymously only if needed.
 * Called lazily from `submitScore` — never on page load — so passive
 * visitors never create an auth user (see design.md - Identity). */
async function ensureAnonSession(): Promise<string> {
	const { data: sessionData } = await supabase.auth.getSession();
	if (sessionData.session?.user) return sessionData.session.user.id;

	const { data, error } = await supabase.auth.signInAnonymously();
	if (error || !data.user) {
		throw new AnonSessionError(error?.message ?? 'no user returned');
	}
	return data.user.id;
}

class AnonSessionError extends Error {}

export type SubmitScoreInput = { gameId: string; score: number; name: string };

export type SubmitScoreResult =
	| { ok: true; id: string }
	| { ok: false; code: 'auth_disabled' | 'rate_limited' | 'invalid' | 'network' | 'unknown'; message: string };

/** Persists a game-over score under the current (or newly created)
 * anonymous identity. Never throws — every failure path resolves to a typed
 * `{ ok: false }` result so the caller can show an inline error and offer a
 * retry without losing the player's entered name/score (see game-player
 * spec: "Submission fails"). */
export async function submitScore({ gameId, score, name }: SubmitScoreInput): Promise<SubmitScoreResult> {
	let playerId: string;
	try {
		playerId = await ensureAnonSession();
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		const code = /anonymous/i.test(message) ? 'auth_disabled' : 'network';
		return { ok: false, code, message: 'NO SE PUDO IDENTIFICAR TU SESIÓN' };
	}

	const { data, error } = await supabase
		.from('scores')
		.insert({
			game_id: gameId,
			player_id: playerId,
			nickname: sanitizeNickname(name),
			score: sanitizeScore(score),
		})
		.select('id')
		.single();

	if (error) {
		if (error.code === 'P0001' || /rate_limit/i.test(error.message)) {
			return { ok: false, code: 'rate_limited', message: 'DEMASIADOS ENVÍOS · ESPERA UN MOMENTO' };
		}
		if (error.code === '23514') {
			return { ok: false, code: 'invalid', message: 'PUNTUACIÓN O NOMBRE NO VÁLIDOS' };
		}
		console.error('submitScore failed', error);
		return { ok: false, code: 'unknown', message: 'NO SE PUDO GUARDAR LA PUNTUACIÓN' };
	}

	if (!data) return { ok: false, code: 'unknown', message: 'NO SE PUDO GUARDAR LA PUNTUACIÓN' };
	return { ok: true, id: data.id };
}
