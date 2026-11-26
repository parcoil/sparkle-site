<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/env';
	import { Download } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import * as Card from '#lib/components/ui/card/index.ts';
	import { Badge } from '#lib/components/ui/badge/index.ts';
	import CodeTabs from '#lib/components/code-tabs.svelte';
	import GithubIcon from '#lib/components/githubicon.svelte';
	import { fallbackReleaseInfo } from '#lib/releases.ts';
	import posthog from 'posthog-js';

	const releaseInfo = $derived(page.data.releaseInfo ?? fallbackReleaseInfo);
	const version = $derived(releaseInfo.version);
	const downloads = $derived(releaseInfo.downloads);

	function handleDownload(type: 'exe' | 'zip') {
		if (browser) {
			posthog.capture('sparkle_download_button', {
				download_type: type,
				app_version: version || 'unknown',
				location: 'downloads_page'
			});
		}

		window.open(type === 'exe' ? releaseInfo.exeUrl : releaseInfo.zipUrl, '_blank', 'noopener,noreferrer');
	}

	const installMethods = [
		{
			label: 'PowerShell',
			value: 'powershell',
			code: 'irm https://getsparkle.net/get | iex'
		},
		{
			label: 'Chocolatey',
			value: 'chocolatey',
			code: `choco install sparkle`
		},
		{
			label: 'Scoop',
			value: 'scoop',
			code: 'scoop bucket add sparkle https://github.com/thedogecraft/sparkle && scoop install sparkle'
		}
	];
</script>

<svelte:head>
	<title>Downloads - Sparkle</title>
	<meta name="description" content="All the ways to get Sparkle on your PC." />
	<link rel="canonical" href="https://getsparkle.net/downloads" />
	<meta property="og:url" content="https://getsparkle.net/downloads" />
	<meta property="og:title" content="Downloads - Sparkle" />
	<meta property="og:description" content="All the ways to get Sparkle on your PC." />
	<meta name="twitter:url" content="https://getsparkle.net/downloads" />
	<meta name="twitter:title" content="Downloads - Sparkle" />
	<meta name="twitter:description" content="All the ways to get Sparkle on your PC." />
</svelte:head>

<div class="container mx-auto mt-5 min-h-screen px-4 py-12">
	<div class="mx-auto max-w-3xl">
		<div class="mb-12 text-center">
			<h1
				class="animate-gradient mb-4 bg-linear-to-r from-[#0096ff] to-[#0042ff] bg-clip-text pb-2 text-4xl font-bold text-transparent sm:text-5xl"
			>
				Download Sparkle
			</h1>
			<p class="text-lg text-muted-foreground">All the ways to get Sparkle on your PC.</p>
			{#if version}
				<div class="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
					<span>
						Latest: <Badge variant="default" class="ml-1">{version}</Badge>
					</span>
					{#if downloads}
						<span>
							Downloads: <span class="font-semibold text-primary">{downloads}</span>
						</span>
					{/if}
				</div>
			{/if}
		</div>

		<div class="space-y-8">
			<section>
				<h2 class="mb-4 text-2xl font-bold tracking-tight text-foreground">
					Direct Download
				</h2>
				<p class="mb-6 text-muted-foreground">
					Download the latest version directly from GitHub. Choose between the installer or
					portable zip.
				</p>
				<div class="grid gap-4 sm:grid-cols-2">
					<Card.Root
						class="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20"
					>
						<Card.Header>
							<Card.Title class="text-base font-semibold">Installer (.exe)</Card.Title>
							<Card.Description class="mt-2 text-xs text-muted-foreground">
								Recommended for most users. Guides you through installation with setup
								options.
							</Card.Description>
							<Button
								class="mt-4 w-full"
								onclick={() => handleDownload('exe')}
								disabled={!version}
							>
								<Download class="h-4 w-4" />
								Download .exe
							</Button>
						</Card.Header>
					</Card.Root>

					<Card.Root
						class="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20"
					>
						<Card.Header>
							<Card.Title class="text-base font-semibold">Portable (.zip)</Card.Title>
							<Card.Description class="mt-2 text-xs text-muted-foreground">
								No installation required, Extract and run anywhere
								<br />
								<br />
							</Card.Description>
							<Button
								variant="outline"
								class="mt-4 w-full"
								onclick={() => handleDownload('zip')}
								disabled={!version}
							>
								<Download class="h-4 w-4" />
								Download .zip
							</Button>
						</Card.Header>
					</Card.Root>
				</div>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold tracking-tight text-foreground">
					Package Managers
				</h2>
				<p class="mb-6 text-muted-foreground">
					Install and update Sparkle from the command line using your favorite package
					manager.
				</p>
				<CodeTabs tabs={installMethods} />

				<h3 class="mt-4 text-2xl font-bold tracking-tight text-foreground">Scoop</h3>
				<p class="mt-6 mb-6 text-muted-foreground">
					If you already have the sparkle scoop bucket added, you can install Sparkle with the
					following command:
				</p>
				<CodeTabs
					tabs={[
						{
							label: 'Scoop',
							value: 'scoop',
							code: 'scoop install sparkle'
						}
					]}
				/>
			</section>

			<section>
				<h2 class="mb-4 text-2xl font-bold tracking-tight text-foreground">
					Build from Source
				</h2>
				<p class="mb-6 text-muted-foreground">
					Want to contribute or customize Sparkle? Clone the repo and build it yourself.
				</p>
				<Card.Root
					class="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20"
				>
					<Card.Header>
						<Card.Title class="text-base font-semibold">GitHub Repository</Card.Title>
						<Card.Description class="mt-2 text-xs text-muted-foreground">
							Browse the source code, report issues, or submit pull requests.
						</Card.Description>
						<div class="mt-4 flex flex-col gap-2 sm:flex-row">
							<Button
								href="https://github.com/Parcoil/Sparkle"
								target="_blank"
								rel="noopener noreferrer"
								variant="outline"
								class="w-full sm:w-auto"
							>
								<GithubIcon class="h-4 w-4" />
								View Source
							</Button>
						</div>
					</Card.Header>
				</Card.Root>
			</section>
		</div>
	</div>
</div>
