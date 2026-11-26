<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/env';
	import { ArrowRight, Download } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { Alert, AlertTitle } from '#lib/components/ui/alert/index.ts';
	import * as Accordion from '#lib/components/ui/accordion/index.ts';
	import GithubIcon from '#lib/components/githubicon.svelte';
	import ThemedScreenshot from '#lib/components/ThemedScreenshot.svelte';
	import { reveal } from '#lib/actions/in-view.ts';
	import { cn } from '#lib/utils.ts';
	import { fallbackReleaseInfo } from '#lib/releases.ts';
	import posthog from 'posthog-js';

	const releaseInfo = $derived(page.data.releaseInfo ?? fallbackReleaseInfo);

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
			answer: 'The auto-updates require an internet connection. Most other features should work offline.'
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
				"Using Sparkle's Tweaks page you can debloat windows, remove telemetry and more",
			lightSrc: '/pages/sparkle-tweaks-light.png',
			darkSrc: '/pages/sparkle-tweaks-dark.png',
			alt: 'Tweaks page',
			imageFirst: false
		},
		{
			title: 'Useful Utilities',
			description:
				"Using Sparkle's Utilities page you can run system tools like SFC, Check Disk, and DISM from a simple interface.",
			lightSrc: '/pages/sparkle-utilities-light.png',
			darkSrc: '/pages/sparkle-utilities-dark.png',
			alt: 'Utilities page',
			imageFirst: true
		},
		{
			title: 'Clean Temporary Files',
			description:
				"Using Sparkle's Cleaner page you can clean up temporary files, Windows update cache, and logs to free up disk space.",
			lightSrc: '/pages/sparkle-clean-light.png',
			darkSrc: '/pages/sparkle-clean-dark.png',
			alt: 'Cleaner page',
			imageFirst: false
		},
		{
			title: 'Restore Your System',
			description:
				"Using Sparkle's Restore page you can restore your system to a previous state, by either using a system restore point or by reverting applied Tweaks.",
			lightSrc: '/pages/sparkle-backup-light.png',
			darkSrc: '/pages/sparkle-backup-dark.png',
			alt: 'Backup and restore page',
			imageFirst: true
		},
		{
			title: 'DNS Changer',
			description:
				"Using Sparkle's DNS Changer page you can change your system's DNS settings to improve browsing speed and security.",
			lightSrc: '/pages/sparkle-dns-light.png',
			darkSrc: '/pages/sparkle-dns-dark.png',
			alt: 'DNS changer page',
			imageFirst: false
		},
		{
			title: 'Apps Installer',
			description:
				"Using Sparkle's Apps Installer page you can easily install apps using either Winget or Chocolatey.",
			lightSrc: '/pages/sparkle-apps-light.png',
			darkSrc: '/pages/sparkle-apps-dark.png',
			alt: 'Apps installer page',
			imageFirst: true
		}
	];

	function replayLogoAnimation() {
		logoKey++;
	}

	function trackDownload() {
		if (!browser) return;

		posthog.capture('sparkle_download_button', {
			download_type: 'exe',
			app_version: releaseInfo.version || 'unknown',
			location: 'hero_section'
		});
	}
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
</svelte:head>

