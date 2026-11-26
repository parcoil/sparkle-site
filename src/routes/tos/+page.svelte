<script lang="ts">
	import type { PageData } from './$types';
	import type { InlinePart } from '#lib/tos.ts';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Terms of Service - Sparkle</title>
	<meta name="description" content="The terms of service for downloading and using Sparkle." />
	<link rel="canonical" href="https://getsparkle.net/tos" />
	<meta property="og:url" content="https://getsparkle.net/tos" />
	<meta property="og:title" content="Terms of Service - Sparkle" />
	<meta
		property="og:description"
		content="The terms of service for downloading and using Sparkle."
	/>
	<meta name="twitter:url" content="https://getsparkle.net/tos" />
	<meta name="twitter:title" content="Terms of Service - Sparkle" />
	<meta
		name="twitter:description"
		content="The terms of service for downloading and using Sparkle."
	/>
</svelte:head>

<div class="container mx-auto mt-5 min-h-screen px-4 py-12">
	<div class="mx-auto max-w-3xl">
		<h1
			class="animate-gradient mb-4 bg-linear-to-r from-[#0096ff] to-[#0042ff] bg-clip-text pb-2 text-4xl font-semibold text-transparent sm:text-5xl"
		>
			Terms of Service
		</h1>
		<div class="mt-8 text-foreground/90">
			{#each data.blocks as block, blockIndex (blockIndex)}
				{#if block.type === 'heading'}
					{#if block.level === 2}
						<h2 class="mb-3 mt-8 text-2xl font-bold text-primary">
							{@render inline(block.parts)}
						</h2>
					{:else}
						<h3 class="mb-2 mt-6 text-lg font-semibold">
							{@render inline(block.parts)}
						</h3>
					{/if}
				{:else if block.type === 'paragraph'}
					<p class="mb-4 leading-relaxed">
						{@render inline(block.parts)}
					</p>
				{:else}
					<ul class="my-3 ml-5 list-disc space-y-1">
						{#each block.items as item, itemIndex (itemIndex)}
							<li>{@render inline(item)}</li>
						{/each}
					</ul>
				{/if}
			{/each}
		</div>
	</div>
</div>

{#snippet inline(parts: InlinePart[])}
	{#each parts as part, partIndex (partIndex)}
		{#if part.href}
			<a
				href={part.href}
				target="_blank"
				rel="noopener noreferrer"
				class="font-medium text-primary hover:underline">{part.text}</a
			>
		{:else}
			{part.text}
		{/if}
	{/each}
{/snippet}
