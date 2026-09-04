import Link from 'next/link';
import { featuredGames } from '@/lib/home';

export function GamesRail() {
	return (
		<section className="home-section">
			<div className="section-head">
				<div className="kicker pixel neon-cyan">{'// 02'}</div>
				<h2 className="section-title">JUEGOS DISPONIBLES AHORA</h2>
				<div className="section-rule" />
			</div>
			<div className="mini-rail">
				{featuredGames.map((game) => (
					<Link className="mini-card" href={`/juegos/${game.id}`} key={game.id}>
						<div className="mini-cover">
							<div className={`cover-bg ${game.cover}`} />
						</div>
						<div className="mini-meta">
							<div className="mini-title">{game.title}</div>
							<div className="mini-cat">{game.cat}</div>
						</div>
					</Link>
				))}
			</div>
			<div style={{ textAlign: 'center', marginTop: 24 }}>
				<Link className="btn lg" href="/games">
					VER TODOS LOS JUEGOS →
				</Link>
			</div>
		</section>
	);
}
