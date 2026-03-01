import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.github.com/repos/Parcoil/Sparkle/releases?per_page=20",
    {
      redirect: "follow",
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch releases" },
      { status: 502 },
    );
  }

  const releases = await res.json();

  const patchNotes = releases.map((release: any) => ({
    version: release.tag_name ? release.tag_name.replace("v", "") : "Unknown",
    date: release.published_at ? new Date(release.published_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) : "Unknown",
    features: [],
    fixes: [],
    breaking: [],
    body: release.body || "",
  }));

  return NextResponse.json(patchNotes, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
