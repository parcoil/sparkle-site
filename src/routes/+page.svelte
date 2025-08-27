<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Card from '$lib/components/ui/card';
	import { browser } from '$app/environment';
	import posthog from 'posthog-js';
	import {
		Download,
		Github,
		ChevronDown,
		Star,
		Zap,
		Trash2,
		Shield,
		Package,
		Wrench,
		Network,
		ArrowRight
	} from '@lucide/svelte';

	let version = $state('');
	let downloads = $state('');

	function handleDownload(type: 'exe' | 'zip') {
		if (browser) {
			posthog.capture('sparkle_download_button', {
				download_type: type,
				app_version: version || 'unknown',
				location: 'hero_section'
			});
		}

		if (type === 'exe') {
			window.open(
				`https://github.com/Parcoil/Sparkle/releases/latest/download/sparkle-${version.replace('v', '')}-setup.exe`,
				'_blank'
			);
		} else {
			window.open(
				'https://github.com/Parcoil/Sparkle/releases/latest/download/win-unpacked.zip',
				'_blank'
			);
		}
	}

	function fetchVersion() {
		fetch('https://api.github.com/repos/parcoil/sparkle/releases/latest')
			.then((res) => res.json())
			.then((data) => {
				version = data.tag_name;
			});
	}

	async function fetchDownloads() {
		const releases = await (
			await fetch('https://api.github.com/repos/parcoil/sparkle/releases')
		).json();
		let totalDownloads = 0;
		releases.forEach((release: any) => {
			const version = release.tag_name;
			if (version && version >= '2.0.0') {
				release.assets.forEach((asset: any) => {
					if (asset.name.endsWith('.exe') || asset.name.endsWith('.zip')) {
						totalDownloads += asset.download_count || 0;
					}
				});
			}
		});
		downloads = totalDownloads.toLocaleString('en-US');
	}

	fetchVersion();
	fetchDownloads();

	const features = [
		{
			title: 'Debloat Windows',
			description:
				'Removes unnecessary Windows features and apps to free up resources and improve performance.',
			icon: Star,
			iconColor: 'text-teal-500',
			categories: ['Performance', 'Privacy']
		},
		{
			title: 'System Optimization',
			description: 'Enhance system performance and responsiveness with carefully selected tweaks.',
			icon: Zap,
			iconColor: 'text-pink-500',
			categories: ['Performance']
		},
		{
			title: 'Clean Temporary Files',
			description: 'Remove temporary files, caches, and logs to free up valuable disk space.',
			icon: Trash2,
			iconColor: 'text-yellow-500',
			categories: ['Maintenance']
		},
		{
			title: 'Safe & Reversible',
			description:
				'All changes can be easily undone with system restore points or by reverting settings.',
			icon: Shield,
			iconColor: 'text-red-500',
			categories: ['Security']
		},
		{
			title: 'App Installer',
			description:
				'Quickly install your favorite applications using the built-in winget-powered installer.',
			icon: Package,
			iconColor: 'text-blue-500',
			categories: ['Productivity']
		},
		{
			title: 'System Utilities',
			description:
				'Run essential system tools like SFC, Check Disk, and DISM from a simple, intuitive interface.',
			icon: Wrench,
			iconColor: 'text-green-500',
			categories: ['Maintenance']
		},
		{
			title: 'Network Optimizer',
			description: 'Optimize your network settings and change DNS for improved speed and security.',
			icon: Network,
			iconColor: 'text-purple-500',
			new: true,
			categories: ['Performance', 'Networking']
		}
	];
</script>

<svelte:head>
	<title>Sparkle</title>
	<meta name="description" content="Sparkle is a free, open-source Windows optimization tool" />
	<meta
		name="keywords"
		content="Sparkle, Windows optimizer, debloat Windows, hone, vtrl, uninstall bloatware, optimize Windows, free tool, open source, optimization, optimizer, windows tweaks"
	/>
	<meta property="og:title" content="Sparkle | Ultimate Windows Optimizer" />
	<meta property="og:description" content="Optimize your Windows PC, remove bloatware" />
	<meta property="og:url" content="https://getsparkle.net/" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://getsparkle.net/assets/sparklelogo.png" />
</svelte:head>

<div class="mt-10 flex min-h-screen flex-col items-center justify-center p-25">
	<div class="flex w-full max-w-5xl flex-col items-center justify-center">
		<img src="/sparklelogo.png" alt="Sparkle Logo" class="mb-6 h-24 w-24" />
		<h1
			class="animate-gradient mb-4 bg-gradient-to-r from-[#0096ff] to-[#0042ff] bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
		>
			Sparkle
		</h1>
		<p class="mb-6 text-lg text-muted-foreground">
			The ultimate tool to optimize Windows and boost gaming performance
		</p>
		<div class="mb-6 flex items-center justify-center space-x-4">
			<p class="text-sm font-medium text-muted-foreground">
				Latest Version <span class="font-semibold text-primary">{version}</span>
			</p>
			<p class="text-sm font-medium text-muted-foreground">
				Downloads <span class="font-semibold text-primary">{downloads}</span>
			</p>
		</div>
		<div class="flex space-x-4">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button size="lg">
						<Download class="mr-2 h-4 w-4" />
						Download
						<ChevronDown class="ml-2 h-4 w-4 opacity-50" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56" align="start">
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
			<a href="https://github.com/Parcoil/Sparkle">
				<Button variant="outline" size="lg">
					<Github class="mr-2 h-4 w-4" />
					View on GitHub
				</Button>
			</a>
		</div>

		<img
			src="https://raw.githubusercontent.com/Parcoil/Sparkle/refs/heads/v2/images/appshowcase.png"
			alt="Sparkle Logo"
			class="mt-6 aspect-video w-[800px] rounded-md border-2 border-primary transition-all duration-300 hover:scale-105 dark:border-accent"
		/>

		<div class="w-full py-12">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="text-center">
					<h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Features</h2>
					<p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
						Powerful Tweaks to optimize your Windows experience
					</p>
				</div>

				<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each features as feature}
						<Card.Root
							class="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20"
						>
							<Card.Header>
								{@const Icon = feature.icon}
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/40 text-primary"
								>
									<Icon class="h-6 w-6 {feature.iconColor}" />
								</div>
								<div class="flex items-center gap-2">
									<Card.Title class="text-lg font-semibold">{feature.title}</Card.Title>
									{#if feature.new}
										<span
											class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
										>
											New
										</span>
									{/if}
								</div>
								<Card.Description class="mt-2 text-muted-foreground">
									{feature.description}
								</Card.Description>
								<div class="mt-4 flex flex-wrap gap-2">
									{#each feature.categories as category}
										<span
											class="inline-flex items-center rounded-full bg-accent/50 px-2.5 py-0.5 text-xs font-medium text-accent-foreground"
										>
											{category}
										</span>
									{/each}
								</div>
							</Card.Header>
						</Card.Root>
					{/each}
				</div>
			</div>
			<div
				class="mt-12 w-full rounded-2xl bg-muted py-12 dark:border dark:border-accent dark:bg-muted/20"
			>
				<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div class="text-center">
						<h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
							App Gallery
						</h2>
						<p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
							Install apps quickly with Sparkle to make your Windows experience better
						</p>
						<Button href="/apps" class="mt-6 inline-flex items-center px-6 py-3">
							Browse Apps <ArrowRight class="-mr-1 ml-2 h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
