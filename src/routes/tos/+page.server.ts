import fs from 'node:fs';
import path from 'node:path';
import type { PageServerLoad } from './$types';
import { parseTos } from '#lib/tos.ts';

const TOS_PATH = path.join(process.cwd(), 'tos', 'tos.md');

export const load: PageServerLoad = () => {
	const raw = fs.readFileSync(TOS_PATH, 'utf-8').replace(/\r\n/g, '\n');
	const content = raw.replace(/^---\n[\s\S]*?\n---\n?/, '').trim();

	return { blocks: parseTos(content) };
};
