const REPO = 'Parcoil/Sparkle'

export type ReleaseInfo = {
  version: string
  downloads: string
  exeUrl: string
  zipUrl: string
}

export type GitHubAsset = {
  name: string
  browser_download_url: string
  download_count: number
}

export type GitHubRelease = {
  tag_name?: string
  published_at?: string
  body?: string
  assets?: GitHubAsset[]
}

export const fallbackReleaseInfo: ReleaseInfo = {
  version: '',
  downloads: '',
  exeUrl: `https://github.com/${REPO}/releases/latest`,
  zipUrl: `https://github.com/${REPO}/releases/latest`,
}

export function buildAssetUrl(version: string, suffix: string) {
  const cleanVersion = version.replace(/^v/, '')
  return `https://github.com/${REPO}/releases/latest/download/sparkle-${cleanVersion}-${suffix}`
}

export function countDownloads(releases: GitHubRelease[]) {
  return releases.reduce((total, release) => {
    if (!release.tag_name || release.tag_name < '2.0.0') return total

    return (release.assets ?? []).reduce((sum, asset) => {
      const isDownloadable =
        asset.name.endsWith('.exe') || asset.name.endsWith('.zip')
      return isDownloadable ? sum + (asset.download_count ?? 0) : sum
    }, total)
  }, 0)
}
