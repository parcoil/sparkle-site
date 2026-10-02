<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import posthog from 'posthog-js';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		Menu,
		X,
		Download,
		ChevronDown,
		ExternalLink
	} from '@lucide/svelte';
	import ModeToggle from './modetoggle.svelte';
	import Discord from './Discord.svelte';
	import GithubIcon from './githubicon.svelte';

	let mobileMenuOpen = $state(false);
	let version = $state('');

	const navItems = [
		{ name: 'Debloat Script', href: '/debloat' },
		{ name: 'Apps', href: '/apps' },
		{ name: 'Downloads', href: '/downloads' },
		{ name: 'Patch Notes', href: '/patch-notes' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'Docs', href: 'https://docs.getsparkle.net' }
	];

	onMount(async () => {
		try {
			const response = await fetch('https://api.github.com/repos/parcoil/sparkle/releases/latest');
			const data = await response.json();
			version = data.tag_name;
		} catch (error) {
			console.error('Failed to fetch version:', error);
		}
	});

	function handleDownload(type: 'exe' | 'zip') {
		if (browser) {
			posthog.capture('sparkle_download_button', {
				download_type: type,
				app_version: version || 'unknown'
			});
		}

		if (type === 'exe') {
			window.open(
				`https://github.com/Parcoil/Sparkle/releases/latest/download/sparkle-${version.replace('v', '')}-setup.exe`,
				'_blank'
			);
		} else {
			window.open(
				`https://github.com/Parcoil/Sparkle/releases/latest/download/sparkle-${version.replace('v', '')}-win.zip`,
				'_blank'
			);
		}
	}
</script>

<header
	class="fixed top-4 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 rounded-2xl border bg-background/80 px-4 shadow-lg backdrop-blur-md transition-all duration-300 sm:px-6 lg:px-8"
>
	<nav aria-label="Top">
		<div class="flex h-16 items-center">
			<a href="/" class="flex shrink-0 items-center space-x-2">
				<img src="/sparklelogo.png" alt="Sparkle Logo" class="h-8 w-auto" />
				<span
					class="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent"
				>
					Sparkle
				</span>
			</a>

			<div class="ml-8 hidden items-center space-x-6 md:flex">
				{#each navItems as item (item.name)}
					{@const isExternalLink = !item.href.startsWith('/')}
					<a
						href={item.href}
						target={isExternalLink ? '_blank' : undefined}
						rel={isExternalLink ? 'noopener noreferrer' : undefined}
						class="flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
					>
						<span>{item.name}</span>
						{#if isExternalLink}
							<ExternalLink class="h-3.5 w-3.5" />
						{/if}
					</a>
				{/each}
			</div>

			<div class="ml-auto flex shrink-0 items-center space-x-2">
				<a
					href="https://dsc.gg/parcoil"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
					aria-label="Discord Server"
				>
					<Discord class="h-5 w-5" />
				</a>
				<a
					href="https://github.com/Parcoil/Sparkle"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
					aria-label="GitHub repository"
				>
					<GithubIcon class="h-5 w-5" />
				</a>
				<ModeToggle />
				<div class="hidden md:block">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button>
							<Download class="mr-2 h-4 w-4" />
							Download
							<ChevronDown class="ml-2 h-4 w-4 opacity-50" />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-48" align="end">
						<DropdownMenu.Group>
							<DropdownMenu.Item onSelect={() => handleDownload('exe')}>
								<Download class="mr-2 h-4 w-4" />
								<span>Installer (.exe)</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onSelect={() => handleDownload('zip')}>
								<Download class="mr-2 h-4 w-4" />
								<span>Portable (.zip)</span>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
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
					<a
						href={item.href}
						class="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-accent/50 hover:text-foreground"
						onclick={() => (mobileMenuOpen = false)}
					>
						{item.name}
					</a>
				{/each}
				<div class="space-y-2 px-3 py-2">
					<div class="flex items-center justify-between px-3 py-2">
						<span class="text-sm font-medium">GitHub</span>
						<a
							href="https://github.com/Parcoil/Sparkle"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
							aria-label="GitHub repository"
						>
							<GithubIcon class="h-5 w-5" />
						</a>
					</div>
					<div class="flex items-center justify-between px-3 py-2">
						<span class="text-sm font-medium">Theme</span>
						<ModeToggle />
					</div>
				</div>
			</div>
		</div>
	{/if}
</header>
