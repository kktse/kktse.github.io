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
  /*
   * Jekyll remains the deployable baseline until the rendered comparison is
   * complete, so its sources stay at the repository root. Astro's public
   * directory must never be the repository root: doing that would copy
   * `_posts/`, `_layouts/`, `_includes/` and `_site/` into `dist/` and
   * publish the Jekyll baseline alongside the Astro build. Static files that
   * must keep their existing URLs are served from `public/`.
   */
  publicDir: 'public',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    preact(),
    sitemap({
      filter: isCanonicalPage,
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
  vite: {
    server: {
      watch: {
        /*
         * Ignore only Jekyll's generated state. Its authored sources stay
         * watched: a content loader may read the baseline directly while the
         * two stacks coexist, and ignoring generated output avoids reloading
         * the Astro server for files that belong to the Jekyll build.
         */
        ignored: [
          '**/_site/**',
          '**/.jekyll-cache/**',
          '**/.sass-cache/**',
          '**/.bundle/**',
        ],
      },
    },
  },
});
