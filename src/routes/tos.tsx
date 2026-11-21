import { createFileRoute } from "@tanstack/react-router";
import { renderMarkdown } from "@/lib/blog";
import tosRaw from "../../content/tos.md?raw";

export const Route = createFileRoute("/tos")({
  head: () => ({
    meta: [
      { title: "Terms of Service - Sparkle" },
      {
        name: "description",
        content: "The terms of service for downloading and using Sparkle.",
      },
    ],
  }),
  component: TosPage,
});

function readTos() {
  const raw = tosRaw.replace(/\r\n/g, "\n");
  return raw.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
}

function TosPage() {
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
