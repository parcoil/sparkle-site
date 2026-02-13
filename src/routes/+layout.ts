import posthog from 'posthog-js';
import { browser } from '$app/environment';

// export const ssr = false;

export const load = async () => {
	if (browser) {
		posthog.init('phc_pXPMfdpgrBN9eT7hFmaRZIzLJuC87f3KeCwdlMi5p2W', {
			api_host: 'https://us.i.posthog.com',
			capture_pageview: true,
			capture_pageleave: true,
			capture_exceptions: true // This enables capturing exceptions using Error Tracking
		});
	}
	return;
};
