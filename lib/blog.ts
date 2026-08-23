import fs from "fs";
import path from "path";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  author: string;
  cover: string | null;
  topics: string[];
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "blog");

function parseValue(value: string): string | string[] {
  value = value.trim();
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    return inner
      ? inner
          .split(",")
          .map((item) => item.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean)
      : [];
  }
  return value.replace(/^["']|["']$/g, "");
}

export function getAllPosts(): BlogPost[] {
  const posts = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8").replace(/\r\n/g, "\n");
      const post: BlogPost = {
        slug,
        title: "",
        date: "",
        description: "",
        author: "",
        cover: null,
        topics: [],
        content: raw.trim(),
      };

      const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      if (match) {
        const [, frontmatter, content] = match;
        for (const line of frontmatter.split("\n")) {
          const idx = line.indexOf(":");
          if (idx === -1) continue;
          const key = line.slice(0, idx).trim();
          const value = parseValue(line.slice(idx + 1));
          switch (key) {
            case "title":
              post.title = String(value);
              break;
            case "date":
              post.date = String(value);
              break;
            case "description":
              post.description = String(value);
              break;
            case "author":
              post.author = String(value);
              break;
            case "cover":
              post.cover = String(value);
              break;
            case "topics":
              post.topics = Array.isArray(value) ? value : [value];
              break;
          }
        }
        post.content = content.trim();
      }

      return post;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function getGithubProfileUrl(username: string): string {
  return `https://github.com/${username}`;
}

export function getGithubAvatarUrl(username: string): string {
  return `https://github.com/${username}.png?size=64`;
}

function renderInline(text: string): string {
  return text
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="my-4 block w-full rounded-lg border" loading="lazy" />',
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="font-medium text-primary hover:underline">$1</a>',
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-accent px-1 py-0.5 font-mono text-sm">$1</code>',
    );
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const line of lines) {
    const trimmedEnd = line.replace(/\s+$/, "");

    if (!trimmedEnd.trim()) {
      closeList();
      continue;
    }

    if (trimmedEnd.startsWith("### ")) {
      closeList();
      html.push(
        `<h3 class="mb-2 mt-6 text-lg font-semibold">${renderInline(trimmedEnd.slice(4))}</h3>`,
      );
    } else if (trimmedEnd.startsWith("## ")) {
      closeList();
      html.push(
        `<h2 class="mb-3 mt-8 text-2xl font-bold">${renderInline(trimmedEnd.slice(3))}</h2>`,
      );
    } else if (trimmedEnd.startsWith("- ")) {
      if (!listOpen) {
        html.push('<ul class="my-3 ml-5 list-disc space-y-1">');
        listOpen = true;
      }
      html.push(`<li>${renderInline(trimmedEnd.slice(2))}</li>`);
    } else {
      closeList();
      html.push(`<p class="mb-4 leading-relaxed">${renderInline(trimmedEnd)}</p>`);
    }
  }

  closeList();
  return html.join("\n");
}
