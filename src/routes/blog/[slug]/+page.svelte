<script lang="ts">
	import type { PageData } from './$types';
	import { Badge } from '$lib/components/ui/badge';
	import {
		formatDate,
		getGithubAvatarUrl,
		getGithubProfileUrl,
		renderMarkdown
	} from '$lib/blog';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.post.title} - Sparkle</title>
	<meta name="description" content={data.post.description} />
	<link rel="canonical" href="https://getsparkle.net/blog/{data.post.slug}" />
	<meta property="og:url" content="https://getsparkle.net/blog/{data.post.slug}" />
	<meta property="og:title" content="{data.post.title} - Sparkle" />
	<meta property="og:description" content={data.post.description} />
	{#if data.post.cover}
		<meta property="og:image" content={data.post.cover} />
	{/if}
	<meta name="twitter:url" content="https://getsparkle.net/blog/{data.post.slug}" />
	<meta name="twitter:title" content="{data.post.title} - Sparkle" />
	<meta name="twitter:description" content={data.post.description} />
	{#if data.post.cover}
		<meta name="twitter:image" content={data.post.cover} />
	{/if}
</svelte:head>

<article class="container mx-auto mt-5 min-h-screen px-4 py-12">
	<div class="mx-auto max-w-3xl">
		{#if data.post.cover}
			<img
				src={data.post.cover}
				alt={data.post.title}
				class="mt-6 aspect-video w-full rounded-xl border object-cover"
			/>
		{/if}

		<h1
			class="animate-gradient mb-4 mt-8 bg-linear-to-r from-[#0096ff] to-[#0042ff] bg-clip-text pb-2 text-4xl font-semibold text-transparent"
		>
			{data.post.title}
		</h1>

		<div class="flex flex-wrap items-center justify-between gap-4">
			<a
				href={getGithubProfileUrl(data.post.author)}
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
			>
				<img
					src={getGithubAvatarUrl(data.post.author)}
					alt="{data.post.author}'s avatar"
					class="h-8 w-8 rounded-full"
				/>
				<span>{data.post.author}</span>
			</a>
			<time datetime={data.post.date} class="text-sm text-muted-foreground">
				{formatDate(data.post.date)}
			</time>
		</div>

		{#if data.post.topics.length > 0}
			<div class="mt-4 flex flex-wrap gap-2">
				{#each data.post.topics as topic (topic)}
					<Badge variant="secondary" class="text-xs">{topic}</Badge>
				{/each}
			</div>
		{/if}

		<div class="mt-8 text-foreground/90">
			{@html renderMarkdown(data.post.content)}
		</div>
	</div>
</article>