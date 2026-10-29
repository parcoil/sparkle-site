import { cache } from "react";

const REPO = "Parcoil/Sparkle";
const GITHUB_API = `https://api.github.com/repos/${REPO}`;
const REVALIDATE_SECONDS = 3600;

export type ReleaseInfo = {
  version: string;
  downloads: string;
  exeUrl: string;
  zipUrl: string;
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

const fallbackReleaseInfo: ReleaseInfo = {
  version: "",
  downloads: "",
  exeUrl: `https://github.com/${REPO}/releases/latest`,
  zipUrl: `https://github.com/${REPO}/releases/latest`,
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function buildAssetUrl(version: string, suffix: string) {
  const cleanVersion = version.replace(/^v/, "");
  return `https://github.com/${REPO}/releases/latest/download/sparkle-${cleanVersion}-${suffix}`;
}

function countDownloads(releases: GitHubRelease[]) {
  return releases.reduce((total, release) => {
    if (!release.tag_name || release.tag_name < "2.0.0") return total;

    return (release.assets ?? []).reduce((sum, asset) => {
      const isDownloadable =
        asset.name.endsWith(".exe") || asset.name.endsWith(".zip");
      return isDownloadable ? sum + (asset.download_count ?? 0) : sum;
    }, total);
  }, 0);
}

export const getReleaseInfo = cache(async (): Promise<ReleaseInfo> => {
  const [latest, releases] = await Promise.all([
    fetchJson<GitHubRelease>(`${GITHUB_API}/releases/latest`),
    fetchJson<GitHubRelease[]>(`${GITHUB_API}/releases?per_page=100`),
  ]);

  const releaseList = Array.isArray(releases) ? releases : [];
  const latestRelease = latest ?? releaseList[0] ?? null;
  const version = latestRelease?.tag_name ?? "";
  const assets = latestRelease?.assets ?? [];

  const exeAsset = assets.find(
    (asset) => /setup\.exe$/i.test(asset.name) || /\.exe$/i.test(asset.name),
  );
  const zipAsset = assets.find((asset) => /\.zip$/i.test(asset.name));

  return {
    version,
    downloads: countDownloads(releaseList).toLocaleString("en-US"),
    exeUrl:
      exeAsset?.browser_download_url ??
      (version
        ? buildAssetUrl(version, "setup.exe")
        : fallbackReleaseInfo.exeUrl),
    zipUrl:
      zipAsset?.browser_download_url ??
      (version
        ? buildAssetUrl(version, "win.zip")
        : fallbackReleaseInfo.zipUrl),
  };
});
