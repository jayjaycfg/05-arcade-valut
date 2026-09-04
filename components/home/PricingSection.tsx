import Link from 'next/link';

const FEATURES = [
	'Acceso a todos los juegos',
	'Ranking global y salón de la fama',
	'Sin anuncios entre partidas',
	'Guarda tus puntuaciones',
	'Nuevos juegos cada mes',
	'Funciona en cualquier navegador',
];

const FAQS = [
	{
		q: '¿REALMENTE ES GRATIS?',
		a: 'Sí. Arcade Vault es un proyecto sin fines de lucro hecho por amor a los clásicos. No hay versión "premium" escondida.',
	},
	{
		q: '¿NECESITO CREAR CUENTA?',
		a: 'No. Puedes jugar como invitado. Si quieres guardar tu puntuación y aparecer en el ranking, regístrate en 10 segundos.',
	},
	{
		q: '¿CÓMO SOBREVIVEN SIN COBRAR?',
		a: 'Es un proyecto comunitario. Si te gusta, compártelo. Esa es toda la moneda que aceptamos.',
	},
];

export function PricingSection() {
	return (
		<section className="home-section">
			<div className="section-head">
				<div className="kicker pixel neon-green">{'// 04'}</div>
				<h2 className="section-title">PRECIOS</h2>
				<div className="section-rule" />
			</div>
			<div className="pricing-grid">
				<div className="price-card">
					<div className="pc-label pixel">PLAN ÚNICO</div>
					<div className="pc-name pixel">JUGADOR VAULT</div>
					<div className="pc-amount">
						<span className="pc-amount-n">$0</span>
						<span className="pc-amount-u">/ SIEMPRE</span>
					</div>
					<div className="pc-tag">SIN TRUCOS · SIN LETRA PEQUEÑA</div>
					<ul className="pc-list">
						{FEATURES.map((feature) => (
							<li key={feature}>✔ {feature}</li>
						))}
					</ul>
					<Link className="btn xl pulse" href="/acceso" style={{ width: '100%' }}>
						EMPEZAR GRATIS →
					</Link>
					<div className="pc-foot">No pedimos tarjeta. Nunca lo haremos.</div>
					<div className="pc-stamp pixel">
						FREE
						<br />
						PLAY
					</div>
				</div>

				<div className="pricing-faq">
					{FAQS.map((faq) => (
						<div className="faq-item" key={faq.q}>
							<div className="faq-q pixel">{faq.q}</div>
							<div className="faq-a">{faq.a}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
