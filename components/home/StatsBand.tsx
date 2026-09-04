import { stats } from '@/lib/home';

export function StatsBand() {
	return (
		<section className="home-stats">
			<div className="stats-inner">
				{stats.map((stat, i) => (
					<div className="stat-block" key={stat.u} style={{ transitionDelay: `${i * 90}ms` }}>
						<div className="stat-n neon-yellow">{stat.n}</div>
						<div className="stat-u pixel">{stat.u}</div>
						<div className="stat-s">{stat.s}</div>
					</div>
				))}
			</div>
		</section>
	);
}
