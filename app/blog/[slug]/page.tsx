import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  getAllPosts,
  getPostBySlug,
  formatDate,
  renderMarkdown,
  getGithubAvatarUrl,
  getGithubProfileUrl,
} from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} - Sparkle`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container mx-auto mt-5 min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {post.cover && (
          <img
            src={post.cover}
            alt={post.title}
            className="mt-6 aspect-video w-full rounded-xl border object-cover"
          />
        )}

        <h1 className="animate-gradient mb-4 mt-8 bg-linear-to-r from-[#0096ff] to-[#0042ff] bg-clip-text pb-2 text-4xl font-semibold text-transparent">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <a
            href={getGithubProfileUrl(post.author)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <img
              src={getGithubAvatarUrl(post.author)}
              alt={`${post.author}'s avatar`}
              className="h-8 w-8 rounded-full"
            />
            <span>{post.author}</span>
          </a>
          <time dateTime={post.date} className="text-sm text-muted-foreground">
            {formatDate(post.date)}
          </time>
        </div>

        {post.topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        )}

        <div
          className="mt-8 text-foreground/90"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      </div>
    </article>
  );
}
