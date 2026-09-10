"use client";

import { useState, useEffect } from "react";
import { Download, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeTabs } from "@/components/code-tabs";
import GithubIcon from "@/components/githubicon";

export default function DownloadsPage() {
  const [version, setVersion] = useState("");
  const [downloads, setDownloads] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/parcoil/sparkle/releases/latest",
        );
        const data = await res.json();
        setVersion(data.tag_name);

        const releasesRes = await fetch(
          "https://api.github.com/repos/parcoil/sparkle/releases",
        );
        const releases = await releasesRes.json();
        let total = 0;
        releases.forEach((release: any) => {
          const v = release.tag_name;
          if (v && v >= "2.0.0") {
            release.assets.forEach((asset: any) => {
              if (asset.name.endsWith(".exe") || asset.name.endsWith(".zip")) {
                total += asset.download_count || 0;
              }
            });
          }
        });
        setDownloads(total.toLocaleString("en-US"));
      } catch {
        console.error("Failed to fetch release data");
      }
    }
    fetchData();
  }, []);

  function handleDownload(type: "exe" | "zip") {
    if (type === "exe") {
      window.open(
        `https://github.com/Parcoil/Sparkle/releases/latest/download/sparkle-${version.replace("v", "")}-setup.exe`,
        "_blank",
      );
    } else {
      window.open(
        `https://github.com/Parcoil/Sparkle/releases/latest/download/sparkle-${version.replace("v", "")}-win.zip`,
        "_blank",
      );
    }
  }

  const installMethods = [
    {
      label: "PowerShell",
      value: "powershell",
      code: "irm https://getsparkle.net/get | iex",
    },
    {
      label: "Chocolatey",
      value: "chocolatey",
      code: `choco install sparkle`,
    },
    {
      label: "Scoop",
      value: "scoop",
      code: "scoop bucket add sparkle https://github.com/thedogecraft/sparkle && scoop install sparkle",
    },
  ];

  return (
    <div className="container mx-auto mt-5 min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="animate-gradient mb-4 bg-linear-to-r from-[#0096ff] to-[#0042ff] bg-clip-text pb-2 text-4xl font-bold text-transparent sm:text-5xl">
            Download Sparkle
          </h1>
          <p className="text-lg text-muted-foreground">
            All the ways to get Sparkle on your PC.
          </p>
          {version && (
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>
                Latest:{" "}
                <Badge variant="default" className="ml-1">
                  {version}
                </Badge>
              </span>
              {downloads && (
                <span>
                  Downloads:{" "}
                  <span className="font-semibold text-primary">
                    {downloads}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
              Direct Download
            </h2>
            <p className="mb-6 text-muted-foreground">
              Download the latest version directly from GitHub. Choose between
              the installer or portable zip.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20">
                <CardHeader>
                  {/* <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/40 text-primary">
                    <Box className="h-5 w-5 text-blue-500" />
                  </div> */}
                  <CardTitle className="text-base font-semibold">
                    Installer (.exe)
                  </CardTitle>
                  <CardDescription className="mt-2 text-xs text-muted-foreground">
                    Recommended for most users. Guides you through installation
                    with setup options.
                  </CardDescription>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => handleDownload("exe")}
                    disabled={!version}
                    asChild
                  >
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Download className=" h-4 w-4" />
                      Download .exe
                    </a>
                  </Button>
                </CardHeader>
              </Card>

              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20">
                <CardHeader>
                  {/* <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/40 text-primary">
                    <Package className="h-5 w-5 text-green-500" />
                  </div> */}
                  <CardTitle className="text-base font-semibold">
                    Portable (.zip)
                  </CardTitle>
                  <CardDescription className="mt-2 text-xs text-muted-foreground">
                    No installation required, Extract and run anywhere
                    <br />
                    <br />
                  </CardDescription>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => handleDownload("zip")}
                    disabled={!version}
                  >
                    <Download className="h-4 w-4" />
                    Download .zip
                  </Button>
                </CardHeader>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
              Package Managers
            </h2>
            <p className="mb-6 text-muted-foreground">
              Install and update Sparkle from the command line using your
              favorite package manager.
            </p>
            <CodeTabs tabs={installMethods} />

            <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              Scoop
            </h3>
            <p className="text-muted-foreground mt-6 mb-6">
              If you already have the sparkle scoop bucket added, you can
              install Sparkle with the following command:
            </p>
            <CodeTabs
              tabs={[
                {
                  label: "Scoop",
                  value: "scoop",
                  code: "scoop install sparkle",
                },
              ]}
            />
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
              Build from Source
            </h2>
            <p className="mb-6 text-muted-foreground">
              Want to contribute or customize Sparkle? Clone the repo and build
              it yourself.
            </p>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:ring-1 hover:ring-primary/20">
              <CardHeader>
                {/* <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/40 text-primary">
                  <FileCode className="h-5 w-5 text-purple-500" />
                </div> */}
                <CardTitle className="text-base font-semibold">
                  GitHub Repository
                </CardTitle>
                <CardDescription className="mt-2 text-xs text-muted-foreground">
                  Browse the source code, report issues, or submit pull
                  requests.
                </CardDescription>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <a
                      href="https://github.com/Parcoil/Sparkle"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon className="h-4 w-4" />
                      View Source
                    </a>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
