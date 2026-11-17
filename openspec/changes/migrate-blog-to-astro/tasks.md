# Tasks

## 1. Baseline and migration inventory

- [x] 1.1 Build the existing Jekyll site and inventory actual published page URLs, redirects, posts, category anchors, feed, sitemap and public asset paths; record the known-good revision for rollback.
- [x] 1.2 Inventory Liquid includes, `post_url`/`site.url` references, kramdown attributes, math, media, heading IDs and all interactive posts; capture representative rendered output and current chart/widget behavior.
- [x] 1.3 Assign explicit unique article slugs and create an old-to-new mapping from the actual Jekyll output, including date/slug exceptions and existing redirect destinations.

## 2. Astro foundation and presentation

- [x] 2.1 Add Astro static build tooling, official MDX and React integrations, dependencies and local dev/build/preview commands while retaining the Jekyll baseline until comparison is complete.
- [x] 2.1a Pin a supported Node version using repository-local mise configuration and use the same version in CI; document dependency installation, development server startup and shutdown, and production-build preview.
- [x] 2.2 Define the post content collection, front-matter schema, explicit slug validation and static `/posts/<slug>/` routes; fail on duplicate routes.
- [x] 2.3 Build a responsive reading-first shell with accessible keyboard navigation, footer and typography, supporting narrow screens and wide figures.
- [x] 2.4 Implement the home page with an introduction and recent-article list, chronological archive, category pages and anchors, about page and 404 page.
- [x] 2.5 Implement article rendering and metadata including dates, authors, categories and modified dates where present.

## 3. Content and interactive migration

- [x] 3.1 Migrate all published articles and metadata; convert Liquid, kramdown attributes, internal links, raw HTML and media references without changing substantive content.
- [x] 3.2 Preserve public image, video and widget asset URLs; implement and verify existing math rendering and heading IDs, recording any fragment exceptions.
- [x] 3.3 Integrate all Bokeh fragments, preserving data, dependencies and chart behavior, including posts with multiple charts; resolve any observed CDN failures compatibly.
- [x] 3.4 Integrate the existing ONNX widget without rewriting it, preserving its mount point, CSS, module, models, WASM and expected public paths.
- [x] 3.5 Verify MDX can import and hydrate a representative React component at its intended client directive without making ordinary article content dependent on React.

## 4. URLs, metadata and compatibility

- [x] 4.1 Generate direct immediate-meta-refresh pages with fallback links at every changed inventoried legacy URL, retaining unchanged routes and detecting collisions, missing targets and chains.
- [x] 4.2 Generate canonical metadata, article metadata, sitemap and RSS using new canonical paths, and update internal links while preserving category anchors and legacy asset URLs.
- [x] 4.3 Preserve configured production analytics without loading them in local development or preview.
- [x] 4.4 Add repeatable checks comparing the baseline URL inventory to canonical pages and redirects, and checking slug uniqueness, route collisions, redirect destinations and internal links.

## 5. Local verification and deployment

- [x] 5.1 Run a production build and local preview; compare representative Jekyll and Astro pages for text, dates, headings, equations, tables, images, video and kramdown-sensitive markup.
- [x] 5.1a Start and stop the local development server using the documented mise and npm setup, then open the production preview in a browser and verify it does not load production analytics.
- [x] 5.2 Browser-test every interactive article, including Bokeh interactions and multiple charts, and exercise ONNX controls while checking model/WASM/JS/CSS network requests and console errors.
- [x] 5.3 Verify desktop and mobile layouts, keyboard navigation, focus, alt text and chart overflow; follow representative old URLs and fragment links in a browser.
- [x] 5.4 Check the sitemap, feed, canonical tags, local analytics exclusion and every mapped legacy URL in the production preview.
- [x] 5.5 Replace the GitHub Pages workflow's Jekyll build with the Astro static build and retain the Pages artifact/deployment flow and hostname.
- [x] 5.6 Document local commands, migration checks, redirect limitations and the procedure to redeploy the known-good Jekyll revision.
- [ ] 5.7 After deployment, verify representative old and new URLs, redirect pages, sitemap, feed, widget requests and interactive behavior on GitHub Pages; submit or check the sitemap and monitor Search Console where access is available.
