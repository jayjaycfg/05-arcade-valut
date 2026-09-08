import Link from 'next/link';
import type { GetTopScoresResult } from '@/lib/leaderboard-server';

export function Leaderboard({ gameId, result }: { gameId: string; result: GetTopScoresResult }) {
	return (
		<div className="leaderboard">
			<h3>MEJORES PUNTUACIONES</h3>
			{!result.ok ? (
				<div className="lb-row empty">
					<div className="pixel neon-magenta" style={{ fontSize: 11 }}>
						NO SE PUDO CARGAR EL RANKING
					</div>
					<div className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 8 }}>
						INTÉNTALO DE NUEVO EN UNOS SEGUNDOS
					</div>
					<Link className="btn ghost" href={`/juegos/${gameId}`} style={{ marginTop: 14 }}>
						REINTENTAR
					</Link>
				</div>
			) : result.rows.length === 0 ? (
				<div className="lb-row empty">
					<div className="pixel neon-cyan" style={{ fontSize: 11 }}>
						AÚN NO HAY PUNTUACIONES
					</div>
					<div className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 8 }}>
						SÉ EL PRIMERO EN ENTRAR AL RANKING
					</div>
					<Link className="btn ghost" href={`/juegos/${gameId}/jugar`} style={{ marginTop: 14 }}>
						▶ JUGAR AHORA
					</Link>
				</div>
			) : (
				result.rows.map((r, i) => (
					<div
						className={`lb-row${i === 0 ? ' top1' : i === 1 ? ' top2' : i === 2 ? ' top3' : ''}`}
						key={r.id}
					>
						<div className="rk">#{String(r.rank).padStart(2, '0')}</div>
						<div className="pl">
							{r.name}
							<div style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>
								{r.date}
							</div>
						</div>
						<div className="sc">{r.score.toLocaleString('es-ES')}</div>
					</div>
				))
			)}
		</div>
	);
}
