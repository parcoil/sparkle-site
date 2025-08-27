
<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/utils';
  import { Menu, X } from '@lucide/svelte';

  let scrolled = $state(false);
  let mobileMenuOpen = $state(false);

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 10;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const navItems = [
    { name: 'Features', href: '/features' },
    { name: 'Docs', href: 'https://docs.getsparkle.net', },
    { name: 'About', href: '/about' }
  ];
</script>

<header
  class={cn(
    'fixed top-0 w-full z-50 transition-all duration-300',
    scrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
  )}
>
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-2">
          <img src="/sparklelogo.png" alt="Sparkle Logo" class="h-8 w-auto" />
          <span class="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Sparkle
          </span>
        </a>
      </div>

      <div class="hidden md:flex items-center space-x-8">
        {#each navItems as item}
          <a
            href={item.href}
            class="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            {item.name}
          </a>
        {/each}
        <Button variant="default" class="ml-4">
          Download Now
        </Button>
      </div>

      <div class="md:hidden">
        <button
          onclick={() => mobileMenuOpen = !mobileMenuOpen}
          class="inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:text-foreground focus:outline-none"
        >
          <span class="sr-only">Open main menu</span>
          {#if mobileMenuOpen}
            <X class="block h-6 w-6" />
          {:else}
            <Menu class="block h-6 w-6" />
          {/if}
        </button>
      </div>
    </div>
  </nav>


  {#if mobileMenuOpen}
    <div class="md:hidden bg-background/95 backdrop-blur-lg border-t">
      <div class="px-2 pt-2 pb-3 space-y-1">
        {#each navItems as item}
          <a
            href={item.href}
            class="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:bg-accent/50 hover:text-foreground"
            onclick={() => (mobileMenuOpen = false)}
          >
            {item.name}
          </a>
        {/each}
        <div class="px-3 py-2">
          <Button variant="default" class="w-full">
            Download Now
          </Button>
        </div>
      </div>
    </div>
  {/if}
</header>