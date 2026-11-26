<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import { ModeWatcher } from 'mode-watcher';
	import Nav from '#lib/components/nav.svelte';
	import Footer from '#lib/components/footer.svelte';
	import MaintenancePage from '#lib/components/maintenance-page.svelte';
	import { fallbackReleaseInfo } from '#lib/releases.ts';
	import { Toaster } from '#lib/components/ui/sonner/index.js';
	import { browser } from '$app/env';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import posthog from 'posthog-js';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	if (browser) {
		beforeNavigate(({ shallow, type }) => {
			if (shallow && type === 'goto') return;

			return posthog.capture('$pageleave');
		});

		afterNavigate(({ shallow, type }) => {
			if (shallow && type === 'goto') return;

			return posthog.capture('$pageview');
		});
	}
</script>

<svelte:head>
	{#if data.maintenance}
		<title>Under Maintenance | Sparkle Debloater</title>
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<title>Sparkle Debloater</title>
	{/if}
	<link rel="icon" href="/sparklelogo.png" />
	<script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1565760898646999"
		crossorigin="anonymous"
	></script>
	<script
		defer
		src="https://umami.parcoil.com/script.js"
		data-website-id="9924bb71-c86f-4f31-8365-b3bf3cc99f88"
	></script>
	<script
		defer
		src="https://umami.parcoil.com/recorder.js"
		data-website-id="9924bb71-c86f-4f31-8365-b3bf3cc99f88"
	></script>
</svelte:head>

<ModeWatcher />

{#if data.maintenance}
	<MaintenancePage />
{:else}
	<Nav releaseInfo={data.releaseInfo ?? fallbackReleaseInfo} />
	<Toaster />
	<div class="min-h-screen pt-16">
		{@render children?.()}
	</div>
	<Footer latestPost={data.latestPost} />
{/if}
