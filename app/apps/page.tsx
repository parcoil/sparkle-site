import AppGallery from "@/components/app-gallery";
import Script from "next/script";

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
        width: 1200,
        height: 630,
        alt: "Sparkle - Apps - Install Applications",
      },
    ],
  },
  twitter: {
    url: "https://getsparkle.net/apps",
    title: "Apps - Sparkle",
    description:
      "Browse and install optimized applications for Windows with Sparkle. Enhance your PC's performance.",
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1565760898646999"
          crossOrigin="anonymous"
        ></Script>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1565760898646999"
          data-ad-slot="3836598101"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <Script
          id="adsByGoogle"
          dangerouslySetInnerHTML={{
            __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
          }}
        />
      </div>
    </div>
  );
}
