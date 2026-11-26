<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';

	interface Props {
		label: string;
		href: string;
		external?: boolean;
		plain?: boolean;
	}

	let { label, href, external, plain }: Props = $props();

	const isExternal = $derived(external ?? /^https?:\/\//.test(href));
	const isMailto = $derived(href.startsWith('mailto:'));
	const showExternalIcon = $derived(isExternal && !plain);

	const className =
		'inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary';
</script>

<a
	{href}
	target={isExternal && !isMailto ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
	class={className}
>
	{label}
	{#if showExternalIcon}
		<ExternalLink class="size-3" aria-hidden="true" />
	{/if}
</a>
