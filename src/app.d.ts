// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { ReleaseInfo } from '#lib/releases.js';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			maintenance?: boolean;
			releaseInfo?: ReleaseInfo;
			latestPost?: { slug: string; title: string } | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
