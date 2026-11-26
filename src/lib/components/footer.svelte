<script lang="ts">
	import { Mail } from '@lucide/svelte';
	import commit from '#lib/commit.ts';
	import { Button } from '#lib/components/ui/button/index.ts';
	import { Separator } from '#lib/components/ui/separator/index.ts';
	import Discord from '#lib/components/Discord.svelte';
	import FooterLink from '#lib/components/footer-link.svelte';
	import GithubIcon from '#lib/components/githubicon.svelte';
	import ModeToggle from '#lib/components/modetoggle.svelte';

	interface Props {
		latestPost?: { slug: string; title: string } | null;
	}

	let { latestPost = null }: Props = $props();

	const linkGroups = $derived([
		{
			title: 'Pages',
			links: [
				{ label: 'Home', href: '/' },
				{ label: 'Debloat Script', href: '/debloat' },
				{ label: 'Apps', href: '/apps' },
				{ label: 'Downloads', href: '/downloads' },
				{ label: 'Patch Notes', href: '/patch-notes' },
				{ label: 'Blog', href: '/blog' }
			]
		},
		{
			title: 'Resources',
			links: [
				{ label: 'Sparkle Docs', href: 'https://docs.getsparkle.net', external: true },
				...(latestPost ? [{ label: 'Latest Article', href: `/blog/${latestPost.slug}` }] : []),
				{
					label: 'GitHub Releases',
					href: 'https://github.com/Parcoil/Sparkle/releases',
					external: true
				},
				{
					label: 'Debloat Script Source Code',
					href: 'https://github.com/Parcoil/Sparkle/blob/main/debloatscript.ps1',
					external: true
				}
			]
		},
		{
			title: 'Connect & Other',
			links: [
				{ label: 'GitHub', href: 'https://github.com/Parcoil/Sparkle', external: true },
				{ label: 'Discord', href: 'https://dsc.gg/parcoil', external: true },
				{ label: 'Email', href: 'mailto:info@parcoil.com' },
				{ label: 'Parcoil', href: 'https://parcoil.com', external: true },
				{ label: 'Terms of Service', href: '/tos' }
			]
		}
	]);
</script>

<footer aria-label="Footer" class="w-full border-t bg-muted/30">
	<div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
			<div class="flex flex-col gap-4">
				<a href="/" class="flex w-fit items-center gap-2">
					<img
						src="/sparklelogo.png"
						alt=""
						class="size-9 rounded-lg object-contain"
						width="36"
						height="36"
					/>
					<span
						class="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent"
					>
						Sparkle
					</span>
				</a>
				<p class="max-w-sm text-sm leading-relaxed text-muted-foreground">
					A Windows app to debloat and optimize your PC.
				</p>
				<div class="flex items-center gap-1">
					<Button
						href="https://github.com/Parcoil/Sparkle"
						target="_blank"
						rel="noopener noreferrer"
						variant="ghost"
						size="icon"
						aria-label="GitHub repository"
					>
						<GithubIcon data-icon="inline-start" aria-hidden="true" />
					</Button>
					<Button
						href="https://dsc.gg/parcoil"
						target="_blank"
						rel="noopener noreferrer"
						variant="ghost"
						size="icon"
						aria-label="Discord server"
					>
						<Discord data-icon="inline-start" aria-hidden="true" />
					</Button>
					<Button
						href="mailto:info@parcoil.com"
						variant="ghost"
						size="icon"
						aria-label="Email Parcoil"
					>
						<Mail data-icon="inline-start" aria-hidden="true" />
					</Button>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-8 sm:grid-cols-3">
				{#each linkGroups as group (group.title)}
					<nav aria-label={group.title}>
						<h2 class="mb-3 text-sm font-semibold text-foreground">{group.title}</h2>
						<ul class="flex flex-col gap-2">
							{#each group.links as link (link.href)}
								<li>
									<FooterLink {...link} />
								</li>
							{/each}
						</ul>
					</nav>
				{/each}
			</div>
		</div>

		<Separator class="my-8" />

		<div
			class="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row"
		>
			<p>© {new Date().getFullYear()} Parcoil. All rights reserved.</p>
			<div class="flex flex-wrap items-center justify-center gap-4">
				<p>
					a
					<a
						href="https://parcoil.com"
						target="_blank"
						rel="noopener noreferrer"
						class="text-foreground transition-colors hover:text-primary"
					>
						parcoil
					</a>
					site
				</p>
				<a
					href={`https://github.com/parcoil/sparkle-site/commit/${commit}`}
					target="_blank"
					rel="noopener noreferrer"
					class="font-mono transition-colors hover:text-primary"
				>
					build {commit}
				</a>
				<div class="flex items-center gap-2">
					<span>Theme</span>
					<ModeToggle />
				</div>
			</div>
		</div>
	</div>
</footer>
