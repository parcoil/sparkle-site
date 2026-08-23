import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getAllPosts,
  formatDate,
  getGithubAvatarUrl,
  getGithubProfileUrl,
} from "@/lib/blog";

export const metadata = {
  title: "Blog - Sparkle",
  description: "News, updates, and articles about Sparkle.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto mt-5 min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="animate-gradient mb-4 bg-linear-to-r from-[#0096ff] to-[#0042ff] bg-clip-text pb-2 text-4xl font-bold text-transparent sm:text-5xl">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            News, updates, and articles about Sparkle.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <Card key={post.slug} className="group overflow-hidden p-0 transition-shadow hover:shadow-md">
              {post.cover && (
                <Link href={`/blog/${post.slug}`} aria-label={post.title}>
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="aspect-video w-full border-b object-cover"
                  />
                </Link>
              )}
              <CardContent className="py-6">
                {post.topics.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {post.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
                <h2 className="mb-1 text-xl font-semibold sm:text-2xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors group-hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground">{post.description}</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <a
                    href={getGithubProfileUrl(post.author)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <img
                      src={getGithubAvatarUrl(post.author)}
                      alt={`${post.author}'s avatar`}
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{post.author}</span>
                  </a>
                  <time dateTime={post.date} className="text-sm text-muted-foreground">
                    {formatDate(post.date)}
                  </time>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
