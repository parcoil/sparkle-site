<script lang="ts">
	import commit from '$lib/commit';
</script>

<footer
	class="flex w-full items-center justify-center gap-2 bg-primary/10 p-4 text-center text-sm text-muted-foreground dark:bg-accent/10"
>
	<p>a <a href="https://parcoil.com" class="text-primary hover:underline">parcoil</a> site</p>
	<a href="mailto:info@parcoil.com" class="text-primary hover:underline">info@parcoil.com</a>
	<span class="text-xs opacity-50">• {commit}</span>
</footer>
