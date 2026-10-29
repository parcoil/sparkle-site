import fs from "fs";
import path from "path";
import { renderMarkdown } from "@/lib/blog";

export const metadata = {
  title: "Terms of Service - Sparkle",
  description: "The terms of service for downloading and using Sparkle.",
};

function readTos() {
  const raw = fs
    .readFileSync(path.join(process.cwd(), "app", "tos", "tos.md"), "utf-8")
    .replace(/\r\n/g, "\n");

  return raw.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
}

export default function Page() {
  return (
    <div className="container mx-auto mt-5 min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="animate-gradient mb-4 bg-linear-to-r from-[#0096ff] to-[#0042ff] bg-clip-text pb-2 text-4xl font-semibold text-transparent sm:text-5xl">
          Terms of Service
        </h1>
        <div
          className="mt-8 text-foreground/90 [&_h2]:text-primary"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(readTos()) }}
        />
      </div>
    </div>
  );
}
