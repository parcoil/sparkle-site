export const load = async ({ fetch }: { fetch: any }) => {
	try {
		const res = await fetch('/api/releases');
		const releases = await res.json();
		return { releases };
	} catch {
		return { error: 'Failed to load releases' };
	}
};
