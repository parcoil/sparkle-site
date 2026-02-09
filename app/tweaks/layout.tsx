import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tweaks - Sparkle",
  description:
    "Browse and apply system tweaks to optimize Windows. Select tweaks to generate PowerShell scripts.",
  keywords:
    "Sparkle tweaks, Windows optimization, system tweaks, PowerShell scripts, performance tweaks",
};

export default function TweaksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
