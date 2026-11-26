import type { LayoutServerLoad } from './$types';
import { fallbackReleaseInfo } from '#lib/releases.ts';
import { isMaintenanceMode } from '#lib/maintenance.ts';
import { getAllPosts } from '#lib/server/blog.js';
import { getReleaseInfo } from '#lib/server/releases.js';

export const load: LayoutServerLoad = async ({ fetch, setHeaders }) => {
	const maintenance = isMaintenanceMode();

	if (maintenance) {
		setHeaders({ 'cache-control': 'no-store' });
	} else {
		setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=3600' });
	}

	const [releaseInfo, posts] = await Promise.all([
		maintenance ? Promise.resolve(fallbackReleaseInfo) : getReleaseInfo(fetch),
		Promise.resolve(getAllPosts())
	]);

	const latestPost = posts[0];

	return {
		maintenance,
		releaseInfo,
		latestPost: latestPost ? { slug: latestPost.slug, title: latestPost.title } : null
	};
};
