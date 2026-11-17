import type { APIRoute } from 'astro';
import { renderLegacyRedirect } from '../data/legacy-redirect-html';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://kktse.github.io')).origin;
  return new Response(renderLegacyRedirect('/', origin), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
