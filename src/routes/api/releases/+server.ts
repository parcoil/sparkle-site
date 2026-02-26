import { json } from '@sveltejs/kit';

export const GET = async () => {
	const res = await fetch('https://api.github.com/repos/Parcoil/Sparkle/releases?per_page=20');

	if (!res.ok) {
		return json({ error: 'Failed to fetch releases' }, { status: 502 });
	}

	const releases = await res.json();

	const patchNotes = releases.map((release: any) => ({
		version: release.tag_name.replace('v', ''),
		date: new Date(release.published_at).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}),
		features: [],
		fixes: [],
		breaking: [],
		body: release.body || ''
	}));

	return json(patchNotes, {
		headers: {
			'Cache-Control': 'public, max-age=3600, s-maxage=86400'
		}
	});
};
