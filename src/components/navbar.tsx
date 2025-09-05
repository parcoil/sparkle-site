"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  Download,
  ChevronDown,
  Github,
  ExternalLink,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [version, setVersion] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchVersion() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/parcoil/sparkle/releases/latest"
        );
        const data = await response.json();
        setVersion(data.tag_name);
      } catch (err) {
        console.error("Failed to fetch version:", err);
      }
    }

    fetchVersion();
  }, []);

  const navItems = [
    { name: "Apps", href: "/apps" },
    { name: "Docs", href: "https://docs.getsparkle.net", icon: ExternalLink },
    {
      name: "Discord",
      href: "https://discord.gg/En5YJYWj3Z",
      icon: ExternalLink,
    },
    { name: "Parcoil Site", href: "https://parcoil.com", icon: ExternalLink },
  ];

  const handleDownload = (type: "exe" | "zip") => {
    posthog.capture("sparkle_download_button", {
      download_type: type,
      app_version: version || "unknown",
    });

    const url =
      type === "exe"
        ? `https://github.com/Parcoil/Sparkle/releases/latest/download/sparkle-${version.replace(
            "v",
            ""
          )}-setup.exe`
        : "https://github.com/Parcoil/Sparkle/releases/latest/download/win-unpacked.zip";

    window.open(url, "_blank");
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 min-w-screen",
        scrolled
          ? "border-b bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="/sparklelogo.png"
                alt="Sparkle Logo"
                className="h-8 w-auto"
              />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent">
                Sparkle
              </span>
            </a>
          </div>
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                >
                  {item.name}
                  {Icon && <Icon className="ml-2 h-4 w-4" />}
                </a>
              );
            })}

            <div className="flex items-center space-x-2">
              <a
                href="https://github.com/Parcoil/Sparkle"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                aria-label="GitHub repository"
              >
                <Github className="h-5 w-5" />
              </a>

              <ModeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="ml-2">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => handleDownload("exe")}>
                      <Download className="mr-2 h-4 w-4" />
                      Installer (.exe)
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDownload("zip")}>
                      <Download className="mr-2 h-4 w-4" />
                      Portable (.zip)
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 hover:text-foreground focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t bg-background/95 backdrop-blur-lg md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-accent/50 hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}

            <div className="space-y-2 px-3 py-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium">GitHub</span>
                <a
                  href="https://github.com/Parcoil/Sparkle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="GitHub repository"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>

              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium">Theme</span>
                <ModeToggle />
              </div>

              <p className="text-center text-sm text-primary">
                Visit on desktop to download Sparkle
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
