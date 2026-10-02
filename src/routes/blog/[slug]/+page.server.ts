import { error } from '@sveltejs/kit';
import { getAllPosts, getPostBySlug } from '$lib/server/blog';

export const entries = () => {
	return getAllPosts().map((post) => ({ slug: post.slug }));
};

export const load = ({ params }: { params: { slug: string } }) => {
	const post = getPostBySlug(params.slug);
	if (!post) error(404, 'Post not found');

	return { post };
};