import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
writeFileSync('src/lib/commit.ts', `const commit = "${commit}";\nexport default commit;\n`);
console.log(`Generated commit.ts: ${commit}`);
