import { fallbackReleaseInfo, type ReleaseInfo } from '#lib/releases.ts';

const REPO = 'Parcoil/Sparkle';
const GITHUB_API = `https://api.github.com/repos/${REPO}`;
const REVALIDATE_SECONDS = 3600;

type GitHubRepo = {
	stargazers_count?: number;
};

type GitHubAsset = {
	name: string;
	browser_download_url: string;
	download_count: number;
};

type GitHubRelease = {
	tag_name?: string;
	assets?: GitHubAsset[];
};

let cached: { value: ReleaseInfo; expires: number } | null = null;
let inFlight: Promise<ReleaseInfo> | null = null;

async function fetchJson<T>(fetch: typeof globalThis.fetch, url: string): Promise<T | null> {
	try {
		const res = await fetch(url, {
			redirect: 'follow',
			headers: {
				Accept: 'application/vnd.github+json',
				'User-Agent': 'Sparkle-Site/1.0'
			}
		});

		if (!res.ok) return null;
		return (await res.json()) as T;
	} catch {
		return null;
	}
}

function buildAssetUrl(version: string, suffix: string) {
	const cleanVersion = version.replace(/^v/, '');
	return `https://github.com/${REPO}/releases/latest/download/sparkle-${cleanVersion}-${suffix}`;
}

function countDownloads(releases: GitHubRelease[]) {
	return releases.reduce((total, release) => {
		if (!release.tag_name || release.tag_name < '2.0.0') return total;

		return (release.assets ?? []).reduce((sum, asset) => {
			const isDownloadable = asset.name.endsWith('.exe') || asset.name.endsWith('.zip');
			return isDownloadable ? sum + (asset.download_count ?? 0) : sum;
		}, total);
	}, 0);
}

async function loadReleaseInfo(fetch: typeof globalThis.fetch): Promise<ReleaseInfo> {
	const [latest, releases, repo] = await Promise.all([
		fetchJson<GitHubRelease>(fetch, `${GITHUB_API}/releases/latest`),
		fetchJson<GitHubRelease[]>(fetch, `${GITHUB_API}/releases?per_page=100`),
		fetchJson<GitHubRepo>(fetch, GITHUB_API)
	]);

	const releaseList = Array.isArray(releases) ? releases : [];
	const latestRelease = latest ?? releaseList[0] ?? null;
	const version = latestRelease?.tag_name ?? '';
	const assets = latestRelease?.assets ?? [];

	const exeAsset = assets.find(
		(asset) => /setup\.exe$/i.test(asset.name) || /\.exe$/i.test(asset.name)
	);
	const zipAsset = assets.find((asset) => /\.zip$/i.test(asset.name));

	return {
		version,
		downloads: countDownloads(releaseList).toLocaleString('en-US'),
		exeUrl:
			exeAsset?.browser_download_url ??
			(version ? buildAssetUrl(version, 'setup.exe') : fallbackReleaseInfo.exeUrl),
		zipUrl:
			zipAsset?.browser_download_url ??
			(version ? buildAssetUrl(version, 'win.zip') : fallbackReleaseInfo.zipUrl),
		stars: typeof repo?.stargazers_count === 'number' ? repo.stargazers_count : null
	};
}

export function getReleaseInfo(
	fetch: typeof globalThis.fetch = globalThis.fetch
): Promise<ReleaseInfo> {
	const now = Date.now();

	if (cached && cached.expires > now) return Promise.resolve(cached.value);
	if (inFlight) return inFlight;

	inFlight = loadReleaseInfo(fetch)
		.then((value) => {
			cached = { value, expires: Date.now() + REVALIDATE_SECONDS * 1000 };
			return value;
		})
		.catch(() => cached?.value ?? fallbackReleaseInfo)
		.finally(() => {
			inFlight = null;
		});

	return inFlight;
}
