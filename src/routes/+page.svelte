<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Download,
		Shield,
		Github,
		Network,
		ChevronDown,
		Star,
		Zap,
		Copy,
		Trash2,
		Package,
		Wrench,
		ArrowRight
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Alert, AlertTitle } from '$lib/components/ui/alert';
	import * as Accordion from '$lib/components/ui/accordion';
	import { page } from '$app/stores';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { toast } from 'svelte-sonner';

	let showMovedAlert = $state(false);
	let version = $state('');
	let downloads = $state('');
	let logoKey = $state(0);

	const faqs = [
		{
			question: 'Is Sparkle safe to use?',
			answer:
				'Yes! Sparkle only makes reversible changes. You can create system restore points before applying any tweaks.'
		},
		{
			question: 'Which versions of Windows are supported?',
			answer: 'Sparkle supports Windows 10 and 11.'
		},
		{
			question: 'Can I undo changes made by Sparkle?',
			answer:
				"Yes, all tweaks are reversible. You can either use Sparkle's built-in restore option or a system restore point."
		},
		{
			question: 'Do I need an internet connection to use Sparkle?',
			answer:
				'The auto-updates require an internet connection. Most other features should work offline.'
		},
		{
			question: 'How often is Sparkle updated?',
			answer:
				'Sparkle is actively maintained, with new features, versions and bug fixes released regularly. Check GitHub or here for the latest version.'
		},
		{
			question: 'What should I do if I encounter an error?',
			answer: 'Visit our GitHub Issues page to report bugs or join our Discord server for support.'
		},
		{
			question: 'Why does Sparkle ask for admin permissions?',
			answer:
				'Admin permissions are required to apply system-level tweaks and optimizations and using/creating restore points.'
		},
		{
			question: 'Why am i forced to update sparkle each time i open it?',
			answer:
				'Sparkle automatically checks for updates on launch. If an update is available, it will prompt you to update before continuing. The reason for this is microsoft is changeing windows rapidly and some tweaks may stop working or cause issues if not updated. By enforcing updates, we can ensure users have the best experience and avoid potential bugs from outdated versions.'
		},
		{
			question: 'Why am i seeing ads on the website?',
			answer:
				'To keep Sparkle free and open-source, we rely on ad revenue to cover hosting and development costs. We use non-intrusive ads that do not affect your experience on the site. If you find the ads disruptive, consider supporting us on GitHub or sharing Sparkle with friends!'
		}
	];

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
				'Quickly install your favorite applications using winget or chocolatey without leaving Sparkle.',
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
			new: false,
			categories: ['Performance', 'Networking']
		}
	];

	const installMethods = [
		{
			label: 'PowerShell',
			value: 'powershell',
			code: 'irm https://getsparkle.net/get | iex'
		},
		{
			label: 'Chocolatey',
			value: 'chocolatey',
			code: 'choco install sparkle --version=2.13.0'
		}
	];

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
				`https://github.com/Parcoil/Sparkle/releases/latest/download/sparkle-${version.replace('v', '')}-win.zip`,
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
			const releaseVersion = release.tag_name;
			if (releaseVersion && releaseVersion >= '2.0.0') {
				release.assets.forEach((asset: any) => {
					if (asset.name.endsWith('.exe') || asset.name.endsWith('.zip')) {
						totalDownloads += asset.download_count || 0;
					}
				});
			}
		});
		downloads = totalDownloads.toLocaleString('en-US');
	}

	function copyCommand() {
		const command = 'irm https://getsparkle.net/get | iex';
		navigator.clipboard.writeText(command);
		toast.success('Copied to clipboard');
	}

	function replayLogoAnimation() {
		logoKey++;
	}

	onMount(() => {
		if (browser) {
			const params = new URLSearchParams(window.location.search);
			if (params.get('ref') === 'parcoil-sparkle-page') {
				showMovedAlert = true;
			}
			fetchVersion();
			fetchDownloads();
		}
	});
</script>

