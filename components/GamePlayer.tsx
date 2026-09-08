'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { revalidateLeaderboard } from '@/app/actions/revalidate-leaderboard';
import type { AsteroidsGameHandle } from '@/components/games/AsteroidsGame';
import { useAuth } from '@/lib/auth-context';
import { getEngine } from '@/lib/game-engines';
import type { Game } from '@/lib/games';
import { submitScore } from '@/lib/leaderboard-client';

export function GamePlayer({ game }: { game: Game }) {
	const { user, saveScore } = useAuth();
	// Effective playability requires both the catalog flag and a registered
	// engine (see game-player spec: "Catalog playable flag gates engine use").
	const Engine = game.playable ? getEngine(game.id) : undefined;
	const usesEngine = Boolean(Engine);
	const asteroidsRef = useRef<AsteroidsGameHandle>(null);
	const [score, setScore] = useState(0);
	const [lives, setLives] = useState(3);
	const [level, setLevel] = useState(1);
	const [paused, setPaused] = useState(false);
	const [over, setOver] = useState(false);
	const [name, setName] = useState(user ? user.name : 'INVITADO');
	const [saved, setSaved] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (usesEngine || over || paused) return;
		const t = setInterval(() => setScore((s) => s + Math.floor(10 + Math.random() * 90)), 220);
		return () => clearInterval(t);
	}, [usesEngine, over, paused]);

	useEffect(() => {
		if (usesEngine) return;
		if (score > 0 && score % 2500 < 100) setLevel((l) => l + 1);
	}, [usesEngine, score]);

	const endGame = () => setOver(true);
	const restart = () => {
		if (usesEngine) asteroidsRef.current?.reset();
		setScore(0);
		setLives(3);
		setLevel(1);
		setPaused(false);
		setOver(false);
		setSaved(false);
		setSubmitting(false);
		setError(null);
	};

	const submitFinalScore = async () => {
		if (submitting || saved) return;
		setSubmitting(true);
		setError(null);
		// Local mirror kept as an offline fallback — the Supabase write below is
		// the source of truth for the real leaderboard (design.md - Decisions).
		saveScore({ game: game.id, score, name });
		try {
			const result = await submitScore({ gameId: game.id, score, name });
			if (result.ok) {
				setSaved(true);
				// Fire-and-forget: a failed cache bust must not fail the submit
				// that already succeeded. The page's own 60s revalidate window is
				// the fallback if this doesn't land.
				void revalidateLeaderboard(game.id);
			} else {
				setError(result.message);
			}
		} catch {
			setError('NO SE PUDO GUARDAR LA PUNTUACIÓN');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="av-player fade-in">
			<div className="player-hud">
				<div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
					<div className="hud-stat">
						<div className="l">Jugador</div>
						<div className="v" style={{ color: 'var(--ink)' }}>
							{name}
						</div>
					</div>
					<div className="hud-stat">
						<div className="l">Puntuación</div>
						<div className="v">{score.toLocaleString('es-ES')}</div>
					</div>
					<div className="hud-stat lives">
						<div className="l">Vidas</div>
						<div className="v">{'♥ '.repeat(lives).trim() || '—'}</div>
					</div>
					<div className="hud-stat level">
						<div className="l">Nivel</div>
						<div className="v">{String(level).padStart(2, '0')}</div>
					</div>
				</div>
				<div className="hud-actions">
					<button
						className="btn yellow"
						onClick={() => {
							setPaused((p) => {
								const next = !p;
								if (next) asteroidsRef.current?.pause();
								else asteroidsRef.current?.resume();
								return next;
							});
						}}
						type="button"
					>
						{paused ? 'REANUDAR' : 'PAUSA'}
					</button>
					<button className="btn magenta" onClick={endGame} type="button">
						FIN
					</button>
					<Link className="btn ghost" href={`/juegos/${game.id}`}>
						SALIR
					</Link>
				</div>
			</div>

			<div className="crt">
				<div className="crt-screen">
					{Engine ? (
						<Engine
							ref={asteroidsRef}
							onState={(s) => {
								setScore(s.score);
								setLives(s.lives);
								setLevel(s.level);
							}}
							onGameOver={(finalScore) => {
								setScore(finalScore);
								setOver(true);
							}}
						/>
					) : (
						<div className="game-arena">
							<div className="grid-floor" />
							<div className="enemy e1" />
							<div className="enemy e2" />
							<div className="enemy e3" />
							<div className="player-ship" />
						</div>
					)}
					{paused && (
						<div className="crt-content" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 5 }}>
							<div>
								<div className="pixel neon-yellow" style={{ fontSize: 22 }}>
									EN PAUSA
								</div>
								<div
									className="mono"
									style={{ fontSize: 11, color: 'var(--ink-dim)', marginTop: 10, letterSpacing: '0.16em' }}
								>
									PULSA REANUDAR PARA CONTINUAR
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="crt-bottom">
					<span className="led">SEÑAL OK</span>
					<span>{game.title} · CRT-83 · 60 HZ</span>
					<span>CARGA · 1MB</span>
				</div>
			</div>

			{over && (
				<div className="modal-bd">
					<div className="modal">
						<h2>FIN DEL JUEGO</h2>
						<div className="final-label">PUNTUACIÓN FINAL</div>
						<div className="final">{score.toLocaleString('es-ES')}</div>
						{saved ? (
							<div className="toast-saved">▸ PUNTUACIÓN GUARDADA_</div>
						) : (
							<div className="input-row">
								<input
									onChange={(e) =>
										setName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '').slice(0, 10))
									}
									placeholder="TUS INICIALES"
									value={name}
								/>
								<button
									className="btn yellow"
									disabled={submitting}
									onClick={submitFinalScore}
									type="button"
								>
									{submitting ? 'GUARDANDO…' : 'GUARDAR PUNTUACIÓN'}
								</button>
							</div>
						)}
						{error && !saved && <div className="toast-error">▸ {error}</div>}
						<div className="actions">
							<button className="btn" onClick={restart} type="button">
								JUGAR DE NUEVO
							</button>
							<Link className="btn magenta" href="/">
								VOLVER AL VAULT
							</Link>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
