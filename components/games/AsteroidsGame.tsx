'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import {
	type AsteroidsController,
	type AsteroidsState,
	createAsteroidsGame,
} from '@/lib/games/asteroids/engine';

export type AsteroidsGameHandle = {
	pause: () => void;
	resume: () => void;
	reset: () => void;
};

type AsteroidsGameProps = {
	onState: (state: AsteroidsState) => void;
	onGameOver: (score: number) => void;
};

export const AsteroidsGame = forwardRef<
	AsteroidsGameHandle,
	AsteroidsGameProps
>(function AsteroidsGame({ onState, onGameOver }, ref) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const controllerRef = useRef<AsteroidsController | null>(null);
	const onStateRef = useRef(onState);
	const onGameOverRef = useRef(onGameOver);

	useEffect(() => {
		onStateRef.current = onState;
	}, [onState]);

	useEffect(() => {
		onGameOverRef.current = onGameOver;
	}, [onGameOver]);

	useEffect(() => {
		if (!canvasRef.current) return;
		const controller = createAsteroidsGame(canvasRef.current, {
			onState: (s) => onStateRef.current(s),
			onGameOver: (score) => onGameOverRef.current(score),
		});
		controllerRef.current = controller;
		return () => {
			controller.destroy();
			controllerRef.current = null;
		};
	}, []);

	useImperativeHandle(ref, () => ({
		pause: () => controllerRef.current?.pause(),
		resume: () => controllerRef.current?.resume(),
		reset: () => controllerRef.current?.reset(),
	}));

	return <canvas ref={canvasRef} width={800} height={600} />;
});
