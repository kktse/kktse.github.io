# Proposal

## Why

The Jekyll blog combines technical articles with client-side visualizations, but its current templates and embedded scripts make interactive authoring and a cohesive redesign cumbersome. Astro provides static publishing with Markdown, MDX and selectively hydrated native Preact components while retaining GitHub Pages.

## What Changes

- Replace the Jekyll build with an Astro static site and a reading-first responsive redesign of the home page, archive, categories, articles, about page and 404 page.
- Migrate existing content, metadata, math, media, Bokeh plots and the prebuilt React/ONNX widget without rewriting the interactive applications.
- Support Markdown and MDX articles and native Preact islands for future interactive work, without a React compatibility layer.
- **BREAKING**: Canonical article paths move to `/posts/<stable-slug>/`; retain each published old path as a direct static redirect to its corresponding new page on the same `https://kktse.github.io` host. GitHub Pages serves these redirect pages as HTTP 200, not 301.
- Preserve asset paths and existing category and article anchors where feasible; rebuild RSS, sitemap, canonical metadata and production analytics.
- Replace the GitHub Actions build while keeping GitHub Pages deployment; provide local preview, migration checks and a rollback procedure.

Out of scope: custom domain or hosting migration, rewrites of existing interactive applications, search, accounts, comments, portfolio expansion and editorial rewrites beyond migration needs.

## Capabilities

### New Capabilities

- `blog-publishing`: Static authoring, rendering, navigation, metadata and reading-first presentation of blog content.
- `interactive-articles`: Existing interactive content and authoring of new MDX/Preact islands within articles.
- `url-continuity`: Stable canonical routes, legacy URL redirects and search discovery metadata.
- `site-delivery`: Local verification and static deployment to GitHub Pages.

### Modified Capabilities

None; the project has no existing OpenSpec capabilities.

## Impact

The change affects `_posts/`, `_layouts/`, `_includes/`, `_config.yml`, public assets, the Jekyll Ruby tooling and `.github/workflows/jekyll-deploy.yml`. Existing external links, embeds, asset requests and search indexing require explicit compatibility verification. Node/Astro dependencies and a static build replace Ruby/Jekyll for production publishing.