<svelte:head>
	<title>Sparkle | Ultimate Windows Optimizer</title>
	<meta
		name="description"
		content="Free, open-source tool to optimize Windows, remove bloatware, and boost your PC's performance. Download Sparkle for a faster, cleaner Windows experience."
	/>
	<meta
		name="keywords"
		content="Windows optimizer, PC optimization, remove bloatware, speed up Windows, free PC cleaner, Windows tweaks, system optimization, gaming performance, Windows debloater, free system utility"
	/>

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://getsparkle.net/" />
	<meta property="og:title" content="Sparkle | Ultimate Windows Optimizer" />
	<meta
		property="og:description"
		content="Free, open-source tool to optimize Windows, remove bloatware, and boost your PC's performance. Download now for a faster, cleaner Windows experience."
	/>
	<meta property="og:image" content="/sparklelogo.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Sparkle - Ultimate Windows Optimizer" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Sparkle | Ultimate Windows Optimizer" />
	<meta
		name="twitter:description"
		content="Free, open-source tool to optimize Windows, remove bloatware, and boost your PC's performance. Download now!"
	/>
	<meta name="twitter:image" content="/sparklelogo.png" />

	<link rel="canonical" href="https://getsparkle.net/" />

	<script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1565760898646999"
		crossorigin="anonymous"
	></script>
</svelte:head>

