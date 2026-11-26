"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Download,
  ChevronDown,
  Github,
  ExternalLink,
  Star,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import GithubIcon from "./githubicon";
import { useRelease } from "./release-provider";

const navItems = [
  // { name: "Home", href: "/" },
  { name: "Debloat Script", href: "/debloat" },
  { name: "Apps", href: "/apps" },
  { name: "Downloads", href: "/downloads" },
  { name: "Patch Notes", href: "/patch-notes" },
  { name: "Blog", href: "/blog" },
  { name: "Docs", href: "https://docs.getsparkle.net" },
];

export function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Discord</title>
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { exeUrl, zipUrl, stars } = useRelease();

  function handleDownload(type: "exe" | "zip") {
    window.open(
      type === "exe" ? exeUrl : zipUrl,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <header
      className={cn(
        "fixed top-4 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 rounded-2xl px-3 sm:px-4 lg:px-5 transition-all duration-300 border bg-background/80 shadow-lg backdrop-blur-md",
      )}
    >
      <nav aria-label="Top">
        <div className="flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <img
              src="/sparklelogo.png"
              alt="Sparkle Logo"
              className="h-8 w-auto"
            />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent">
              Sparkle
            </span>
          </Link>

          <div className="hidden items-center space-x-4 ml-6 md:flex">
            {navItems.map((item) => {
              const isExternalLink = !item.href.startsWith("/");
              const isActive =
                !isExternalLink &&
                (pathname === item.href ||
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  target={isExternalLink ? "_blank" : undefined}
                  rel={isExternalLink ? "noopener noreferrer" : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-foreground/80",
                  )}
                >
                  <span>{item.name}</span>
                  {isExternalLink && <ExternalLink className="h-3.5 w-3.5" />}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 ml-auto shrink-0">
            <a
              href="https://dsc.gg/parcoil"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
              aria-label="Discord Server"
            >
              <DiscordIcon className="h-5 w-5" /> Discord
            </a>
            <a
              href="https://github.com/Parcoil/Sparkle"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
              aria-label={
                stars !== null
                  ? `GitHub repository, ${stars.toLocaleString("en-US")} stars`
                  : "GitHub repository"
              }
            >
              <GithubIcon className="h-5 w-5" /> Github
              {stars !== null && (
                <>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-xs font-medium tabular-nums text-muted-foreground">
                    {new Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    })
                      .format(stars)
                      .replace("K", "k")}
                  </span>{" "}
                </>
              )}
            </a>
            <ModeToggle />
            <div className="hidden md:block">
              <Link
                href="/downloads"
                className={buttonVariants({ variant: "default" })}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Link>
            </div>
          </div>

          <div className="md:hidden shrink-0 ml-2">
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
            {navItems.map((item) => {
              const isActive =
                item.href.startsWith("/") &&
                (pathname === item.href ||
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium hover:bg-accent/50",
                    isActive
                      ? "bg-accent/50 text-primary"
                      : "text-foreground/80 hover:text-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="space-y-2 px-3 py-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium">
                  GitHub
                  {stars !== null && (
                    <span className="ml-2 text-xs font-medium tabular-nums text-muted-foreground">
                      {stars.toLocaleString("en-US")}
                    </span>
                  )}
                </span>
                <a
                  href="https://github.com/Parcoil/Sparkle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={
                    stars !== null
                      ? `GitHub repository, ${stars.toLocaleString("en-US")} stars`
                      : "GitHub repository"
                  }
                >
                  <GithubIcon className="h-5 w-5" />
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
