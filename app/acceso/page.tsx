'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function AccesoPage() {
	const router = useRouter();
	const { signIn } = useAuth();
	const [tab, setTab] = useState<'in' | 'up'>('in');
	const [user, setUser] = useState('');
	const [pass, setPass] = useState('');
	const [email, setEmail] = useState('');

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		signIn({ name: (user || 'PLAYER1').toUpperCase().slice(0, 10) });
		router.push('/games');
	};

	return (
		<div className="av-auth-wrap fade-in">
			<div className="auth-card">
				<div className="auth-header">
					<div className="mark" />
					<h2 className="neon-cyan">ARCADE VAULT</h2>
					<div
						className="mono"
						style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.16em', marginTop: 6 }}
					>
						ACCESO AL SISTEMA · v2.6
					</div>
				</div>

				<div className="auth-tabs">
					<button className={tab === 'in' ? 'on' : ''} onClick={() => setTab('in')} type="button">
						INICIAR SESIÓN
					</button>
					<button className={tab === 'up' ? 'on' : ''} onClick={() => setTab('up')} type="button">
						CREAR CUENTA
					</button>
				</div>

				<form onSubmit={submit}>
					<div className="field">
						<label htmlFor="acceso-user">Usuario</label>
						<input
							id="acceso-user"
							onChange={(e) => setUser(e.target.value)}
							placeholder="px_kai"
							value={user}
						/>
					</div>
					{tab === 'up' && (
						<div className="field slide-in">
							<label htmlFor="acceso-email">Correo electrónico</label>
							<input
								id="acceso-email"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="jugador@vault.gg"
								type="email"
								value={email}
							/>
						</div>
					)}
					<div className="field">
						<label htmlFor="acceso-pass">Contraseña</label>
						<input
							id="acceso-pass"
							onChange={(e) => setPass(e.target.value)}
							placeholder="••••••••"
							type="password"
							value={pass}
						/>
					</div>

					<button className="btn lg" style={{ width: '100%', marginTop: 8 }} type="submit">
						{tab === 'in' ? 'ENTRAR AL VAULT' : 'CREAR Y JUGAR'}
					</button>
				</form>

				<button
					className="btn ghost"
					onClick={() => {
						signIn(null);
						router.push('/games');
					}}
					style={{ width: '100%', marginTop: 10 }}
					type="button"
				>
					JUGAR COMO INVITADO
				</button>

				<div className="auth-divider">O CONTINÚA CON</div>
				<div className="social">
					<button className="btn ghost" type="button">
						◆ GOOGLE
					</button>
					<button className="btn ghost" type="button">
						▣ GITHUB
					</button>
				</div>

				<div
					style={{
						marginTop: 18,
						textAlign: 'center',
						fontSize: 11,
						color: 'var(--ink-faint)',
						letterSpacing: '0.1em',
					}}
				>
					AL ENTRAR ACEPTAS LOS TÉRMINOS DEL SALÓN ARCADE
				</div>
			</div>
		</div>
	);
}
