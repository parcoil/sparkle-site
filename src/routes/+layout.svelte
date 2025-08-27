<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/sparklelogo.png';
	import { ModeWatcher } from 'mode-watcher';
	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { browser } from '$app/environment';
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
</svelte:head>

<ModeWatcher />
<Nav />
{@render children?.()}
<Footer />
