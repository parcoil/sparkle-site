<script lang="ts">
	import AppGallery from '$lib/components/AppGallery.svelte';
</script>

<svelte:head>
	<title>Apps - Sparkle</title>
	<meta
		name="description"
		content="Browse and install optimized applications for Windows with Sparkle. Enhance your PC's performance with our curated collection of tools and software."
	/>
	<meta
		name="keywords"
		content="Sparkle apps, Windows applications, optimized software, PC tools, performance apps, Windows optimization, free software, best Windows apps"
	/>

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://getsparkle.net/apps" />
	<meta property="og:title" content="Apps - Sparkle" />
	<meta
		property="og:description"
		content="Browse and install optimized applications for Windows with Sparkle. Enhance your PC's performance with our curated collection."
	/>
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Sparkle - Apps - Install Applications" />
	<meta property="twitter:url" content="https://getsparkle.net/apps" />
	<meta property="twitter:title" content="Apps - Sparkle" />
	<meta
		property="twitter:description"
		content="Browse and install optimized applications for Windows with Sparkle. Enhance your PC's performance."
	/>
	<link rel="canonical" href="https://getsparkle.net/apps" />
</svelte:head>

<div class="min-h-screen bg-background">
	<div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
		<AppGallery />
	</div>
</div>
