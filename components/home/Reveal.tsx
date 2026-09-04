'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Wraps a landing-page section so it fades/slides in the first time it
 * scrolls into view. Falls back to always-visible when IntersectionObserver
 * isn't available; a global no-JS style rule (see app/layout.tsx) covers the
 * case where JavaScript itself is disabled.
 */
export function Reveal({
	children,
	className = '',
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (typeof IntersectionObserver === 'undefined') {
			setVisible(true);
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setVisible(true);
						io.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.12 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	return (
		<div className={`reveal${visible ? ' in' : ''}${className ? ` ${className}` : ''}`} ref={ref}>
			{children}
		</div>
	);
}
