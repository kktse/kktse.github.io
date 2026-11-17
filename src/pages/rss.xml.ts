import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = async (context) => {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'Kelvin Tse',
    description: 'Vehicle dynamics from scratch.',
    site: context.site ?? 'https://kktse.github.io',
    items: posts.map((post) => ({
      title: post.data.title,
      link: `/posts/${post.data.slug}/`,
      pubDate: post.data.date,
      description:
        post.data.description ??
        `${post.data.title} — vehicle dynamics, simulation and motorsport engineering by Kelvin Tse.`,
      content: post.rendered?.html,
      categories: post.data.categories,
    })),
    customData: '<language>en</language>',
  });
};
