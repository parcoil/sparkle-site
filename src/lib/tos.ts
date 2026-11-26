export type InlinePart = {
	text: string;
	href?: string;
};

export type TosBlock =
	| { type: 'heading'; level: 2 | 3; parts: InlinePart[] }
	| { type: 'paragraph'; parts: InlinePart[] }
	| { type: 'list'; items: InlinePart[][] };

function parseInline(text: string): InlinePart[] {
	return text
		.split(/(\[[^\]]+\]\([^)]+\))/g)
		.filter(Boolean)
		.map((part) => {
			const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

			return link ? { text: link[1], href: link[2] } : { text: part };
		});
}

export function parseTos(markdown: string): TosBlock[] {
	const blocks: TosBlock[] = [];
	let list: InlinePart[][] | null = null;

	const closeList = () => {
		if (list) {
			blocks.push({ type: 'list', items: list });
			list = null;
		}
	};

	for (const line of markdown.split('\n')) {
		const trimmed = line.trim();

		if (!trimmed) {
			closeList();
			continue;
		}

		const heading = trimmed.match(/^(#{2,3})\s+(.*)$/);

		if (heading) {
			closeList();
			blocks.push({
				type: 'heading',
				level: heading[1].length === 2 ? 2 : 3,
				parts: parseInline(heading[2])
			});
			continue;
		}

		if (trimmed.startsWith('- ')) {
			list ??= [];
			list.push(parseInline(trimmed.slice(2)));
			continue;
		}

		closeList();
		blocks.push({ type: 'paragraph', parts: parseInline(trimmed) });
	}

	closeList();
	return blocks;
}
