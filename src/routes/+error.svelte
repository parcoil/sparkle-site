<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	let version = $state('');
	import { onMount } from 'svelte';
	import { Download, ChevronDown, ExternalLink } from '@lucide/svelte';
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
</script>

<svelte:head>
	<title>Sparkle - 404</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-3.3rem)] flex-col items-center justify-center p-8">
	<div class="flex w-full max-w-2xl flex-col items-center justify-center">
		<img
			src="/sparklelogo.png"
			alt="Sparkle Logo"
			class="mb-6 h-24 w-24 animate-bounce duration-900"
		/>
		<h1 class="mb-4 text-4xl font-bold">Oops!</h1>
		<p class="mb-6 text-lg text-muted-foreground">
			We couldn't find the page you were looking for.
		</p>
		<div class="mb-6 flex space-x-2">
			<Button variant="default" size="lg" href="/">Go Home</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="outline" size="lg">
						Download Sparkle
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
			<Button variant="outline" size="lg" href="https://docs.getsparkle.net"
				><ExternalLink /> Visit Docs</Button
			>
		</div>
	</div>
</div>
