<script lang="ts">
	import { Copy, Info } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';

	const command = 'irm https://getsparkle.net/debloatscript | iex';

	function copyCommand() {
		if (browser) {
			navigator.clipboard.writeText(command);
			toast.success('Copied to clipboard');
		} else {
			toast.error('Copy to clipboard Failed Please Copy Manually');
		}
	}
</script>

<svelte:head>
	<title>Debloat - Sparkle</title>
	<meta
		name="description"
		content="Use this one-line PowerShell script to debloat your PC without installing Sparkle."
	/>
	<link rel="canonical" href="https://getsparkle.net/debloat" />
	<meta
		name="description"
		content="Use this one-line PowerShell script to debloat your PC without installing Sparkle."
	/>
</svelte:head>

<div class="mt-20 flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
	<div class="flex w-full max-w-3xl flex-col items-center text-center">
		<h1
			class="animate-gradient mb-4 bg-gradient-to-r from-[#0096ff] to-[#0042ff] bg-clip-text pb-2 text-3xl font-bold text-transparent sm:text-4xl md:text-5xl line-height-12"
		>
			Debloat your PC without installing Sparkle
		</h1>

		<p class="mb-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
			If you want to debloat your PC without installing Sparkle, run the following PowerShell
			command:
		</p>

		<div class="group relative mt-2 flex w-full max-w-xl">
			<button
				class="flex w-full items-center justify-between gap-3 rounded-md border border-primary bg-background px-3 py-2 font-mono text-sm text-foreground shadow-sm transition-colors hover:bg-muted/40 dark:border-accent"
				onclick={copyCommand}
				aria-label="Copy command"
			>
				<span>{command}</span>
				<Copy class="h-4 w-4 opacity-80" />
			</button>
			<span
				class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
			>
				Click to copy PowerShell command
			</span>
		</div>

		<div
			class="mt-6 flex items-start gap-2 rounded-md bg-muted p-3 text-left text-sm text-muted-foreground drop-shadow-sm dark:border dark:border-accent dark:bg-muted/40 dark:drop-shadow-none"
		>
			<Info class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
			<p>
				Open Windows PowerShell as Administrator and paste the command. You can review the script
				anytime at <a class=" text-primary" href="https://github.com/Parcoil/Sparkle/blob/main/debloatscript.ps1" target="_blank">
					GitHub
				</a>
			</p>
			
		</div>
		<p class="mt-2 text-sm text-muted-foreground">
			Sparkle v2.9.0+ debloats your PC with the same script
		</p>
		<img
			src="/sparkledebloat.png"
			alt="Sparkle Debloat Tool"
			class="mt-6 w-sm max-w-full rounded-md border-2 border-primary transition-all duration-300 hover:scale-105 sm:max-w-[800px] dark:border-accent"
		/>
		<p class="mt-4 text-sm text-muted-foreground">
			This image may not be up to date.
		</p>
	</div>
</div>
