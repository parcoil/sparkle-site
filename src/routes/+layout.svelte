<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { browser } from '$app/environment';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import posthog from 'posthog-js';
	let { children } = $props();

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}
</script>

<svelte:head>
	<link rel="icon" href="/sparklelogo.png" />
	<script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1565760898646999"
		crossorigin="anonymous"
	></script>
	<script defer src="https://umami.parcoil.com/script.js" data-website-id="9924bb71-c86f-4f31-8365-b3bf3cc99f88"></script>
	<script defer src="https://umami.parcoil.com/recorder.js" data-website-id="9924bb71-c86f-4f31-8365-b3bf3cc99f88"></script>
</svelte:head>

<ModeWatcher />
<Nav />
<Toaster />
<div class="min-h-screen pt-16">
	{@render children?.()}
</div>
<Footer />
