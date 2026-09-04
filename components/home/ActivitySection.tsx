import Link from 'next/link';
import { recentActivity, topPlayersToday } from '@/lib/home';

export function ActivitySection() {
	return (
		<section className="home-section">
			<div className="section-head">
				<div className="kicker pixel neon-yellow">{'// 03'}</div>
				<h2 className="section-title">ACTIVIDAD EN VIVO</h2>
				<div className="section-rule" />
			</div>
			<div className="activity-grid">
				<div className="activity-card">
					<div className="ac-head">
						<div className="ac-title pixel">▸ ÚLTIMAS PUNTUACIONES</div>
					</div>
					<div className="ticker">
						{recentActivity.map((row, i) => (
							<div
								className="tick-row"
								key={`${row.player}-${row.game}`}
								style={{ animationDelay: `${i * 60}ms` }}
							>
								<span className={`tk-p neon-${row.color}`}>{row.player}</span>
								<span className="tk-mid">▸ {row.game}</span>
								<span className="tk-s">+{row.score.toLocaleString('es-ES')}</span>
								<span className="tk-t">{row.timeAgo}</span>
							</div>
						))}
					</div>
				</div>

				<div className="activity-card">
					<div className="ac-head">
						<div className="ac-title pixel neon-magenta">▸ TOP JUGADORES · HOY</div>
						<Link className="lb-link" href="/salon-de-la-fama">
							VER SALÓN →
						</Link>
					</div>
					<div className="top-list">
						{topPlayersToday.map((row, i) => (
							<div
								className={`top-row${i === 0 ? ' top1' : i === 1 ? ' top2' : i === 2 ? ' top3' : ''}`}
								key={row.name}
							>
								<span className="tp-rk">#{String(row.rank).padStart(2, '0')}</span>
								<span className="tp-p">{row.name}</span>
								<span className="tp-s">{row.score.toLocaleString('es-ES')}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
