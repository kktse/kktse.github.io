import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderLegacyRedirect } from '../../data/legacy-redirect-html';
import {
  assertLegacyRoutes,
  legacyPostRoutes,
} from '../../data/legacy-routes';

export const prerender = true;

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  const slugs = new Set(posts.map((post) => post.data.slug));
  assertLegacyRoutes(legacyPostRoutes, slugs);

  return legacyPostRoutes.map((route) => ({
    params: { path: route.from.replace(/^\/jekyll\//, '') },
    props: { target: route.to },
  }));
};

export const GET: APIRoute = ({ props, site }) => {
  const origin = (site ?? new URL('https://kktse.github.io')).origin;
  return new Response(renderLegacyRedirect(String(props.target), origin), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
