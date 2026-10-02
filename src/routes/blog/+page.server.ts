import { getAllPosts } from '$lib/server/blog';

export const load = () => {
	return { posts: getAllPosts() };
};