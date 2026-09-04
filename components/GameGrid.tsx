'use client';

import { useMemo, useState } from 'react';
import { GameCard } from '@/components/GameCard';
import { CATS, GAMES } from '@/lib/games';

export function GameGrid() {
	const [q, setQ] = useState('');
	const [cat, setCat] = useState('TODOS');

	const filtered = useMemo(() => {
		return GAMES.filter(
			(g) => (cat === 'TODOS' || g.cat === cat) && g.title.toLowerCase().includes(q.toLowerCase()),
		);
	}, [q, cat]);

	return (
		<>
			<div className="av-filters">
				<div className="av-search">
					<span className="ico">⌕</span>
					<input
						onChange={(e) => setQ(e.target.value)}
						placeholder="Buscar un juego por nombre…"
						value={q}
					/>
				</div>
				<div className="av-chips">
					{CATS.map((c) => (
						<button
							className={`chip${cat === c ? ' active' : ''}`}
							key={c}
							onClick={() => setCat(c)}
							type="button"
						>
							{c}
						</button>
					))}
				</div>
			</div>

			<div className="av-grid">
				{filtered.map((g) => (
					<GameCard game={g} key={g.id} />
				))}
				{filtered.length === 0 && (
					<div
						style={{
							gridColumn: '1 / -1',
							textAlign: 'center',
							padding: 80,
							color: 'var(--ink-faint)',
						}}
					>
						<div
							className="pixel"
							style={{ fontSize: 14, color: 'var(--magenta)', marginBottom: 12 }}
						>
							NO HAY RESULTADOS
						</div>
						<div>Intenta otra búsqueda o categoría.</div>
					</div>
				)}
			</div>
		</>
	);
}
