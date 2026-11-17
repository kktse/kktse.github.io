# Design

## Context

The Jekyll configuration uses a custom dated permalink, kramdown/GFM, Minima, RSS, sitemap and redirects. Posts mix Liquid includes, `site.url`, `post_url`, raw HTML, kramdown attributes, math and static media. The layouts supply article metadata, categories, MathJax/KaTeX, analytics and navigation. Existing Bokeh fragments in `_includes/` are embedded in several posts; the 2024 tire article loads a prebuilt React/ONNX bundle and models under `/assets/dist/`. GitHub Actions currently builds Jekyll and deploys to Pages. Some front-matter dates differ from filename dates, so old paths must be captured from a Jekyll build rather than inferred.

## Goals / Non-Goals

**Goals:**
- Generate a static reading-first site, support `.md` and `.mdx` with selectively hydrated native Preact islands, and retain the same public hostname.
- Preserve published content, interactive behavior, relevant metadata and an explicit direct mapping of old URLs to new canonical pages.
- Make local production preview, parity checks and rollback practical before deployment cutover.

**Non-Goals:**
- A server runtime, custom domain, new host, reimplementation of existing interactive apps, or an unrelated content rewrite.
- A guarantee of unchanged search rank, instant reindexing, or HTTP 301 redirects from GitHub Pages.

## Decisions

### Static Astro build and content

Use Astro with the official MDX and Preact integrations. Store posts in a content collection with explicitly assigned stable slugs, publication/modified dates, categories and original metadata. Build `/posts/<slug>/` and reject duplicate slugs or routes. Preserve Markdown for articles that do not need components, and use MDX where component authoring is useful. Convert Liquid tags, kramdown attributes and HTML deliberately rather than renaming files. Verify math delimiters and heading IDs in rendered output. Preact components render to HTML by default; use an appropriate `client:*` directive when interactivity is required, and `client:only="preact"` only for components that cannot render during the build. Author new components against native Preact APIs; do not add a `preact/compat` React compatibility layer. The existing prebuilt React/ONNX widget remains an opaque static bundle loaded at its public paths and is not converted into a component.

### Reading-first presentation

Use Astro layouts and CSS for a responsive shell, brief personal introduction with selected articles and archive access, chronological archive, categories, article pages, about and 404. Preserve author and modified-date metadata, category anchors, accessible navigation and wide figures/charts alongside a readable text measure. No portfolio showcase or search is required.

### Interactive compatibility

Copy the widget asset tree under the same `/assets/dist/...` paths and load its existing module and CSS on the relevant post; preserve model and WASM fetches. Keep Bokeh fragment data and pinned script dependencies intact, preferably by build-time inlining to preserve the current page behavior. If isolation is needed, check sizing, scrolling, accessibility, initialization and interactions before choosing it. Verify all interactive posts, particularly multiple charts on one page and third-party CDN availability. The repository contains a prebuilt widget; source availability must be established before any future rewrite.

### URL continuity and discovery

First build Jekyll and inventory its actual published paths, redirects, category anchors, assets and relevant heading IDs. Maintain an explicit old-to-new route mapping, including current redirect targets and any exceptional dates or slugs. Generate an HTML document at each old path with immediate meta refresh to the corresponding new page and a visible fallback link. Prevent collisions, missing targets and redirect chains; preserve paths that already match the desired destination. GitHub Pages returns HTTP 200 for these documents: immediate meta refresh is a Google permanent-redirect signal, not an HTTP 301 or a universal crawler guarantee. Test fragments rather than assuming they survive; preserve existing article heading IDs and category anchors where practical. Canonicals, internal links, feed entries and sitemap use only new canonical destinations. Preserve legacy asset URLs to avoid unnecessary redirects.

### Local environment and servers

Pin a supported exact Node version in repository-local mise configuration and use the same version in CI. Document `mise install`, `npm ci`, and npm scripts to start and stop the Astro development server. Provide a separate production build and preview server for route, redirect, asset, and browser verification; local preview must not load production analytics. During migration, run the Jekyll baseline using mise-managed Ruby and Bundler or the existing Docker setup; Ruby does not need to remain in the Astro runtime configuration after cutover.

### Build, cutover and rollback

Develop Astro alongside a usable Jekyll baseline; compare production builds before cutover. Replace the Actions Ruby build with Node/Astro, upload the generated static output and retain the existing Pages deployment pattern and same hostname. Preserve production-only analytics. Document local install/dev/build/preview, verification commands and how to redeploy the known-good Jekyll revision. Check the deployed site and Search Console after release; do not claim indexing success from local tests.

## Risks / Trade-offs

- Static redirect pages provide weaker HTTP semantics than 301/308; document the limitation and verify actual hosting behavior.
- Remark/MDX and kramdown differ around raw HTML, math, attributes and headings; compare rendered content, not only build success.
- Bokeh dependencies are pinned to external CDN versions; a currently unavailable dependency may be an existing failure and requires an explicit compatible remedy, not an assumption of migration success.
- The ONNX bundle uses root-relative asset paths and browser APIs; verify real model/WASM requests and interaction in production preview and deployed Pages.
- A redesign and URL migration can affect discovery and indexing; direct mappings, canonicals, sitemap and monitoring mitigate but cannot eliminate that risk.
