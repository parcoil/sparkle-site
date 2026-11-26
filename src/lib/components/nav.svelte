<script lang="ts">
	import { page } from '$app/state';
	import { Download, ExternalLink, Menu, Star, X } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { cn } from '#lib/utils.ts';
	import { formatStars, type ReleaseInfo } from '#lib/releases.ts';
	import Discord from './Discord.svelte';
	import GithubIcon from './githubicon.svelte';
	import ModeToggle from './modetoggle.svelte';

	interface Props {
		releaseInfo: ReleaseInfo;
	}

	let { releaseInfo }: Props = $props();

	let mobileMenuOpen = $state(false);

	const navItems = [
		{ name: 'Debloat Script', href: '/debloat' },
		{ name: 'Apps', href: '/apps' },
		{ name: 'Downloads', href: '/downloads' },
		{ name: 'Patch Notes', href: '/patch-notes' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'Docs', href: 'https://docs.getsparkle.net' }
	];

	const pathname = $derived(page.url.pathname);
	const stars = $derived(releaseInfo.stars);

	function isActive(href: string) {
		return href.startsWith('/') && (pathname === href || pathname.startsWith(`${href}/`));
	}

	function isExternalLink(href: string) {
		return !href.startsWith('/');
	}
</script>

<header
	class="fixed top-4 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 rounded-2xl border bg-background/80 px-3 shadow-lg backdrop-blur-md transition-all duration-300 sm:px-4 lg:px-5"
>
	<nav aria-label="Top">
		<div class="flex h-14 items-center">
			<a href="/" class="flex shrink-0 items-center gap-2">
				<img src="/sparklelogo.png" alt="Sparkle Logo" class="h-8 w-auto" />
				<span
					class="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent"
				>
					Sparkle
				</span>
			</a>

			<div class="ml-6 hidden items-center gap-4 md:flex">
				{#each navItems as item (item.name)}
					{@const external = isExternalLink(item.href)}
					{@const active = isActive(item.href)}
					<a
						href={item.href}
						target={external ? '_blank' : undefined}
						rel={external ? 'noopener noreferrer' : undefined}
						aria-current={active ? 'page' : undefined}
						class={cn(
							'relative flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary',
							active ? 'text-primary' : 'text-foreground/80'
						)}
					>
						<span>{item.name}</span>
						{#if external}
							<ExternalLink class="h-3.5 w-3.5" />
						{/if}
						{#if active}
							<span
								class="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary transition-all duration-300"
							></span>
						{/if}
					</a>
				{/each}
			</div>

			<div class="ml-auto flex shrink-0 items-center gap-2">
				<Button
					href="https://dsc.gg/parcoil"
					target="_blank"
					rel="noopener noreferrer"
					variant="outline"
					aria-label="Discord Server"
				>
					<Discord class="h-5 w-5" /> Discord
				</Button>
				<Button
					href="https://github.com/Parcoil/Sparkle"
					target="_blank"
					rel="noopener noreferrer"
					variant="outline"
					aria-label={stars !== null
						? `GitHub repository, ${stars.toLocaleString('en-US')} stars`
						: 'GitHub repository'}
				>
					<GithubIcon class="h-5 w-5" /> Github
					{#if stars !== null}
						<Star class="h-4 w-4 fill-current text-yellow-500" />
						<span class="text-xs font-medium tabular-nums text-muted-foreground">
							{formatStars(stars)}
						</span>
					{/if}
				</Button>
				<ModeToggle />
				<div class="hidden md:block">
					<Button href="/downloads">
						<Download class="mr-2 h-4 w-4" />
						Download
					</Button>
				</div>
			</div>

			<div class="ml-2 shrink-0 md:hidden">
				<button
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					class="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:text-foreground focus:outline-none"
				>
					<span class="sr-only">Open main menu</span>
					{#if mobileMenuOpen}
						<X class="block h-6 w-6" />
					{:else}
						<Menu class="block h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>
	</nav>

	{#if mobileMenuOpen}
		<div class="border-t bg-background/95 backdrop-blur-lg md:hidden">
			<div class="space-y-1 px-2 pt-2 pb-3">
				{#each navItems as item (item.name)}
					{@const external = isExternalLink(item.href)}
					{@const active = isActive(item.href)}
					<a
						href={item.href}
						target={external ? '_blank' : undefined}
						rel={external ? 'noopener noreferrer' : undefined}
						aria-current={active ? 'page' : undefined}
						class={cn(
							'block rounded-md px-3 py-2 text-base font-medium hover:bg-accent/50',
							active
								? 'bg-accent/50 text-primary'
								: 'text-foreground/80 hover:text-foreground'
						)}
						onclick={() => (mobileMenuOpen = false)}
					>
						{item.name}
					</a>
				{/each}
				<div class="space-y-2 px-3 py-2">
					<div class="flex items-center justify-between px-3 py-2">
						<span class="text-sm font-medium">
							GitHub
							{#if stars !== null}
								<span class="ml-2 text-xs font-medium tabular-nums text-muted-foreground">
									{stars.toLocaleString('en-US')}
								</span>
							{/if}
						</span>
						<a
							href="https://github.com/Parcoil/Sparkle"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
							aria-label={stars !== null
								? `GitHub repository, ${stars.toLocaleString('en-US')} stars`
								: 'GitHub repository'}
						>
							<GithubIcon class="h-5 w-5" />
						</a>
					</div>
					<div class="flex items-center justify-between px-3 py-2">
						<span class="text-sm font-medium">Theme</span>
						<ModeToggle />
					</div>
					<p class="text-center text-sm text-primary">Visit on desktop to download Sparkle</p>
				</div>
			</div>
		</div>
	{/if}
</header>
