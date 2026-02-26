<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';

	let { data }: { data: PageData } = $props();

	function parseMarkdown(text: string): string {
		if (!text) return '';

		let html = text
			.replace(/^### (.*$)/gm, '<h4 class="text-base font-semibold mt-4 mb-2">$1</h4>')
			.replace(/^## (.*$)/gm, '<h3 class="text-lg font-semibold mt-5 mb-2">$1</h3>')
			.replace(/^# (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
			.replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
			.replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/\*(.*?)\*/g, '<em>$1</em>')
			.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
			.replace(/\n\n/g, '</p><p class="mb-3">')
			.replace(/\n(?=<li)/g, '\n');

		html = '<p class="mb-3">' + html + '</p>';

		html = html.replace(
			/<li class="ml-4 list-disc">/g,
			'<ul class="my-2 ml-4 list-disc space-y-1"><li>'
		);
		html = html.replace(/<\/li>\n<li class="ml-4 list-disc">/g, '</li><li>');
		html = html.replace(/<\/li>(?=[^<])/g, '</li></ul>');

		return html;
	}
</script>

<svelte:head>
	<title>Patch Notes - Sparkle</title>
	<meta
		name="description"
		content="View the latest updates, new features, and bug fixes for Sparkle."
	/>
	<link rel="canonical" href="https://getsparkle.net/patch-notes" />
	<meta property="og:url" content="https://getsparkle.net/patch-notes" />
	<meta property="og:title" content="Patch Notes - Sparkle" />
	<meta
		property="og:description"
		content="View the latest updates, new features, and bug fixes for Sparkle."
	/>
	<meta name="twitter:url" content="https://getsparkle.net/patch-notes" />
	<meta name="twitter:title" content="Patch Notes - Sparkle" />
	<meta
		name="twitter:description"
		content="View the latest updates, new features, and bug fixes for Sparkle."
	/>
</svelte:head>

<div class="container mx-auto mt-20 min-h-screen px-4 py-12">
	<div class="mx-auto max-w-3xl">
		<div class="mb-12 text-center">
			<h1
				class="animate-gradient mb-4 bg-gradient-to-r from-[#0096ff] to-[#0042ff] bg-clip-text pb-2 text-4xl font-bold text-transparent sm:text-5xl"
			>
				Patch Notes
			</h1>
			<p class="text-lg text-muted-foreground">
				Stay up to date with the latest features, bug fixes, and improvements.
			</p>
		</div>

		{#if data.error}
			<div class="text-center text-muted-foreground">
				<p>Failed to load patch notes. Please try again later.</p>
			</div>
		{:else}
			<div class="space-y-8">
				{#each data.releases as patch}
					<Card.Root class="gap-0 overflow-hidden">
						<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-4">
							<div class="flex items-center gap-3">
								<Badge variant="default" class="text-sm">
									v{patch.version}
								</Badge>
								<span class="text-sm text-muted-foreground">{patch.date}</span>
							</div>
						</Card.Header>
						<Card.Content>
							{#if patch.body}
								<div class="text-foreground/90">
									{@html parseMarkdown(patch.body)}
								</div>
							{:else}
								<p class="text-sm text-muted-foreground">No release notes available.</p>
							{/if}
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		{/if}
	</div>
</div>
