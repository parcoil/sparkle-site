"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Download, ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  const [version, setVersion] = useState("");

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

  const handleDownload = (type: "exe" | "zip") => {
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
    <>
      <head>
        <title>Sparkle - 404</title>
      </head>
      <div className="flex min-h-[calc(100vh-3.3rem)] flex-col items-center justify-center p-8">
        <div className="flex w-full max-w-2xl flex-col items-center justify-center">
          <img
            src="/sparklelogo.png"
            alt="Sparkle Logo"
            className="mb-6 h-24 w-24 animate-bounce duration-900"
          />
          <h1 className="mb-4 text-4xl font-bold">Oops!</h1>
          <p className="mb-6 text-lg text-muted-foreground">
            We couldn't find the page you were looking for.
          </p>
          <div className="mb-6 flex space-x-2">
            <Link href="/" passHref>
              <Button variant="default" size="lg">
                Go Home
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg">
                  Download Sparkle
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
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
            <Link href="https://docs.getsparkle.net" passHref>
              <Button variant="outline" size="lg">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Docs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
