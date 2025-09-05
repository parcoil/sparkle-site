"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import posthog from "posthog-js";
import { toast } from "sonner";
import {
  Download,
  Shield,
  Github,
  Network,
  ChevronDown,
  Star,
  Zap,
  Copy,
  Trash2,
  Package,
  Wrench,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function Home() {
  const [showMovedAlert, setShowMovedAlert] = useState(false);
  const [version, setVersion] = useState("");
  const [downloads, setDownloads] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("ref") === "parcoil-sparkle-page") setShowMovedAlert(true);

      fetchVersion();
      fetchDownloads();
    }
  }, []);

  function handleDownload(type: "exe" | "zip") {
    if (typeof window !== "undefined") {
      posthog.capture("sparkle_download_button", {
        download_type: type,
        app_version: version || "unknown",
        location: "hero_section",
      });

      const url =
        type === "exe"
          ? `https://github.com/Parcoil/Sparkle/releases/latest/download/sparkle-${version.replace(
              "v",
              ""
            )}-setup.exe`
          : "https://github.com/Parcoil/Sparkle/releases/latest/download/win-unpacked.zip";
      window.open(url, "_blank");
    }
  }

  async function fetchVersion() {
    const res = await fetch(
      "https://api.github.com/repos/parcoil/sparkle/releases/latest"
    );
    const data = await res.json();
    setVersion(data.tag_name);
  }

  async function fetchDownloads() {
    const releases = await (
      await fetch("https://api.github.com/repos/parcoil/sparkle/releases")
    ).json();
    let totalDownloads = 0;
    releases.forEach((release: any) => {
      const ver = release.tag_name;
      if (ver && ver >= "2.0.0") {
        release.assets.forEach((asset: any) => {
          if (asset.name.endsWith(".exe") || asset.name.endsWith(".zip"))
            totalDownloads += asset.download_count || 0;
        });
      }
    });
    setDownloads(totalDownloads.toLocaleString("en-US"));
  }

  const faqs = [
    {
      question: "Is Sparkle safe to use?",
      answer:
        "Yes! Sparkle only makes reversible changes. You can create system restore points before applying any tweaks.",
    },
    {
      question: "Which versions of Windows are supported?",
      answer: "Sparkle supports Windows 10 and 11.",
    },
    {
      question: "Can I undo changes made by Sparkle?",
      answer:
        "Yes, all tweaks are reversible. You can either use Sparkle’s built-in restore option or a system restore point.",
    },
    {
      question: "Do I need an internet connection to use Sparkle?",
      answer:
        "The auto-updates require an internet connection. Most other features should work offline.",
    },
    {
      question: "How often is Sparkle updated?",
      answer:
        "Sparkle is actively maintained, with new features, versions and bug fixes released regularly. Check GitHub or here for the latest version.",
    },
    {
      question: "What should I do if I encounter an error?",
      answer:
        "Visit our GitHub Issues page to report bugs or join our Discord server for support.",
    },
  ];

  const features = [
    {
      title: "Debloat Windows",
      description:
        "Removes unnecessary Windows features and apps to free up resources and improve performance.",
      icon: Star,
      iconColor: "text-teal-500",
      categories: ["Performance", "Privacy"],
    },
    {
      title: "System Optimization",
      description:
        "Enhance system performance and responsiveness with carefully selected tweaks.",
      icon: Zap,
      iconColor: "text-pink-500",
      categories: ["Performance"],
    },
    {
      title: "Clean Temporary Files",
      description:
        "Remove temporary files, caches, and logs to free up valuable disk space.",
      icon: Trash2,
      iconColor: "text-yellow-500",
      categories: ["Maintenance"],
    },
    {
      title: "Safe & Reversible",
      description:
        "All changes can be easily undone with system restore points or by reverting settings.",
      icon: Shield,
      iconColor: "text-red-500",
      categories: ["Security"],
    },
    {
      title: "App Installer",
      description:
        "Quickly install your favorite applications using the built-in winget-powered installer.",
      icon: Package,
      iconColor: "text-blue-500",
      categories: ["Productivity"],
    },
    {
      title: "System Utilities",
      description:
        "Run essential system tools like SFC, Check Disk, and DISM from a simple, intuitive interface.",
      icon: Wrench,
      iconColor: "text-green-500",
      categories: ["Maintenance"],
    },
    {
      title: "Network Optimizer",
      description:
        "Optimize your network settings and change DNS for improved speed and security.",
      icon: Network,
      iconColor: "text-purple-500",
      new: true,
      categories: ["Performance", "Networking"],
    },
  ];

  return (
    <>
      <Head>
        <title>Sparkle | Ultimate Windows Optimizer</title>
      </Head>

      <main className="mt-10 flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-5xl flex-col items-center justify-center">
          {showMovedAlert && (
            <div className="mb-6 w-full max-w-md">
              <Alert className="text-center">
                <AlertTitle>
                  Hello Parcoil user, Sparkle has moved to getsparkle.net
                </AlertTitle>
              </Alert>
            </div>
          )}

          <img
            src="/sparklelogo.png"
            alt="Sparkle Logo"
            className="mb-6 h-20 w-20 sm:h-24 sm:w-24"
          />
          <h1 className="animate-gradient mb-4 bg-gradient-to-r from-[#0096ff] to-[#0042ff] bg-clip-text text-center text-4xl font-bold text-transparent sm:text-5xl md:text-7xl">
            Sparkle
          </h1>
          <p className="mb-6 text-center text-base text-muted-foreground sm:text-lg">
            The ultimate tool to optimize Windows and boost gaming performance
          </p>

          <div className="mb-6 flex flex-col space-y-2 text-center sm:flex-row sm:space-y-0 sm:space-x-4 sm:text-left">
            <p className="text-sm font-medium text-muted-foreground">
              Latest Version{" "}
              <span className="font-semibold text-primary">{version}</span>
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              Downloads{" "}
              <span className="font-semibold text-primary">{downloads}</span>
            </p>
          </div>

          <div className="hidden w-full flex-col justify-center space-y-2 sm:flex sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" className="w-full justify-center sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full sm:w-56">
                <DropdownMenuItem onClick={() => handleDownload("exe")}>
                  <Download className="mr-2 h-4 w-4" />
                  Installer (.exe)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload("zip")}>
                  <Download className="mr-2 h-4 w-4" />
                  Portable (.zip)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a
              href="https://github.com/Parcoil/Sparkle"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center sm:w-auto"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </a>
          </div>

          <div className="group relative mt-4 hidden w-full sm:mt-6 sm:flex sm:max-w-md">
            <button
              className="flex w-full items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/80"
              onClick={() => {
                navigator.clipboard.writeText(
                  "irm https://getsparkle.net/get | iex"
                );
                toast.success("Copied to clipboard");
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="font-mono text-sm">
                irm https://getsparkle.net/get | iex
              </span>
            </button>
            <span className="absolute -bottom-5 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              Click to copy PowerShell command
            </span>
          </div>
          <div className="w-full py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Features
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                  Powerful Tweaks to optimize your Windows experience
                </p>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={feature.title}
                      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20"
                    >
                      <CardHeader>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/40 text-primary">
                          <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-semibold">
                            {feature.title}
                          </CardTitle>
                          {feature.new && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                              New
                            </span>
                          )}
                        </div>
                        <CardDescription className="mt-2 text-muted-foreground">
                          {feature.description}
                        </CardDescription>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {feature.categories.map((cat) => (
                            <span
                              key={cat}
                              className="inline-flex items-center rounded-full bg-accent/50 px-2.5 py-0.5 text-xs font-medium text-accent-foreground"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  FAQs
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                  Frequently Asked Questions
                </p>
              </div>
              <Accordion type="single" className="mt-6 space-y-2" collapsible>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.question} value={faq.question}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-12 w-full rounded-2xl bg-muted py-12 dark:border dark:border-accent dark:bg-muted/20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  App Gallery
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                  Install apps quickly with Sparkle to make your Windows
                  experience better
                </p>
                <Button asChild>
                  <Link
                    href="/apps"
                    className="mt-6 inline-flex w-full items-center justify-center px-6 py-3 sm:w-auto"
                  >
                    Browse Apps
                    <ArrowRight className="-mr-1 ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
