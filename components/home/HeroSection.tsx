import Link from 'next/link';
import { FloatingSilhouettes } from './FloatingSilhouettes';

export function HeroSection() {
	return (
		<section className="home-hero">
			<FloatingSilhouettes />
			<div className="home-hero-inner">
				<div className="hero-eyebrow pixel neon-yellow">
					▸ INSERTA UNA MONEDA<span className="blink">_</span>
				</div>
				<h1 className="home-title">
					<span className="line-1">EL ARCADE</span>
					<span className="line-2">CLÁSICO ESTÁ</span>
					<span className="line-3">DE VUELTA</span>
				</h1>
				<p className="home-sub">
					Juega los mejores clásicos directamente en tu navegador.
					<br />
					Sin descargas. Sin costo. Solo diversión.
				</p>
				<div className="home-ctas">
					<Link className="btn xl pulse" href="/games">
						▶ EXPLORAR JUEGOS
					</Link>
					<Link className="btn xl magenta" href="/acceso">
						✦ CREAR CUENTA
					</Link>
				</div>
				<div aria-hidden="true" className="hero-scroll">
					<span>DESLIZA</span>
					<span className="arrow">▼</span>
				</div>
			</div>
		</section>
	);
}