<div class="mt-10 flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
	<div class="flex w-full max-w-5xl flex-col items-center justify-center">
		{#if page.url.searchParams.get('ref') === 'parcoil-sparkle-page'}
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
			aria-label="Replay Sparkle logo animation"
		>
			{#key logoKey}
				<img
					src="/sparklelogo.png"
					alt="Sparkle Logo"
					class="animate-fade-in-scale h-20 w-20 sm:h-24 sm:w-24"
				/>
			{/key}
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
				style="animation-delay: 0.16s;"
			>
				Open-Source tool to optimize Windows and boost gaming performance
				<br />
				and enhance privacy.
			</p>
		</div>

		<div
			class="animate-fade-in-up mb-6 flex flex-col items-center gap-2 text-center opacity-0 sm:flex-row sm:gap-8 sm:text-left"
			style="animation-delay: 0.22s;"
		>
			<div class="flex items-center gap-2">
				<p class="text-sm font-medium text-muted-foreground">
					Latest Version
					{#key releaseInfo.version}
						<span class="animate-fade-in-scale font-semibold text-primary">
							{releaseInfo.version || '...'}
						</span>
					{/key}
				</p>
			</div>
			<div class="flex items-center gap-2">
				<p class="text-sm font-medium text-muted-foreground">
					Downloads
					{#key releaseInfo.downloads}
						<span class="animate-fade-in-scale font-semibold text-primary">
							{releaseInfo.downloads || '...'}
						</span>
					{/key}
				</p>
			</div>
		</div>

		<div
			class="animate-fade-in-up hidden w-full flex-col justify-center gap-2 opacity-0 sm:flex sm:w-auto sm:flex-row"
			style="animation-delay: 0.3s;"
		>
			<Button
				href={releaseInfo.exeUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="w-full justify-center sm:w-auto"
				onclick={trackDownload}
			>
				<Download class="mr-2 h-4 w-4" />
				Download for Windows
			</Button>
			<Button
				href="https://github.com/Parcoil/Sparkle"
				target="_blank"
				rel="noopener noreferrer"
				variant="outline"
				class="w-full justify-center sm:w-auto"
			>
				<GithubIcon class="mr-2 h-4 w-4" />
				View on GitHub
			</Button>
		</div>

		<div
			class="animate-fade-in-up mt-4 flex flex-col items-center justify-center gap-2 px-4 text-center opacity-0 sm:hidden"
			style="animation-delay: 0.3s;"
		>
			<p class="text-sm font-semibold text-primary">
				Please visit this page on a Windows PC to download Sparkle
			</p>
		</div>

		<p class="animate-fade-in-up mt-4 opacity-0" style="animation-delay: 0.36s;">
			<a
				href="/downloads"
				class="text-sm text-muted-foreground underline transition-colors hover:text-primary"
			>
				View all downloads
			</a>
		</p>

		<div
			class="animate-fade-in-up mt-10 w-full max-w-200 opacity-0"
			style="animation-delay: 0.42s;"
		>
			<ThemedScreenshot
				lightSrc="/sparkle_light.png"
				darkSrc="/sparkle_dark.png"
				alt="Sparkle app showcase"
				width={1382}
				height={761}
				imageClass="rounded-none border-0 shadow-none"
			/>
		</div>

		<section id="features" class="w-full py-12">
			<div use:reveal class="reveal-up text-center">
				<h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">Features</h2>
			</div>

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

			{#each features as feature, i (feature.title)}
				<section
					use:reveal={{ delay: i * 50 }}
					class={cn(
						'mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-12 sm:px-6 md:flex-row lg:px-8',
						feature.imageFirst ? 'reveal-right' : 'reveal-left'
					)}
				>
					{#if feature.imageFirst}
						<div class="w-full md:w-1/2">
							<div
								class="mr-5 transition-transform duration-300 hover:scale-[1.02]"
							>
								<ThemedScreenshot
									lightSrc={feature.lightSrc}
									darkSrc={feature.darkSrc}
									alt={feature.alt}
								/>
							</div>
						</div>
						<div class="w-full md:w-1/2">
							<h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								{feature.title}
							</h2>
							<p class="mt-4 text-base text-muted-foreground sm:text-lg">
								{feature.description}
							</p>
						</div>
					{:else}
						<div class="w-full md:w-1/2">
							<h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
								{feature.title}
							</h2>
							<p class="mt-4 text-base text-muted-foreground sm:text-lg">
								{feature.description}
							</p>
						</div>
						<div class="w-full md:w-1/2">
							<div
								class="mr-5 transition-transform duration-300 hover:scale-[1.02]"
							>
								<ThemedScreenshot
									lightSrc={feature.lightSrc}
									darkSrc={feature.darkSrc}
									alt={feature.alt}
								/>
							</div>
						</div>
					{/if}
				</section>
			{/each}

			<section id="faqs" class="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
				<div use:reveal class="reveal-up text-center">
					<h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">FAQs</h2>
					<p class="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
						Frequently Asked Questions
					</p>
				</div>

				<Accordion.Root type="single" class="mt-6 space-y-2">
					{#each faqs as faq, i (faq.question)}
						<div use:reveal={{ delay: i * 30 }} class="reveal-up">
							<Accordion.Item value={faq.question}>
								<Accordion.Trigger>{faq.question}</Accordion.Trigger>
								<Accordion.Content class="text-muted-foreground">
									{faq.answer}
								</Accordion.Content>
							</Accordion.Item>
						</div>
					{/each}
				</Accordion.Root>
			</section>

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
				use:reveal
				class="reveal-up mt-12 w-full rounded-2xl bg-muted py-12 dark:border dark:border-accent dark:bg-muted/20"
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
