// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

/*
 * Canonical pages are directory-style clean URLs (`/posts/<slug>/`).
 * Legacy Jekyll documents keep their `.html` paths and are emitted as
 * immediate meta-refresh pages; neither those nor XML endpoints belong in
 * the sitemap. RSS is served at /rss.xml by a static endpoint. The 404 page
 * is a response document, not a publishable page, so it is excluded too.
 */
/** @param {string} page */
const isCanonicalPage = (page) => {
  const { pathname } = new URL(page);
  if (pathname === '/404' || pathname === '/404/') return false;
  return !pathname.endsWith('.html') && !pathname.endsWith('.xml');
};

export default defineConfig({
  site: 'https://kktse.github.io',
  output: 'static',
  publicDir: 'public',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    preact(),
    sitemap({
      filter: isCanonicalPage,
      // Each sitemap can hold at most 50,000 URLs. The verifier requires the
      // compatibility index to reference every generated sitemap chunk.
      entryLimit: 50_000,
    }),
  ],
  /*
   * Astro 7 defaults to the Sätteri processor, which runs no remark or rehype
   * plugins. Opt into the unified pipeline explicitly so `.md` and (through the
   * MDX integration's inherited config) `.mdx` both parse `$…$` and `$$…$$`
   * with remark-math and typeset them at build time with rehype-katex. The
   * output is plain HTML plus MathML: no client-side KaTeX bundle, stylesheet
   * or auto-render pass is needed.
   *
   * rehype-katex emits a `katex-error` span for malformed TeX instead of
   * failing the build, so invalid formulas remain visible (and inspectable)
   * in verification builds rather than disappearing silently.
   */
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
});
