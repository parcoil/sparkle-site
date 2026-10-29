import type { Metadata } from "next";
import { Poppins, Fira_Code } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ReleaseProvider } from "@/components/release-provider";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
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

export const metadata: Metadata = {
  title: "Sparkle Debloater",
  description: "A Windows app to debloat and optimize your PC",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const releaseInfo = await getReleaseInfo();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${firaCode.variable} antialiased`}
        suppressHydrationWarning
      >
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
