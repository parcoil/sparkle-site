import type { Action } from 'svelte/action';

type RevealOptions = {
	className?: string;
	delay?: number;
	once?: boolean;
};

/** Adds a class when an element scrolls into view. */
export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options) => {
	const className = options?.className ?? 'reveal-visible';

	if (options?.delay) {
		node.style.transitionDelay = `${options.delay}ms`;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;

				node.classList.add(className);
				if (options?.once !== false) observer.unobserve(node);
			}
		},
		{ threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
