import posthog, { PostHog } from 'posthog-node';

let _client: PostHog | null = null;

export function getPostHogClient() {
	if (!_client) {
		_client = new posthog.PostHog('phc_pXPMfdpgrBN9eT7hFmaRZIzLJuC87f3KeCwdlMi5p2W', {
			host: 'https://us.i.posthog.com'
		});
	}
	return _client;
}