import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/navbar";
import Footer from "@/components/footer";

import { Poppins, Fira_Code } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
});
export const metadata: Metadata = {
  title: "Sparkle - Windows Optimizer",
  description:
    "Free, open-source tool to optimize Windows, remove bloatware, and boost your PC's performance. Download Sparkle for a faster, cleaner Windows experience.",
  keywords: [
    "Windows optimizer",
    "PC optimization",
    "remove bloatware",
    "speed up Windows",
    "free PC cleaner",
    "Windows tweaks",
    "system optimization",
    "gaming performance",
    "Windows debloater",
    "free system utility",
  ],
  openGraph: {
    type: "website",
    url: "https://getsparkle.net/",
    title: "Sparkle - Windows Optimizer",
    description:
      "Free, open-source tool to optimize Windows, remove bloatware, and boost your PC's performance. Download now for a faster, cleaner Windows experience.",
    images: [
      {
        url: "/sparklelogo.png",
        width: 1200,
        height: 630,
        alt: "Sparkle - Ultimate Windows Optimizer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparkle - Windows Optimizer",
    description:
      "Free, open-source tool to optimize Windows, remove bloatware, and boost your PC's performance. Download now!",
    images: ["/sparklelogo.png"],
  },
  alternates: {
    canonical: "https://getsparkle.net/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${firaCode.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
