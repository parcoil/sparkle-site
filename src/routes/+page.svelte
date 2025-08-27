<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Download, Github } from '@lucide/svelte';
	let version = $state('v2.6.0');
	let downloads = $state('');

	function fetchVersion() {
		fetch('https://api.github.com/repos/parcoil/sparkle/releases/latest')
			.then((res) => res.json())
			.then((data) => {
				version = data.tag_name;
			});
	}

	async function fetchDownloads() {
		const releases = await (await fetch('https://api.github.com/repos/parcoil/sparkle/releases')).json();
		let totalDownloads = 0;
		releases.forEach((release: any) => {
			const version = release.tag_name;
			if (version && version >= "2.0.0") {
				release.assets.forEach((asset: any) => {
					if (asset.name.endsWith(".exe") || asset.name.endsWith(".zip")) {
						totalDownloads += asset.download_count || 0;
					}
				});
			}
		});
		downloads = totalDownloads.toLocaleString('en-US');
	}

	fetchVersion();
	fetchDownloads();
</script>

<svelte:head>
	<title>Sparkle</title>
	<meta name="description" content="Sparkle is a free, open-source Windows optimization tool">
	<meta name="keywords" content="Sparkle, Windows optimizer, debloat Windows, hone, vtrl, uninstall bloatware, optimize Windows, free tool, open source, optimization, optimizer, windows tweaks">
	<meta property="og:title" content="Sparkle | Ultimate Windows Optimizer">
	<meta property="og:description" content="Optimize your Windows PC, remove bloatware">
	<meta property="og:url" content="https://getsparkle.net/">
	<meta property="og:type" content="website">
	<meta property="og:image" content="https://getsparkle.net/assets/sparklelogo.png">
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-screen p-8">
	<div class="flex flex-col items-center justify-center w-full max-w-2xl">
		<img src="/sparklelogo.png" alt="Sparkle Logo" class="w-24 h-24 mb-6 animate-bounce duration-900">
		<h1 class="text-4xl font-bold mb-4">Sparkle</h1>
		<p class="text-lg text-muted-foreground mb-6">The ultimate tool to optimize Windows and boost gaming performance</p>
		<div class="flex items-center justify-center space-x-4 mb-6">
			<p class="text-sm font-medium text-muted-foreground">Latest Version <span class="font-semibold text-primary">{version}</span></p>
			<p class="text-sm font-medium text-muted-foreground">Downloads <span class="font-semibold text-primary">{downloads}</span></p>
		</div>
		<div class="flex space-x-4">
			<Button size="lg"><Download />Download</Button>
			<Button variant="outline" size="lg"><Github />View on GitHub</Button>
		</div>

		<img src="https://raw.githubusercontent.com/Parcoil/Sparkle/refs/heads/v2/images/appshowcase.png" alt="Sparkle Logo" class="w-full mt-6 rounded-md hover:scale-105 transition-all duration-300">
	</div>
</div>
