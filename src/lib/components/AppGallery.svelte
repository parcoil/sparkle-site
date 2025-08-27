<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, X } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let apps = $state<any[]>([]);
	let searchQuery = $state('');
	let selectedCategory = $state('all');
	let categories = $state<Set<string>>(new Set(['all']));
	let isLoading = $state(true);

	onMount(async () => {
		try {
			console.log('Fetching apps data...');
			const response = await fetch('/api/apps');

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			console.log('Fetched apps data:', data);

			if (!Array.isArray(data)) {
				throw new Error('Expected an array of apps but got something else');
			}

			apps = data;

			const newCategories = new Set(['all']);
			data.forEach((app: any) => {
				if (app?.category) {
					newCategories.add(app.category);
				}
			});
			categories = new Set([...newCategories].sort());
		} catch (error) {
			console.error('Error loading apps:', error);
			apps = [];
			categories = new Set(['all']);
		} finally {
			isLoading = false;
		}
	});

	const filteredApps = $derived(
		apps.filter((app) => {
			const matchesSearch =
				app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				app.id.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
	);

	function clearSearch(event: MouseEvent) {
		event.preventDefault();
		searchQuery = '';
	}

	// function installApp(event: MouseEvent, appId: string, appName: string) {
	// 	event.preventDefault();
	// 	// This would be handled by the Sparkle desktop app
	// 	// make this open in sparkle in the future
	// }

	function formatCategory(category: string): string {
		return category
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
</script>

<div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
	<div class="mb-12 text-center">
		<h2 class="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
			Apps You Can Install
		</h2>
		<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
			Browse and install your favorite applications with one click
		</p>
	</div>

	<div class="mb-8 space-y-4">
		<div class="relative mx-auto max-w-md">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<Search class="h-5 w-5 text-muted-foreground" />
			</div>
			<input
				type="text"
				class="block w-full rounded-lg border border-border bg-background py-3 pr-10 pl-10 text-foreground placeholder-muted-foreground transition-all ease-in-out focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none"
				placeholder="Search {apps.length} apps..."
				bind:value={searchQuery}
			/>
			{#if searchQuery}
				<button class="absolute inset-y-0 right-0 flex items-center pr-3" onclick={clearSearch}>
					<X class="h-5 w-5 text-muted-foreground hover:text-foreground" />
				</button>
			{/if}
		</div>

		<p class="text-center text-sm text-muted-foreground">
			Request more apps <a
				href="https://github.com/Parcoil/Sparkle/issues/new/choose"
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary hover:underline">here</a
			>
		</p>
		<div class="flex flex-wrap justify-center gap-2">
			<Button
				class={`rounded-full px-4 py-2 text-sm font-medium ${
					selectedCategory === 'all'
						? 'bg-primary text-primary-foreground'
						: 'bg-muted text-muted-foreground hover:bg-muted/80'
				}`}
				onclick={(e) => {
					e.preventDefault();
					selectedCategory = 'all';
				}}
			>
				All Apps
			</Button>
			{#each Array.from(categories).filter((cat) => cat !== 'all') as category}
				<Button
					class={`rounded-full px-4 py-2 text-sm font-medium ${
						selectedCategory === category
							? 'bg-primary text-primary-foreground'
							: 'bg-muted text-muted-foreground hover:bg-muted/80'
					}`}
					onclick={(e) => {
						e.preventDefault();
						selectedCategory = category;
					}}
				>
					{formatCategory(category)}
				</Button>
			{/each}
		</div>
	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each Array(8) as _}
				<div class="h-40 animate-pulse rounded-xl bg-muted/30 p-6">
					<div class="mb-4 h-6 w-3/4 rounded bg-muted"></div>
					<div class="mb-4 h-4 w-1/2 rounded bg-muted"></div>
					<div class="h-10 w-10 rounded-full bg-muted"></div>
				</div>
			{/each}
		</div>
	{:else if filteredApps.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredApps as app}
				<div
					class="group relative flex h-full flex-col rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-lg"
				>
					<div class="flex h-full flex-col p-6">
						<div class="flex-1">
							<div class="mb-4 flex items-start justify-between">
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/80"
								>
									{#if app.icon}
										<img
											src={app.icon}
											alt={`${app.name} icon`}
											class="h-8 w-8 object-contain"
											onerror={(e: Event) => {
												const target = e.target as HTMLImageElement;
												if (target) {
													target.style.display = 'none';
												}
											}}
										/>
									{/if}
								</div>
								<span
									class="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
								>
									{formatCategory(app.category || 'other')}
								</span>
							</div>
							<h3 class="mb-2 line-clamp-1 text-lg font-semibold text-foreground">
								{app.name}
							</h3>
							{#if app.info}
								<p class="line-clamp-3 text-sm text-muted-foreground">
									{app.info}
								</p>
							{/if}
						</div>
						<div class="mt-4 border-t border-border/50 pt-4">
							<!--
							<button
								class="inline-flex w-1/2 items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
								onclick={(e) => installApp(e, app.id, app.name)}
							>
								Install
							</button>
							-->
							<Button
								href={app.link}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex w-full items-center justify-center px-4 py-2 text-sm"
							>
								Visit Website
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="py-12 text-center">
			<div class="mx-auto mb-4 h-12 w-12 text-muted-foreground">
				<Search class="h-full w-full" />
			</div>
			<h3 class="text-lg font-medium text-foreground">No apps found</h3>
			<p class="mt-1 text-sm text-muted-foreground">
				Try adjusting your search or filter to find what you're looking for.
			</p>
			{#if searchQuery || selectedCategory !== 'all'}
				<Button
					onclick={(e) => {
						e.preventDefault();
						searchQuery = '';
						selectedCategory = 'all';
					}}
					class="mt-4"
				>
					Clear all filters
				</Button>
			{/if}
		</div>
	{/if}
</div>
