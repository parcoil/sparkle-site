<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { formatDate, getGithubAvatarUrl, getGithubProfileUrl } from '$lib/blog';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Blog - Sparkle</title>
	<meta name="description" content="News, updates, and articles about Sparkle." />
	<link rel="canonical" href="https://getsparkle.net/blog" />
	<meta property="og:url" content="https://getsparkle.net/blog" />
	<meta property="og:title" content="Blog - Sparkle" />
	<meta property="og:description" content="News, updates, and articles about Sparkle." />
	<meta name="twitter:url" content="https://getsparkle.net/blog" />
	<meta name="twitter:title" content="Blog - Sparkle" />
	<meta name="twitter:description" content="News, updates, and articles about Sparkle." />
</svelte:head>

<div class="container mx-auto mt-5 min-h-screen px-4 py-12">
	<div class="mx-auto max-w-3xl">
		<div class="mb-12 text-center">
			<h1
				class="animate-gradient mb-4 bg-linear-to-r from-[#0096ff] to-[#0042ff] bg-clip-text pb-2 text-4xl font-bold text-transparent sm:text-5xl"
			>
				Blog
			</h1>
			<p class="text-lg text-muted-foreground">
				News, updates, and articles about Sparkle.
			</p>
		</div>

		<div class="space-y-8">
			{#each data.posts as post (post.slug)}
				<Card.Root
					class="group overflow-hidden p-0 transition-shadow hover:shadow-md"
				>
					{#if post.cover}
						<a href="/blog/{post.slug}" aria-label={post.title}>
							<img
								src={post.cover}
								alt={post.title}
								loading="lazy"
								class="aspect-video w-full border-b object-cover"
							/>
						</a>
					{/if}
					<Card.Content class="py-6">
						{#if post.topics.length > 0}
							<div class="mb-3 flex flex-wrap gap-2">
								{#each post.topics as topic (topic)}
									<Badge variant="secondary" class="text-xs">{topic}</Badge>
								{/each}
							</div>
						{/if}
						<h2 class="mb-1 text-xl font-semibold sm:text-2xl">
							<a
								href="/blog/{post.slug}"
								class="transition-colors group-hover:text-primary"
							>
								{post.title}
							</a>
						</h2>
						<p class="text-muted-foreground">{post.description}</p>
						<div class="mt-4 flex items-center justify-between gap-4">
							<a
								href={getGithubProfileUrl(post.author)}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
							>
								<img
									src={getGithubAvatarUrl(post.author)}
									alt="{post.author}'s avatar"
									loading="lazy"
									class="h-6 w-6 rounded-full"
								/>
								<span>{post.author}</span>
							</a>
							<time datetime={post.date} class="text-sm text-muted-foreground">
								{formatDate(post.date)}
							</time>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
</div>