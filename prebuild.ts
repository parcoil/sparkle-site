import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

let commit = 'unknown';
try {
	commit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
} catch {
	console.warn('Warning: Could not determine git commit hash');
}
writeFileSync('src/lib/commit.ts', `const commit = "${commit}";\nexport default commit;\n`);
console.log(`Generated commit.ts: ${commit}`);
