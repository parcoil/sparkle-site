import {
  buildAssetUrl,
  countDownloads,
  fallbackReleaseInfo,
  type GitHubRelease,
  type ReleaseInfo,
} from '@/lib/releases'

const REPO = 'Parcoil/Sparkle'
const GITHUB_API = `https://api.github.com/repos/${REPO}`
const REVALIDATE_SECONDS = 3600

// In-memory TTL cache. This replaces Next.js's `fetch(..., { next: { revalidate } })`
// and React `cache()` for the shared, public GitHub responses.
const responseCache = new Map<string, { value: unknown; expires: number }>()

async function fetchJson<T>(url: string): Promise<T | null> {
  const now = Date.now()
  const cached = responseCache.get(url)
  if (cached && cached.expires > now) {
    return cached.value as T
  }

  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Sparkle-Site/1.0' },
    })
    if (!res.ok) return null

    const data = (await res.json()) as T
    responseCache.set(url, {
      value: data,
      expires: now + REVALIDATE_SECONDS * 1000,
    })
    return data
  } catch {
    return null
  }
}

export async function getReleaseInfo(): Promise<ReleaseInfo> {
  const [latest, releases] = await Promise.all([
    fetchJson<GitHubRelease>(`${GITHUB_API}/releases/latest`),
    fetchJson<GitHubRelease[]>(`${GITHUB_API}/releases?per_page=100`),
  ])

  const releaseList = Array.isArray(releases) ? releases : []
  const latestRelease = latest ?? releaseList[0] ?? null
  const version = latestRelease?.tag_name ?? ''
  const assets = latestRelease?.assets ?? []

  const exeAsset = assets.find(
    (asset) => /setup\.exe$/i.test(asset.name) || /\.exe$/i.test(asset.name),
  )
  const zipAsset = assets.find((asset) => /\.zip$/i.test(asset.name))

  return {
    version,
    downloads: countDownloads(releaseList).toLocaleString('en-US'),
    exeUrl:
      exeAsset?.browser_download_url ??
      (version
        ? buildAssetUrl(version, 'setup.exe')
        : fallbackReleaseInfo.exeUrl),
    zipUrl:
      zipAsset?.browser_download_url ??
      (version
        ? buildAssetUrl(version, 'win.zip')
        : fallbackReleaseInfo.zipUrl),
  }
}

export type PatchNote = {
  version: string
  date: string
  body: string
}

export async function getPatchNotes(): Promise<PatchNote[]> {
  const releases = await fetchJson<GitHubRelease[]>(
    `${GITHUB_API}/releases?per_page=20`,
  )

  if (!Array.isArray(releases)) return []

  return releases.map((release) => ({
    version: release.tag_name ? release.tag_name.replace('v', '') : 'Unknown',
    date: release.published_at
      ? new Date(release.published_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Unknown',
    body: release.body || '',
  }))
}
