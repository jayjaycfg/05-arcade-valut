'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type User = { name: string };

export type ScoreEntry = {
	game: string;
	score: number;
	name: string;
	at: number;
};

type AuthContextValue = {
	user: User | null;
	signIn: (user: User | null) => void;
	signOut: () => void;
	saveScore: (entry: Omit<ScoreEntry, 'at'>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		try {
			const stored = localStorage.getItem('av_user');
			if (stored) setUser(JSON.parse(stored));
		} catch {
			// ignore malformed storage
		}
	}, []);

	const signIn = (u: User | null) => {
		setUser(u);
		try {
			if (u) localStorage.setItem('av_user', JSON.stringify(u));
			else localStorage.removeItem('av_user');
		} catch {
			// ignore storage failures
		}
	};

	const signOut = () => {
		setUser(null);
		try {
			localStorage.removeItem('av_user');
		} catch {
			// ignore storage failures
		}
	};

	const saveScore = (entry: Omit<ScoreEntry, 'at'>) => {
		try {
			const all = JSON.parse(localStorage.getItem('av_scores') || '[]');
			all.push({ ...entry, at: Date.now() });
			localStorage.setItem('av_scores', JSON.stringify(all));
		} catch {
			// ignore storage failures
		}
	};

	return (
		<AuthContext.Provider value={{ user, signIn, signOut, saveScore }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
	return ctx;
}
