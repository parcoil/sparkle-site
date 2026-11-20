import type { Metadata } from "next";
import { Poppins, Fira_Code } from "next/font/google";
import Script from "next/script";
import { connection } from "next/server";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReleaseProvider } from "@/components/release-provider";
import MaintenancePage from "@/components/maintenance-page";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { isMaintenanceMode } from "@/lib/maintenance";
import { getReleaseInfo } from "@/lib/releases";

const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  if (isMaintenanceMode()) {
    return {
      title: "Under Maintenance | Sparkle Debloater",
      description:
        "Sparkle is under maintenance. Download the latest version from GitHub.",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: "Sparkle Debloater",
    description: "A Windows app to debloat and optimize your PC",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Opt into per-request rendering so MAT can be flipped at runtime without
  // rebuilding the site (important for the Docker deployment).
  await connection();

  const bodyClassName = `${poppins.variable} ${firaCode.variable} antialiased`;

  if (isMaintenanceMode()) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={bodyClassName} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MaintenancePage />
          </ThemeProvider>
        </body>
      </html>
    );
  }

  const releaseInfo = await getReleaseInfo();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bodyClassName} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReleaseProvider value={releaseInfo}>
            <Nav />
            <div className="min-h-screen pt-16">{children}</div>
            <Toaster />
            <Footer />
          </ReleaseProvider>
        </ThemeProvider>
        <Script
          defer
          src="https://umami.parcoil.com/script.js"
          data-website-id="9924bb71-c86f-4f31-8365-b3bf3cc99f88"
        />
        <Script
          defer
          src="https://umami.parcoil.com/recorder.js"
          data-website-id="9924bb71-c86f-4f31-8365-b3bf3cc99f88"
        />
      </body>
    </html>
  );
}
