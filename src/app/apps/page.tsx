import AppGallery from "@/components/pages/appgallery";

export const metadata = {
  title: "Apps - Sparkle",
  description:
    "Browse and install optimized applications for Windows with Sparkle. Enhance your PC's performance with our curated collection of tools and software.",
  keywords:
    "Sparkle apps, Windows applications, optimized software, PC tools, performance apps, Windows optimization, free software, best Windows apps",
  openGraph: {
    type: "website",
    url: "https://getsparkle.net/apps",
    title: "Apps - Sparkle",
    description:
      "Browse and install optimized applications for Windows with Sparkle. Enhance your PC's performance with our curated collection.",
    images: [
      {
        url: "/sparkle-og-image.png", // Replace with actual OG image URL
        width: 1200,
        height: 630,
        alt: "Sparkle - Apps - Install Applications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    url: "https://getsparkle.net/apps",
    title: "Apps - Sparkle",
    description:
      "Browse and install optimized applications for Windows with Sparkle. Enhance your PC's performance.",
    // image can also be added here if needed
  },
  alternates: {
    canonical: "https://getsparkle.net/apps",
  },
};

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <AppGallery />
      </div>
    </div>
  );
}
