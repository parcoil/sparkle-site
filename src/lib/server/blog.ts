import fs from 'node:fs';
import path from 'node:path';
import type { BlogPost } from '$lib/blog';

const BLOG_DIR = path.join(process.cwd(), 'blog');

function parseValue(value: string): string | string[] {
	value = value.trim();
	if (value.startsWith('[') && value.endsWith(']')) {
		const inner = value.slice(1, -1).trim();
		return inner
			? inner
					.split(',')
					.map((item) => item.trim().replace(/^["']|["']$/g, ''))
					.filter(Boolean)
			: [];
	}
	return value.replace(/^["']|["']$/g, '');
}

export function getAllPosts(): BlogPost[] {
	if (!fs.existsSync(BLOG_DIR)) return [];

	const posts = fs
		.readdirSync(BLOG_DIR)
		.filter((file) => file.endsWith('.md'))
		.map((file) => {
			const slug = file.replace(/\.md$/, '');
			const raw = fs
				.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
				.replace(/\r\n/g, '\n');
			const post: BlogPost = {
				slug,
				title: '',
				date: '',
				description: '',
				author: '',
				cover: null,
				topics: [],
				content: raw.trim()
			};

			const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
			if (match) {
				const [, frontmatter, content] = match;
				for (const line of frontmatter.split('\n')) {
					const idx = line.indexOf(':');
					if (idx === -1) continue;
					const key = line.slice(0, idx).trim();
					const value = parseValue(line.slice(idx + 1));
					switch (key) {
						case 'title':
							post.title = String(value);
							break;
						case 'date':
							post.date = String(value);
							break;
						case 'description':
							post.description = String(value);
							break;
						case 'author':
							post.author = String(value);
							break;
						case 'cover':
							post.cover = String(value);
							break;
						case 'topics':
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