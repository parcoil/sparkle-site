import { getAllPosts } from '#lib/server/blog.ts';

export const load = () => {
	return { posts: getAllPosts() };
};
