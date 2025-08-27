<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { cn } from '$lib/utils';
  import { Menu, X, Download, ChevronDown, Github } from '@lucide/svelte';
  import ModeToggle from './modetoggle.svelte';

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


  let version = $state('');
  
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
      window.open(`https://github.com/Parcoil/Sparkle/releases/latest/download/sparkle-${version.replace('v', '')}-setup.exe`, '_blank');
    } else {
      window.open('https://github.com/Parcoil/Sparkle/releases/latest/download/win-unpacked.zip', '_blank');
    }
  }
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
        <div class="flex items-center space-x-2">
          <a 
            href="https://github.com/Parcoil/Sparkle" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:bg-accent hover:text-foreground transition-colors"
            aria-label="GitHub repository"
          >
            <Github class="h-5 w-5" />
          </a>
          <ModeToggle />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="default" class="ml-2">
                <Download class="mr-2 h-4 w-4" />
                Download
                <ChevronDown class="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-48" align="end">
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
        </div>
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
        <div class="px-3 py-2 space-y-2">
          <div class="flex justify-between items-center px-3 py-2">
            <span class="text-sm font-medium">GitHub</span>
            <a 
              href="https://github.com/Parcoil/Sparkle" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:bg-accent hover:text-foreground transition-colors"
              aria-label="GitHub repository"
            >
              <Github class="h-5 w-5" />
            </a>
          </div>
          <div class="flex justify-between items-center px-3 py-2">
            <span class="text-sm font-medium">Theme</span>
            <ModeToggle />
          </div>
          <Button variant="default" class="w-full" onclick={() => handleDownload('exe')}>
            <Download class="mr-2 h-4 w-4" />
            Installer (.exe)
          </Button>
          <Button variant="outline" class="w-full" onclick={() => handleDownload('zip')}>
            <Download class="mr-2 h-4 w-4" />
            Portable (.zip)
          </Button>
        </div>
      </div>
    </div>
  {/if}
</header>