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

export function formatDate(date: string): string {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
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
			'<img src="$2" alt="$1" class="my-4 block w-full rounded-lg border" loading="lazy" />'
		)
		.replace(
			/\[([^\]]+)\]\(([^)]+)\)/g,
			'<a href="$2" target="_blank" rel="noopener noreferrer" class="font-medium text-primary hover:underline">$1</a>'
		)
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
		.replace(
			/`([^`]+)`/g,
			'<code class="rounded bg-accent px-1 py-0.5 font-mono text-sm">$1</code>'
		);
}

export function renderMarkdown(markdown: string): string {
	const lines = markdown.split('\n');
	const html: string[] = [];
	let listType: 'ul' | 'ol' | null = null;

	const closeList = () => {
		if (listType) {
			html.push(`</${listType}>`);
			listType = null;
		}
	};

	for (const line of lines) {
		const trimmedEnd = line.replace(/\s+$/, '');

		if (!trimmedEnd.trim()) {
			closeList();
			continue;
		}

		if (trimmedEnd.startsWith('### ')) {
			closeList();
			html.push(
				`<h3 class="mb-2 mt-6 text-lg font-semibold">${renderInline(trimmedEnd.slice(4))}</h3>`
			);
		} else if (trimmedEnd.startsWith('## ')) {
			closeList();
			html.push(
				`<h2 class="mb-3 mt-8 text-2xl font-bold">${renderInline(trimmedEnd.slice(3))}</h2>`
			);
		} else if (trimmedEnd.startsWith('# ')) {
			closeList();
			html.push(
				`<h1 class="mb-4 mt-8 text-3xl font-bold">${renderInline(trimmedEnd.slice(2))}</h1>`
			);
		} else if (trimmedEnd.startsWith('- ')) {
			if (listType !== 'ul') {
				closeList();
				html.push('<ul class="my-3 ml-5 list-disc space-y-1">');
				listType = 'ul';
			}
			html.push(`<li>${renderInline(trimmedEnd.slice(2))}</li>`);
		} else {
			const ordered = trimmedEnd.match(/^(\d+)\.\s+(.*)$/);

			if (ordered) {
				if (listType !== 'ol') {
					closeList();
					html.push(`<ol start="${ordered[1]}" class="my-3 ml-5 list-decimal space-y-1">`);
					listType = 'ol';
				}
				html.push(`<li>${renderInline(ordered[2])}</li>`);
			} else {
				closeList();
				html.push(`<p class="mb-4 leading-relaxed">${renderInline(trimmedEnd)}</p>`);
			}
		}
	}

	closeList();
	return html.join('\n');
}
