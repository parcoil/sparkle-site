import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail, MessageCircle } from "lucide-react";

import commit from "@/components/commit";
import GithubIcon from "@/components/githubicon";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAllPosts } from "@/lib/blog";
import { DiscordIcon } from "./nav";

type FooterLinkItem = {
  label: string;
  href: string;
  external?: boolean;
  plain?: boolean;
};

function FooterLink({ label, href, external, plain }: FooterLinkItem) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const isMailto = href.startsWith("mailto:");

  const className =
    "inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:text-primary";
  const content = (
    <>
      {label}
      {isExternal && <ExternalLink className="size-3" aria-hidden="true" />}
    </>
  );

  if (plain || isExternal || isMailto) {
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export default function Footer() {
  const latestPost = getAllPosts()[0];

  const linkGroups: { title: string; links: FooterLinkItem[] }[] = [
    {
      title: "Pages",
      links: [
        { label: "Home", href: "/" },
        { label: "Debloat Script", href: "/debloat" },
        { label: "Apps", href: "/apps" },
        { label: "Downloads", href: "/downloads" },
        { label: "Patch Notes", href: "/patch-notes" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Resources",
      links: [
        {
          label: "Sparkle Docs",
          href: "https://docs.getsparkle.net",
          external: true,
        },
        ...(latestPost
          ? [{ label: "Latest Article", href: `/blog/${latestPost.slug}` }]
          : []),
        {
          label: "GitHub Releases",
          href: "https://github.com/Parcoil/Sparkle/releases",
          external: true,
        },
        {
          label: "Debloat Script Source Code",
          href: "https://github.com/Parcoil/Sparkle/blob/main/debloatscript.ps1",
          external: true,
        },
      ],
    },
    {
      title: "Connect & Other",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/Parcoil/Sparkle",
          external: true,
        },
        { label: "Discord", href: "https://dsc.gg/parcoil", external: true },
        { label: "Email", href: "mailto:info@parcoil.com" },
        { label: "Parcoil", href: "https://parcoil.com", external: true },
        { label: "Terms of Service", href: "/tos" },
      ],
    },
  ];

  return (
    <footer aria-label="Footer" className="w-full border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex w-fit items-center gap-2">
              <Image
                src="/sparklelogo.png"
                alt=""
                width={36}
                height={36}
                className="size-9 rounded-lg object-contain"
              />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent">
                Sparkle
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              A Windows app to debloat and optimize your PC.
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/Parcoil/Sparkle"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                >
                  <GithubIcon data-icon="inline-start" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://dsc.gg/parcoil"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Discord server"
                >
                  <DiscordIcon data-icon="inline-start" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:info@parcoil.com" aria-label="Email Parcoil">
                  <Mail data-icon="inline-start" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {linkGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  {group.title}
                </h2>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <FooterLink {...link} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Parcoil. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <p>
              a{" "}
              <a
                href="https://parcoil.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground transition-colors hover:text-primary"
              >
                parcoil
              </a>{" "}
              site
            </p>
            <a
              href={`https://github.com/parcoil/sparkle-site/commit/${commit}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono transition-colors hover:text-primary"
            >
              build {commit}
            </a>
            <div className="flex items-center gap-2">
              <span>Theme</span>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
