import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const GITHUB_RAW_URL =
    "https://raw.githubusercontent.com/Parcoil/Sparkle/refs/heads/v2/src/renderer/src/assets/apps.json";

  try {
    const response = await fetch(GITHUB_RAW_URL, {
      headers: {
        "User-Agent": "Sparkle-Site/1.0",
        Accept: "application/json",
      },
      // force cache for 1 hour (like your Cache-Control header)
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub fetch error:", response.status, errorText);
      return NextResponse.json(
        {
          error: "GitHub fetch failed",
          status: response.status,
          details: response.statusText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const appsArray = Array.isArray(data) ? data : data?.apps;

    if (!Array.isArray(appsArray)) {
      console.error("Unexpected format from GitHub:", data);
      return NextResponse.json(
        {
          error: "Unexpected data format: expected array or object with apps[]",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(appsArray, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Error in /api/apps:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch apps",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
