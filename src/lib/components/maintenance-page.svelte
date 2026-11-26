<script lang="ts">
	import { Download, ExternalLink } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import GithubIcon from '#lib/components/githubicon.svelte';

	const GITHUB_REPO = 'https://github.com/Parcoil/Sparkle';
	const GITHUB_RELEASES = `${GITHUB_REPO}/releases/latest`;
</script>

<main class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
	<div class="flex w-full max-w-xl flex-col items-center text-center">
		<img src="/sparklelogo.png" alt="Sparkle Logo" class="mb-6 size-24" />

		<h1 class="text-4xl font-bold tracking-tight sm:text-5xl">We'll be right back</h1>
		<p class="mt-4 text-base text-muted-foreground sm:text-lg">
			The Sparkle website is temporarily under maintenance. In the meantime, you can get the latest
			version straight from GitHub.
		</p>

		<div class="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
			<Button href={GITHUB_RELEASES} target="_blank" rel="noopener noreferrer" size="lg">
				<Download />
				Download from GitHub
				<ExternalLink class="opacity-60" />
			</Button>
			<Button
				href={GITHUB_REPO}
				target="_blank"
				rel="noopener noreferrer"
				variant="outline"
				size="lg"
			>
				<GithubIcon />
				View repository
			</Button>
		</div>
	</div>
</main>
