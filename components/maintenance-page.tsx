import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import GithubIcon from "@/components/githubicon";

const GITHUB_REPO = "https://github.com/Parcoil/Sparkle";
const GITHUB_RELEASES = `${GITHUB_REPO}/releases/latest`;

export default function MaintenancePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <Image
          src="/sparklelogo.png"
          alt="Sparkle Logo"
          width={96}
          height={96}
          unoptimized
          className="mb-6 h-24 w-24"
        />

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          We&apos;ll be right back
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          The Sparkle website is temporarily under maintenance. In the meantime,
          you can get the latest version straight from GitHub.
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg">
            <a href={GITHUB_RELEASES} target="_blank" rel="noopener noreferrer">
              <Download />
              Download from GitHub
              <ExternalLink className="opacity-60" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              <GithubIcon />
              View repository
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
