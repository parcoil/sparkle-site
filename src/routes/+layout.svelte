<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/sparklelogo.png';
	import { ModeWatcher } from 'mode-watcher';
	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Nav />
{@render children?.()}
<Footer />
