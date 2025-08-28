<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/sparklelogo.png';
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
	<link rel="icon" href={favicon} />
	<script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1565760898646999"
		crossorigin="anonymous"
	></script>
	<meta
		property="og:description"
		content="Free, open-source tool to optimize Windows, remove bloatware, and boost your PC's performance. Download now for a faster, cleaner Windows experience."
	/>
	<meta property="og:image" content="/sparklelogo.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Sparkle - Ultimate Windows Optimizer" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Sparkle | Ultimate Windows Optimizer" />
	<meta
		name="twitter:description"
		content="Free, open-source tool to optimize Windows, remove bloatware, and boost your PC's performance. Download now!"
	/>
	<meta name="twitter:image" content="/sparklelogo.png" />

	<meta
		name="description"
		content="Free, open-source tool to optimize Windows, remove bloatware, and boost your PC's performance. Download Sparkle for a faster, cleaner Windows experience."
	/>
	<meta
		name="keywords"
		content="Windows optimizer, PC optimization, remove bloatware, speed up Windows, free PC cleaner, Windows tweaks, system optimization, gaming performance, Windows debloater, free system utility"
	/>
</svelte:head>

<ModeWatcher />
<Nav />
<Toaster />
{@render children?.()}
<Footer />