<div class="mt-10 flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
	<div class="flex w-full max-w-5xl flex-col items-center justify-center">
		{#if $page.url.searchParams.get('ref') === 'parcoil-sparkle-page'}
			<div class="animate-fade-in-up mt-4 mb-6 w-full max-w-md">
				<Alert class="text-center">
					<AlertTitle>Hello Parcoil user, Sparkle has moved to getsparkle.net</AlertTitle>
				</Alert>
			</div>
		{/if}

		<button
			type="button"
			class="animate-float mb-6 cursor-pointer border-none bg-transparent p-0 transition-transform hover:scale-110"
			onclick={replayLogoAnimation}
		>
			<img
				src="/sparklelogo.png"
				alt="Sparkle Logo"
				class="h-20 w-20 sm:h-24 sm:w-24"
				loading="lazy"
			/>
		</button>

		<div class="m-mt-15 mb-4">
			<h1
				class="animate-fade-in-up mb-4 text-center text-4xl font-medium opacity-0 sm:text-5xl md:text-7xl"
				style="animation-delay: 0.1s;"
			>
				Take control of your PC.
			</h1>

			<p
				class="animate-fade-in-up text-center text-base text-muted-foreground opacity-0 sm:text-lg"
				style="animation-delay: 0.2s;"
			>
				Open-Source tool to optimize Windows and boost gaming performance
				<br />
				and enhance privacy.
			</p>
		</div>

		<div
			class="animate-fade-in-up mb-6 flex flex-col items-center space-y-2 text-center opacity-0 sm:flex-row sm:space-y-0 sm:space-x-8 sm:text-left"
			style="animation-delay: 0.3s;"
		>
			<div class="flex items-center space-x-2">
				<p class="text-sm font-medium text-muted-foreground">
					Latest Version
					<span class="font-semibold text-primary">{version || '...'}</span>
				</p>
			</div>
			<div class="flex items-center space-x-2">
				<p class="text-sm font-medium text-muted-foreground">
					Downloads
					<span class="font-semibold text-primary">{downloads || '...'}</span>
				</p>
			</div>
		</div>

		<div
			class="animate-fade-in-up hidden w-full flex-col justify-center space-y-2 opacity-0 sm:flex sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-4"
			style="animation-delay: 0.4s;"
		>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="w-full sm:w-auto">
					<Button class="w-full justify-center sm:w-auto">
						<Download class="mr-2 h-4 w-4" />
						Download
						<ChevronDown class="ml-2 h-4 w-4 opacity-50" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-full sm:w-56" align="start">
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

		<div
			class="mt-4 flex flex-col items-center justify-center space-y-2 px-4 text-center sm:hidden"
		>
			<p class="text-sm font-semibold text-primary">
				Please visit this page on a Windows PC to download Sparkle
			</p>
		</div>

		<!-- <p class="mt-4 text-sm text-muted-foreground select-none">CLI Install:</p>

		<div class="mt-4 w-full max-w-md">
			<CodeTabs tabs={installMethods} class="z-40! w-sm gap-0" />
		</div> -->

		<div class="relative flex w-full max-w-5xl flex-col items-center justify-center">
			<div
				class="animate-fade-in-up absolute inset-0 -z-10 rounded-full bg-primary/30 blur-3xl dark:bg-accent/20"
				style="animation-delay: 0.5s;"
			></div>
			<img
				src="/showcase.png"
				loading="lazy"
				alt="Sparkle Showcase"
				class="animate-fade-in-up relative z-10 mt-6 aspect-video w-full max-w-full rounded-md border-2 border-primary opacity-0 transition-all duration-300 hover:scale-105 sm:max-w-[800px] dark:border-accent"
				style="animation-delay: 0.6s;"
			/>
		</div>

		<section id="features" class="w-full py-12">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="animate-fade-in-up text-center opacity-0">
					<h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">Features</h2>
					<p class="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
						Powerful Tweaks to optimize your Windows experience
					</p>
				</div>

				<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{#each features as feature, i}
						<Card.Root
							class="animate-fade-in-up group relative overflow-hidden opacity-0 transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20"
							style="animation-delay: {0.5 + i * 0.1}s;"
						>
							<Card.Header>
								{@const Icon = feature.icon}
								<div
									class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/40 text-primary transition-transform duration-300 group-hover:rotate-[-10deg]"
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

			<!-- Ad Block 1 -->
			<div class="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
				<ins
					class="adsbygoogle"
					style="display:block"
					data-ad-client="ca-pub-1565760898646999"
					data-ad-slot="3836598101"
					data-ad-format="auto"
					data-full-width-responsive="true"
				></ins>
				<script>
					(adsbygoogle = window.adsbygoogle || []).push({});
				</script>
			</div>

			<section id="faqs" class="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="text-center">
					<h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">FAQs</h2>
					<p class="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
						Frequently Asked Questions
					</p>
				</div>

				<Accordion.Root type="single" class="mt-6 space-y-2">
					{#each faqs as faq}
						<Accordion.Item value={faq.question}>
							<Accordion.Trigger>{faq.question}</Accordion.Trigger>
							<Accordion.Content class="text-muted-foreground">
								{faq.answer}
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</section>

			<!-- Ad Block 2 -->
			<div class="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
				<ins
					class="adsbygoogle"
					style="display:block"
					data-ad-client="ca-pub-1565760898646999"
					data-ad-slot="3836598101"
					data-ad-format="auto"
					data-full-width-responsive="true"
				></ins>
				<script>
					(adsbygoogle = window.adsbygoogle || []).push({});
				</script>
			</div>

			<div
				class="mt-12 w-full rounded-2xl bg-muted py-12 dark:border dark:border-accent dark:bg-muted/20"
			>
				<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div class="text-center">
						<h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
							App Gallery
						</h2>
						<p class="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
							Install apps quickly with Sparkle to make your Windows experience better
						</p>
						<Button
							href="/apps"
							class="mt-6 inline-flex w-full items-center justify-center px-6 py-3 sm:w-auto"
						>
							Browse Apps
							<ArrowRight class="-mr-1 ml-2 h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>

			<!-- Ad Block 3 -->
			<div class="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
				<ins
					class="adsbygoogle"
					style="display:block"
					data-ad-client="ca-pub-1565760898646999"
					data-ad-slot="3836598101"
					data-ad-format="auto"
					data-full-width-responsive="true"
				></ins>
				<script>
					(adsbygoogle = window.adsbygoogle || []).push({});
				</script>
			</div>
		</section>
	</div>
</div>
