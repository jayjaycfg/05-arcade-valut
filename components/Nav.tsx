'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export function Nav() {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { user, signOut } = useAuth();

	const isActive = (name: 'biblioteca' | 'salon') => {
		if (name === 'biblioteca') return pathname === '/' || pathname.startsWith('/juegos');
		return pathname === '/salon-de-la-fama';
	};

	const close = () => setOpen(false);

	return (
		<>
			<nav className="av-nav">
				<Link className="logo" href="/" onClick={close}>
					<div className="logo-mark" />
					<div className="logo-text neon-cyan">
						ARCADE <span className="neon-magenta">VAULT</span>
					</div>
				</Link>
				<div className="links">
					<Link className={isActive('biblioteca') ? 'active' : ''} href="/">
						Biblioteca
					</Link>
					<Link className={isActive('salon') ? 'active' : ''} href="/salon-de-la-fama">
						Salón de la Fama
					</Link>
				</div>
				<div className="spacer" />
				<div className="coin-counter">
					<span className="coin" />
					<span>CRÉDITOS · 03</span>
				</div>
				{user ? (
					<button className="btn ghost auth-btn" onClick={() => signOut()} type="button">
						{user.name} ▾
					</button>
				) : (
					<button
						className="btn auth-btn"
						onClick={() => router.push('/acceso')}
						type="button"
					>
						Iniciar Sesión
					</button>
				)}
				<button
					aria-label="Menú"
					className="btn ghost hamburger"
					onClick={() => setOpen(true)}
					type="button"
				>
					≡
				</button>
			</nav>

			<button
				aria-label="Cerrar menú"
				className={`av-mobile-backdrop${open ? ' open' : ''}`}
				onClick={close}
				style={{ border: 0, padding: 0, cursor: 'default' }}
				type="button"
			/>
			<aside className={`av-mobile-panel${open ? ' open' : ''}`}>
				<div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>
					MENÚ
				</div>
				<Link className={isActive('biblioteca') ? 'active' : ''} href="/" onClick={close}>
					Biblioteca
				</Link>
				<Link
					className={isActive('salon') ? 'active' : ''}
					href="/salon-de-la-fama"
					onClick={close}
				>
					Salón de la Fama
				</Link>
				<Link className={pathname === '/acceso' ? 'active' : ''} href="/acceso" onClick={close}>
					{user ? 'Cuenta' : 'Iniciar Sesión'}
				</Link>
				<div style={{ flex: 1 }} />
				<div
					className="pixel"
					style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.16em' }}
				>
					CRÉDITOS · 03
				</div>
			</aside>
		</>
	);
}
