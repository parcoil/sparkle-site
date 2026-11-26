export type ReleaseInfo = {
	version: string;
	downloads: string;
	exeUrl: string;
	zipUrl: string;
	stars: number | null;
};

export const fallbackReleaseInfo: ReleaseInfo = {
	version: '',
	downloads: '',
	exeUrl: 'https://github.com/Parcoil/Sparkle/releases/latest',
	zipUrl: 'https://github.com/Parcoil/Sparkle/releases/latest',
	stars: null
};

export function formatStars(stars: number | null): string {
	if (stars === null) return '';

	return new Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1
	})
		.format(stars)
		.replace('K', 'k');
}
