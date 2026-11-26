<script lang="ts">
	import { cn } from '#lib/utils.ts';

	interface Props {
		lightSrc: string;
		darkSrc?: string;
		alt: string;
		width?: number;
		height?: number;
		class?: string;
		imageClass?: string;
		bloom?: boolean;
	}

	let {
		lightSrc,
		darkSrc,
		alt,
		width = 1380,
		height = 760,
		class: className,
		imageClass,
		bloom = true
	}: Props = $props();
</script>

<div class={cn('relative isolate', className)}>
	{#if bloom}
		<div
			aria-hidden="true"
			class="absolute -inset-4 -z-10 overflow-hidden rounded-3xl bg-linear-to-br from-sky-100 via-blue-200 to-blue-400 sm:-inset-8 dark:from-[#040d20] dark:via-[#0a2350] dark:to-[#123a78]"
		>
			<div
				class="absolute -top-1/4 left-[8%] h-64 w-72 -rotate-[18deg] rounded-[45%_55%_60%_40%] bg-sky-300/80 blur-[70px] sm:h-80 sm:w-96 dark:bg-blue-500/45"
			></div>
			<div
				class="absolute right-[4%] top-[6%] h-64 w-72 rotate-12 rounded-[55%_45%_40%_60%] bg-indigo-300/60 blur-[80px] sm:h-80 sm:w-96 dark:bg-indigo-500/35"
			></div>
			<div
				class="absolute -bottom-1/3 left-[30%] h-64 w-[60%] rounded-full bg-cyan-200/70 blur-[80px] sm:h-80 dark:bg-cyan-400/25"
			></div>
			<div
				class="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-[60px] dark:bg-sky-300/20"
			></div>
		</div>
	{/if}

	<div
		class={cn(
			'relative z-10 overflow-hidden rounded-md border-2 border-primary shadow-lg transition-all duration-300 dark:border-accent',
			imageClass
		)}
	>
		{#if darkSrc}
			<img
				src={lightSrc}
				alt={`${alt} in light mode`}
				{width}
				{height}
				loading="lazy"
				class="dark:hidden h-auto w-full"
			/>
			<img
				src={darkSrc}
				alt={`${alt} in dark mode`}
				{width}
				{height}
				loading="lazy"
				class="hidden h-auto w-full dark:block"
			/>
		{:else}
			<img src={lightSrc} {alt} {width} {height} loading="lazy" class="h-auto w-full" />
		{/if}
	</div>
</div>
