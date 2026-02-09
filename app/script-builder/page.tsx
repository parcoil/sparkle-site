"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Code,
  Download,
  Copy,
  Trash2,
  Settings,
  Zap,
  Shield,
  Network,
  RefreshCw,
  Terminal,
  Info,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface Tweak {
  id: string;
  title: string;
  description: string;
  category: string[];
  recommended: boolean;
  reversible: boolean;
  scripts: {
    apply: string;
    unapply?: string;
  };
}

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

const TWEAK_CATEGORIES = [
  "General",
  "Appearance",
  "Performance",
  "Privacy",
  "Gaming",
  "Network",
  "GPU",
  "Maintenance",
];
const APP_CATEGORIES = [
  "browsers",
  "communication",
  "games",
  "development",
  "utilities",
  "multimedia",
  "productivity",
  "Privacy & Security",
  "peripherals",
];

export default function ScriptBuilderPage() {
  const [tweaks, setTweaks] = useState<Tweak[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTweaks, setSelectedTweaks] = useState<Set<string>>(new Set());
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTweakCategories, setSelectedTweakCategories] = useState<
    Set<string>
  >(new Set());
  const [selectedAppCategories, setSelectedAppCategories] = useState<
    Set<string>
  >(new Set());
  const [expandedTweakCategories, setExpandedTweakCategories] = useState<
    Set<string>
  >(new Set(TWEAK_CATEGORIES));
  const [expandedAppCategories, setExpandedAppCategories] = useState<
    Set<string>
  >(new Set(APP_CATEGORIES));
  const [showUnapply, setShowUnapply] = useState(false);
  const [installMethod, setInstallMethod] = useState<"winget" | "chocolatey">(
    "winget",
  );
  const [generatedScript, setGeneratedScript] = useState("");
  const [showScript, setShowScript] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tweaksRes, appsRes] = await Promise.all([
        fetch(
          "https://raw.githubusercontent.com/parcoil/sparkle/refs/heads/v2/tweaks/registry-scripts.json",
        ),
        fetch(
          "https://raw.githubusercontent.com/parcoil/sparkle/refs/heads/v2/src/renderer/src/assets/apps.json",
        ),
      ]);

      const tweaksData = await tweaksRes.json();
      const appsData = await appsRes.json();

      setTweaks(tweaksData.tweaks || []);
      setApps(appsData.apps || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load tweaks and apps");
    } finally {
      setLoading(false);
    }
  };

  const toggleTweak = (tweakId: string) => {
    const newSelected = new Set(selectedTweaks);
    if (newSelected.has(tweakId)) {
      newSelected.delete(tweakId);
    } else {
      newSelected.add(tweakId);
    }
    setSelectedTweaks(newSelected);
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

  const toggleTweakCategory = (category: string) => {
    const newCats = new Set(selectedTweakCategories);
    if (newCats.has(category)) {
      newCats.delete(category);
    } else {
      newCats.add(category);
    }
    setSelectedTweakCategories(newCats);
  };

  const toggleAppCategory = (category: string) => {
    const newCats = new Set(selectedAppCategories);
    if (newCats.has(category)) {
      newCats.delete(category);
    } else {
      newCats.add(category);
    }
    setSelectedAppCategories(newCats);
  };

  const toggleExpandedTweakCategory = (category: string) => {
    const newExpanded = new Set(expandedTweakCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedTweakCategories(newExpanded);
  };

  const toggleExpandedAppCategory = (category: string) => {
    const newExpanded = new Set(expandedAppCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedAppCategories(newExpanded);
  };

  const selectAllTweaksInCategory = (category: string) => {
    const categoryTweaks = getFilteredTweaks().filter((t) =>
      t.category.includes(category),
    );
    const newSelected = new Set(selectedTweaks);
    categoryTweaks.forEach((t) => newSelected.add(t.id));
    setSelectedTweaks(newSelected);
  };

  const deselectAllTweaksInCategory = (category: string) => {
    const categoryTweaks = getFilteredTweaks().filter((t) =>
      t.category.includes(category),
    );
    const newSelected = new Set(selectedTweaks);
    categoryTweaks.forEach((t) => newSelected.delete(t.id));
    setSelectedTweaks(newSelected);
  };

  const selectAllAppsInCategory = (category: string) => {
    const categoryApps = getFilteredApps().filter(
      (a) => a.category === category,
    );
    const newSelected = new Set(selectedApps);
    categoryApps.forEach((a) => newSelected.add(a.name));
    setSelectedApps(newSelected);
  };

  const deselectAllAppsInCategory = (category: string) => {
    const categoryApps = getFilteredApps().filter(
      (a) => a.category === category,
    );
    const newSelected = new Set(selectedApps);
    categoryApps.forEach((a) => newSelected.delete(a.name));
    setSelectedApps(newSelected);
  };

  const getFilteredTweaks = () => {
    return tweaks.filter((tweak) => {
      const matchesSearch =
        tweak.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tweak.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedTweakCategories.size === 0 ||
        tweak.category.some((c) => selectedTweakCategories.has(c));
      return matchesSearch && matchesCategory;
    });
  };

  const getFilteredApps = () => {
    return apps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.info.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedAppCategories.size === 0 ||
        selectedAppCategories.has(app.category);
      return matchesSearch && matchesCategory;
    });
  };

  const getTweaksByCategory = () => {
    const filtered = getFilteredTweaks();
    const byCategory: Record<string, Tweak[]> = {};
    TWEAK_CATEGORIES.forEach((cat) => (byCategory[cat] = []));
    filtered.forEach((tweak) => {
      tweak.category.forEach((cat) => {
        if (byCategory[cat]) {
          byCategory[cat].push(tweak);
        }
      });
    });
    return byCategory;
  };

  const getAppsByCategory = () => {
    const filtered = getFilteredApps();
    const byCategory: Record<string, App[]> = {};
    APP_CATEGORIES.forEach((cat) => (byCategory[cat] = []));
    filtered.forEach((app) => {
      if (byCategory[app.category]) {
        byCategory[app.category].push(app);
      }
    });
    return byCategory;
  };

  const generateScript = () => {
    const selectedTweakList = tweaks.filter((t) => selectedTweaks.has(t.id));
    const selectedAppList = apps.filter((a) => selectedApps.has(a.name));

    if (selectedTweakList.length === 0 && selectedAppList.length === 0) {
      toast.error("No tweaks or apps selected");
      return;
    }

    let script = "";

    script += `# Sparkle Script - Generated on ${new Date().toLocaleDateString()}
# Run as Administrator

Write-Host "Starting Sparkle Script..." -ForegroundColor Cyan

`;

    if (selectedAppList.length > 0) {
      script += `# Install Applications
Write-Host "Installing ${selectedAppList.length} application(s)..." -ForegroundColor Green
`;
      if (installMethod === "winget") {
        const ids = selectedAppList.filter((a) => a.id).map((a) => a.id!);
        if (ids.length > 0) {
          script += `winget install ${ids.join(" ")} --accept-source-agreements --accept-package-agreements

`;
        }
      } else {
        const packages = selectedAppList
          .filter((a) => a.chocolatey)
          .map((a) => a.chocolatey!);
        if (packages.length > 0) {
          script += `choco install ${packages.join(" ")} -y

`;
        }
      }
    }

    if (selectedTweakList.length > 0) {
      script += `# Apply System Tweaks
Write-Host "Applying ${selectedTweakList.length} tweak(s)..." -ForegroundColor Yellow
`;

      if (showUnapply) {
        script += `# Unapply scripts (to undo tweaks)
`;
        selectedTweakList.forEach((tweak) => {
          if (tweak.scripts.unapply) {
            script += `
# --- ${tweak.title} ---
${tweak.scripts.unapply}
`;
          }
        });
      } else {
        script += `# Apply scripts
`;
        selectedTweakList.forEach((tweak) => {
          script += `
# --- ${tweak.title} ---
${tweak.scripts.apply}
`;
        });
      }
    }

    script += `
Write-Host "Sparkle Script completed!" -ForegroundColor Green
Write-Host "Please restart your computer for changes to take effect." -ForegroundColor Cyan
`;

    setGeneratedScript(script);
    setShowScript(true);
    toast.success("Script generated!");
  };

  const copyScript = () => {
    navigator.clipboard.writeText(generatedScript);
    toast.success("Script copied to clipboard!");
  };

  const downloadScript = () => {
    const blob = new Blob([generatedScript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sparkle-script.ps1";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Script downloaded!");
  };

  const totalSelected = selectedTweaks.size + selectedApps.size;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading tweaks and apps...
          </p>
        </div>
      </div>
    );
  }

  const tweaksByCategory = getTweaksByCategory();
  const appsByCategory = getAppsByCategory();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Code className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Sparkle Script Builder
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Select tweaks and apps to generate a custom PowerShell script
              without needing to download sparkle
            </p>
          </div>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Quick Links</AlertTitle>
            <AlertDescription className="flex gap-4 flex-wrap">
              <a href="/tweaks" className="text-primary hover:underline">
                Browse Tweaks Only →
              </a>
              <a href="/apps" className="text-primary hover:underline">
                Browse Apps Only →
              </a>
            </AlertDescription>
          </Alert>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tweaks and apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Badge variant="secondary" className="text-sm">
                {totalSelected} selected
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={generateScript}
                disabled={totalSelected === 0}
                className="gap-2"
              >
                <Terminal className="h-4 w-4" />
                Generate Script
              </Button>
            </div>
          </div>

          <Tabs defaultValue="tweaks" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="tweaks" className="gap-2">
                <Settings className="h-4 w-4" />
                Tweaks ({selectedTweaks.size})
              </TabsTrigger>
              <TabsTrigger value="apps" className="gap-2">
                <Package className="h-4 w-4" />
                Apps ({selectedApps.size})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tweaks">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex gap-2 flex-wrap">
                  {TWEAK_CATEGORIES.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        selectedTweakCategories.has(category)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleTweakCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {TWEAK_CATEGORIES.map((category) => {
                  const categoryTweaks = tweaksByCategory[category];
                  if (categoryTweaks.length === 0) return null;

                  return (
                    <Card key={category}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleExpandedTweakCategory(category)
                              }
                            >
                              {expandedTweakCategories.has(category) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <CardTitle className="text-lg">
                              {category}
                            </CardTitle>
                            <Badge variant="secondary">
                              {categoryTweaks.length}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                selectAllTweaksInCategory(category)
                              }
                            >
                              Select All
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                deselectAllTweaksInCategory(category)
                              }
                            >
                              Deselect All
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      {expandedTweakCategories.has(category) && (
                        <CardContent className="pt-2">
                          <div className="grid gap-3 sm:grid-cols-2">
                            {categoryTweaks.map((tweak) => (
                              <div
                                key={tweak.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                  selectedTweaks.has(tweak.id)
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:bg-muted/50"
                                }`}
                              >
                                <Checkbox
                                  checked={selectedTweaks.has(tweak.id)}
                                  onCheckedChange={() => toggleTweak(tweak.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Label className="cursor-pointer font-medium">
                                      {tweak.title}
                                    </Label>
                                    {tweak.recommended && (
                                      <Badge
                                        variant="default"
                                        className="text-xs"
                                      >
                                        Recommended
                                      </Badge>
                                    )}
                                    {!tweak.reversible && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs"
                                      >
                                        Not Reversible
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {tweak.description}
                                  </p>
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {tweak.category.map((cat) => (
                                      <Badge
                                        key={cat}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {cat}
                                      </Badge>
                                    ))}
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
            </TabsContent>

            <TabsContent value="apps">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex gap-2 flex-wrap">
                  {APP_CATEGORIES.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        selectedAppCategories.has(category)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleAppCategory(category)}
                    >
                      {category.replace(" & ", "/")}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {APP_CATEGORIES.map((category) => {
                  const categoryApps = appsByCategory[category];
                  if (categoryApps.length === 0) return null;

                  return (
                    <Card key={category}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleExpandedAppCategory(category)
                              }
                            >
                              {expandedAppCategories.has(category) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <CardTitle className="text-lg capitalize">
                              {category.replace(" & ", "/")}
                            </CardTitle>
                            <Badge variant="secondary">
                              {categoryApps.length}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => selectAllAppsInCategory(category)}
                            >
                              Select All
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                deselectAllAppsInCategory(category)
                              }
                            >
                              Deselect All
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      {expandedAppCategories.has(category) && (
                        <CardContent className="pt-2">
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {categoryApps.map((app) => (
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
                                    <Label className="cursor-pointer font-medium">
                                      {app.name}
                                    </Label>
                                    {selectedApps.has(app.name) && (
                                      <Check className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {app.info}
                                  </p>
                                  {app.warning && (
                                    <p className="text-xs text-yellow-500 mt-1">
                                      {app.warning}
                                    </p>
                                  )}
                                  <div className="flex gap-1 mt-2 flex-wrap">
                                    {app.id && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        winget
                                      </Badge>
                                    )}
                                    {app.chocolatey && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        chocolatey
                                      </Badge>
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
            </TabsContent>
          </Tabs>

          {showScript && (
            <Card className="mt-8">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      Generated Script
                    </CardTitle>
                    <CardDescription>
                      PowerShell script (.ps1) - {selectedTweaks.size} tweaks,{" "}
                      {selectedApps.size} apps
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Install method:</Label>
                      <Select
                        value={installMethod}
                        onValueChange={(v) =>
                          setInstallMethod(v as "winget" | "chocolatey")
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="winget">Winget</SelectItem>
                          <SelectItem value="chocolatey">Chocolatey</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Show:</Label>
                      <Select
                        value={showUnapply ? "unapply" : "apply"}
                        onValueChange={(v) => setShowUnapply(v === "unapply")}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apply">Apply</SelectItem>
                          <SelectItem value="unapply">Unapply</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyScript}
                    className="gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button size="sm" onClick={downloadScript} className="gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="relative">
                  <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-sm">
                    <code>{generatedScript}</code>
                  </pre>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>How to Run</AlertTitle>
                  <AlertDescription>
                    <div className="space-y-3">
                      <div>
                        <strong>
                          Option 1 - Run with PowerShell (Recommended)
                        </strong>
                        <ol className="list-decimal list-inside ml-4 mt-1">
                          <li>
                            Click <strong>Download</strong> to save{" "}
                            <code>sparkle-script.ps1</code>
                          </li>
                          <li>
                            Right-click the file and select{" "}
                            <strong>Run with PowerShell</strong>
                          </li>
                          <li>
                            If prompted, type <code>Y</code> to confirm
                          </li>
                        </ol>
                      </div>
                      <div>
                        <strong>Option 2 - Copy & Paste</strong>
                        <ol className="list-decimal list-inside ml-4 mt-1">
                          <li>
                            Click <strong>Copy</strong>
                          </li>
                          <li>Open PowerShell as Administrator</li>
                          <li>Right-click to paste and press Enter</li>
                        </ol>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          <div className="mt-12 rounded-xl bg-muted p-8 text-center dark:border dark:border-accent">
            <Zap className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-bold">
              Need the full Sparkle experience?
            </h3>
            <p className="mb-4 text-muted-foreground">
              Get the complete Windows optimization tool with more features and
              a beautiful UI.
            </p>
            <Button asChild size="lg">
              <Link href="/">Download Sparkle</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
