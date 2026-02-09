"use client";

import { useState, useEffect } from "react";
import { Search, Copy, Package, Info, ChevronDown, ChevronUp, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Script from "next/script";

interface App {
  name: string;
  id?: string;
  chocolatey?: string;
  category: string;
  info: string;
  link?: string;
  icon?: string;
  warning?: string;
}

interface AppsData {
  apps: App[];
}

const CATEGORIES = ["browsers", "communication", "games", "development", "utilities", "multimedia", "productivity", "Privacy & Security", "peripherals"];

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(CATEGORIES));
  const [generatedCommand, setGeneratedCommand] = useState("");
  const [installMethod, setInstallMethod] = useState<"winget" | "chocolatey">("winget");

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await fetch("https://raw.githubusercontent.com/parcoil/sparkle/refs/heads/v2/src/renderer/src/assets/apps.json");
      const data: AppsData = await response.json();
      setApps(data.apps || []);
    } catch (error) {
      console.error("Failed to fetch apps:", error);
      toast.error("Failed to load apps");
    } finally {
      setLoading(false);
    }
  };

  const toggleApp = (appName: string) => {
    const newSelected = new Set(selectedApps);
    if (newSelected.has(appName)) {
      newSelected.delete(appName);
    } else {
      newSelected.add(appName);
    }
    setSelectedApps(newSelected);
  };

  const toggleCategory = (category: string) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  const toggleExpandedCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const selectAllInCategory = (category: string) => {
    const categoryApps = getFilteredApps().filter(app => app.category === category);
    const newSelected = new Set(selectedApps);
    categoryApps.forEach(app => newSelected.add(app.name));
    setSelectedApps(newSelected);
  };

  const deselectAllInCategory = (category: string) => {
    const categoryApps = getFilteredApps().filter(app => app.category === category);
    const newSelected = new Set(selectedApps);
    categoryApps.forEach(app => newSelected.delete(app.name));
    setSelectedApps(newSelected);
  };

  const generateCommand = () => {
    const selected = apps.filter(app => selectedApps.has(app.name));
    if (selected.length === 0) {
      if (installMethod === "winget") {
        setGeneratedCommand("# No apps selected. Select apps above to generate a winget install command.");
      } else {
        setGeneratedCommand("# No apps selected. Select apps above to generate a chocolatey install command.");
      }
      return;
    }

    if (installMethod === "winget") {
      const ids = selected
        .filter(app => app.id)
        .map(app => app.id!);
      if (ids.length === 0) {
        setGeneratedCommand("# No apps with winget IDs selected. Some apps may only support chocolatey.");
        return;
      }
      const command = `winget install ${ids.join(" ")}`;
      setGeneratedCommand(`# Winget Install Command\n# Run in PowerShell or CMD as Administrator\n\n${command}`);
    } else {
      const packages = selected
        .filter(app => app.chocolatey)
        .map(app => app.chocolatey!);
      if (packages.length === 0) {
        setGeneratedCommand("# No apps with chocolatey packages selected.");
        return;
      }
      const command = `choco install ${packages.join(" ")} -y`;
      setGeneratedCommand(`# Chocolatey Install Command\n# Run in PowerShell or CMD as Administrator\n\n${command}`);
    }
  };

  useEffect(() => {
    generateCommand();
  }, [selectedApps, installMethod]);

  const copyCommand = () => {
    if (!generatedCommand) return;
    navigator.clipboard.writeText(generatedCommand);
    toast.success("Command copied to clipboard");
  };

  const getFilteredApps = () => {
    return apps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.info.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.size === 0 ||
                              selectedCategories.has(app.category);
      return matchesSearch && matchesCategory;
    });
  };

  const getAppsByCategory = () => {
    const filtered = getFilteredApps();
    const byCategory: Record<string, App[]> = {};
    CATEGORIES.forEach(cat => byCategory[cat] = []);
    filtered.forEach(app => {
      if (byCategory[app.category]) {
        byCategory[app.category].push(app);
      }
    });
    return byCategory;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading apps...</p>
        </div>
      </div>
    );
  }

  const byCategory = getAppsByCategory();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">App Installer</h1>
          <p className="text-muted-foreground mt-2">
            Select apps to install on your Windows system. Generate and run installation commands.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {CATEGORIES.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategories.has(category) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {CATEGORIES.map(category => {
                const categoryApps = byCategory[category];
                if (categoryApps.length === 0) return null;

                return (
                  <Card key={category}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpandedCategory(category)}
                          >
                            {expandedCategories.has(category) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <CardTitle className="text-lg capitalize">{category.replace(" & ", "/")}</CardTitle>
                          <Badge variant="secondary">{categoryApps.length}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => selectAllInCategory(category)}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deselectAllInCategory(category)}
                          >
                            Deselect All
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {expandedCategories.has(category) && (
                      <CardContent className="pt-2">
                        <div className="grid sm:grid-cols-2 gap-3">
                          {categoryApps.map(app => (
                            <div
                              key={app.name}
                              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                selectedApps.has(app.name)
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:bg-muted/50"
                              }`}
                            >
                              <Checkbox
                                checked={selectedApps.has(app.name)}
                                onCheckedChange={() => toggleApp(app.name)}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-medium">{app.name}</h3>
                                  {selectedApps.has(app.name) && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{app.info}</p>
                                {app.warning && (
                                  <p className="text-xs text-yellow-500 mt-1">{app.warning}</p>
                                )}
                                <div className="flex gap-1 mt-2 flex-wrap">
                                  {app.id && (
                                    <Badge variant="outline" className="text-xs">winget</Badge>
                                  )}
                                  {app.chocolatey && (
                                    <Badge variant="outline" className="text-xs">chocolatey</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Installation Command
                </CardTitle>
                <CardDescription>
                  {selectedApps.size} app{selectedApps.size !== 1 ? "s" : ""} selected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={installMethod} onValueChange={(v) => setInstallMethod(v as "winget" | "chocolatey")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="winget">Winget</TabsTrigger>
                    <TabsTrigger value="chocolatey">Chocolatey</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="h-48 overflow-auto rounded-md border bg-muted/50 p-4">
                  <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                    {generatedCommand}
                  </pre>
                </div>

                <div className="flex gap-2">
                  <Button onClick={copyCommand} className="flex-1" disabled={!generatedCommand}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Command
                  </Button>
                </div>

                <Separator />

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-2">How to use:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Copy the installation command</li>
                    <li>Open PowerShell or CMD as Administrator</li>
                    <li>Paste and run the command</li>
                    {installMethod === "chocolatey" && (
                      <li>Make sure Chocolatey is installed first</li>
                    )}
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p><strong>Winget:</strong> Built into Windows 10/11. Simply run the command.</p>
                <p><strong>Chocolatey:</strong> Install from https://chocolatey.org first, then run commands.</p>
                <p>All commands require Administrator privileges.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1565760898646999"
        crossOrigin="anonymous"
      />
    </div>
  );
}
