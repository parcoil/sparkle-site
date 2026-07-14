<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	interface Tab {
		label: string;
		value: string;
		code: string;
	}

	let { tabs, defaultValue, class: className }: { tabs: Tab[]; defaultValue?: string; class?: string } = $props();

	let copied = $state(false);
	let activeTab = $state(defaultValue || tabs[0]?.value || '');

	let activeCode = $derived(tabs.find((tab) => tab.value === activeTab)?.code || '');

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(activeCode);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			const textarea = document.createElement('textarea');
			textarea.value = activeCode;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}
</script>

<div class={cn('w-full', className)}>
	<div class="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted/50 px-1">
		<div class="flex">
			{#each tabs as tab (tab.value)}
				<button
					class="relative border-b-2 px-4 py-2.5 text-xs font-medium transition-none {activeTab === tab.value
						? 'border-foreground text-foreground'
						: 'border-transparent text-muted-foreground'}"
					onclick={() => (activeTab = tab.value)}
				>
					{tab.label}
				</button>
			{/each}
		</div>
		<button
			onclick={handleCopy}
			class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
			aria-label={copied ? 'Copied' : 'Copy code to clipboard'}
		>
			{#if copied}
				<Check class="size-3.5" />
				<span>Copied</span>
			{:else}
				<Copy class="size-3.5" />
				<span>Copy</span>
			{/if}
		</button>
	</div>
	{#each tabs as tab (tab.value)}
		{#if activeTab === tab.value}
			<div class="mt-0 rounded-b-lg border border-border bg-[hsl(var(--foreground)/0.03)] p-4">
				<pre class="overflow-x-auto"><code class="font-mono text-sm text-foreground">{tab.code}</code></pre>
			</div>
		{/if}
	{/each}
</div>
