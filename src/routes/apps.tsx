import { createFileRoute } from "@tanstack/react-router";
import AppGallery from "@/components/app-gallery";

const title = "Apps - Sparkle";
const description =
  "Browse and install optimized applications for Windows with Sparkle. Enhance your PC's performance with our curated collection of tools and software.";

export const Route = createFileRoute("/apps")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      {
        name: "keywords",
        content:
          "Sparkle apps, Windows applications, optimized software, PC tools, performance apps, Windows optimization, free software, best Windows apps",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://getsparkle.net/apps" },
      { property: "og:title", content: title },
      {
        property: "og:description",
        content:
          "Browse and install optimized applications for Windows with Sparkle. Enhance your PC's performance with our curated collection.",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Sparkle - Apps - Install Applications",
      },
      { name: "twitter:url", content: "https://getsparkle.net/apps" },
      { name: "twitter:title", content: title },
      {
        name: "twitter:description",
        content:
          "Browse and install optimized applications for Windows with Sparkle. Enhance your PC's performance.",
      },
    ],
    links: [{ rel: "canonical", href: "https://getsparkle.net/apps" }],
    scripts: [
      {
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1565760898646999",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: AppsPage,
});

function AppsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <AppGallery />
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1565760898646999"
          data-ad-slot="3836598101"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script
          dangerouslySetInnerHTML={{
            __html: "(adsbygoogle = window.adsbygoogle || []).push({});",
          }}
        />
      </div>
    </div>
  );
}
