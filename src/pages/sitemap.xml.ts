import type { APIRoute } from 'astro';

export const prerender = true;

/*
 * Jekyll published its sitemap at /sitemap.xml and crawlers still request that
 * URL. Keep it serving a sitemap index so discovery never depends on the
 * generator behind the site.
 *
 * A sitemap index may only list URL sets, never another index, so this
 * compatibility document points straight at the generated sitemap file
 * instead of at /sitemap-index.xml. The origin comes from Astro's configured
 * `site`, never from the request, so a local development server can never
 * publish a localhost URL.
 *
 * `entryLimit` in `astro.config.mjs` is the sitemaps.org maximum of 50,000
 * URLs per sitemap. The compatibility inventory pins the first child URL, and
 * verification fails if a larger site generates additional chunks that this
 * index does not reference.
 */
const DEFAULT_ORIGIN = 'https://kktse.github.io';

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL(DEFAULT_ORIGIN)).origin;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${origin}/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
