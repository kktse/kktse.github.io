# Design

## Context

See proposal.md for motivation. The only repository deployment workflow already builds Astro with mise-managed Node, runs `check`, `build`, `verify:routes` and `verify:math`, and uploads `dist/`. Its filename still says `jekyll-deploy.yml`. Remote Pages settings have not been inspected; the GitHub CLI was unavailable during investigation.

The working tree retains `_posts/`, `_layouts/`, `_includes/`, root pages/assets, Gemfiles and the old Docker runner. Astro reads `src/content/posts/` and `public/`; it does not import those old sources. All 34 articles have explicit slugs and original date-prefixed filenames. The existing widget and Bokeh content are already incorporated into Astro.

Read-only asset comparison found 196 root `assets/` files: 195 match `public/assets/` byte-for-byte; only the obsolete `assets/css/style.scss` has no public counterpart. Root favicon and robots files also have maintained public copies. Recheck this parity immediately before removal because user changes may occur.

`verify:routes` reads `src/data/jekyll-baseline-inventory.json`. `verify:migration` separately compares a generated historical tree and supplies broader validation, but requires the retired build environment. The inventory contains 34 post mappings, the homepage/feed aliases, 196 public assets, heading and category records, plus obsolete temporary-path/runtime metadata.

The main OpenSpec inventory is empty. The pending migration change contains URL-continuity and site-delivery deltas; its task 5.7 (live deployment checks) is incomplete and its rollback scenario targets the old revision. Do not manufacture a completed cutover or silently rewrite those records.

## Goals / Non-Goals

**Goals:**
- One maintained source tree and a Node-only workflow from a fresh checkout.
- Independently retained compatibility expectations, not a manifest generated from the same output being checked.
- Safe one-PR cutover with a verified pre-cutover production recovery point.

**Non-Goals:**
- Removing literal `/jekyll/` URL segments, renaming articles, changing publication dates or discarding redirect history.
- Rewriting Git history, unrelated skills/settings, Bokeh/widget internals, theme design, analytics or Search Console configuration.
- Adding an Astro Docker replacement or changing hosting providers.

## Decisions

### 1. Retire the old generator, not published paths

Keep `src/pages/jekyll/[...path].ts`, `src/data/legacy-routes.ts`, `legacy-redirect-html.ts`, `/home.html` and the feed alias. They are Astro compatibility mechanisms. Keep the current source route directory to avoid an unnecessary catch-all routing refactor; the new documentation calls it legacy compatibility. Zero textual occurrences of "Jekyll" is not a valid acceptance criterion: public paths, historical records and this retirement proposal necessarily retain the term.

Alternative rejected: deleting the redirect namespace or recreating it under new URLs. This would break the exact indexed URLs it is supposed to preserve.

### 2. Replace the build baseline with a publication contract

Create `src/data/published-compatibility-inventory.json` by migrating the existing expectations without changing published paths. Retain route mappings, aliases, asset paths and useful integrity information, required heading IDs and category anchors. Remove machine-local paths and Ruby/build metadata. Record any already-approved heading exceptions explicitly; do not turn newly missing anchors into accepted exceptions.

Update `scripts/verify-published-routes.mjs` to use the new inventory and carry forward the useful static checks from `verify-migration.mjs`: missing/colliding destinations, direct redirect semantics and canonical targets, required assets, local document links/fragments, heading/category continuity, sitemap coverage/exclusions and feed destinations. Use the existing Node/parse5 tooling; share helpers only where it simplifies the verifier. Compare normalized routes and parsed attributes, not exact generated markup. External CDN availability remains a browser check, not a required network dependency in CI.

Keep the expected mappings independent of generated `dist/`; deriving the expectations from the same output would allow missing pages to pass. Add deterministic positive/negative cases for missing assets/anchors, wrong canonical targets, redirect chains, omitted sitemap entries and old feed links. Retain `verify:math` unchanged. Then remove `scripts/verify-migration.mjs`, its package command, the obsolete inventory and the documentation that requires a historical build.

Alternative rejected: simply deleting the broader verifier and keeping today's 40-line route check. That would lose meaningful regression coverage.

### 3. Delete only proven obsolete copies

Remove `_posts/`, `_layouts/`, `_includes/`, `_config.yml`, root `index.md`, `home.md`, `about.md`, `categories.html`, `404.html`, `assets/`, `robots.txt`, `favicon.ico`, `Gemfile`, `Gemfile.lock`, `Dockerfile`, and `docker-compose.yml`. Do not remove `public/assets/` or any source under `src/`. Stop development before bulk removal/configuration changes and restart afterward; the prior rename work exposed stale content-store state in a long-lived dev process.

Remove existing generated legacy caches only within confirmed repository paths; no global Ruby uninstall or deletion of unrelated user files. Remove the Ruby pin and obsolete coexistence exclusions/comments from `mise.toml`, `.gitignore`, `tsconfig.json` and `astro.config.mjs`. Keep Astro's explicit public directory if useful; it is not itself a legacy dependency.

### 4. One delivery workflow and truthful operational docs

Rename `.github/workflows/jekyll-deploy.yml` to `astro-deploy.yml`, not a second parallel workflow. Preserve its main-branch trigger, permissions, concurrency, analytics build environment, Node setup, verification and `dist/` artifact. Verify that repository Pages settings select Actions rather than branch-based generation.

Rewrite README setup and recovery instructions for normal Astro operations and the pre-cutover production rollback exception. Describe filename dates as historical authoring dates, with frontmatter authoritative. Move `src/data/content-baseline.md` into this change as an explicitly historical record during implementation (preserve its observations, do not present it as current proof). Leave existing OpenSpec change records untouched by this proposal; its task list includes an explicit specification-reconciliation step so the old recovery policy remains accurately represented. Archive historical changes only under the appropriate separately authorized workflow.

### 5. Prepare rollback before merge; verify production after deployment

Prepare the Astro cutover and source cleanup in one PR. Before merge, record the current known-good production revision, Pages source and workflow settings; document and test a recovery path using an isolated environment without modifying production. Recovery may require reverting the PR or redeploying that revision, restoring the prior Pages source if it changed, and using the historical toolchain if the old site requires it. Normal Astro development and deployment remain Node-only.

Run local and CI checks before merge. After the authorized deployment, verify public old and canonical URLs, feeds/sitemap and interactive model/WASM/CDN requests. An unavailable public Astro deployment is not a prerequisite for source deletion in the PR; if post-deployment evidence or deployment access is unavailable, leave the production verification task incomplete and report it. Do not mark migration task 5.7 complete solely from local checks.

The maintenance policy replaces the requirement to keep the old site locally buildable in the current tree, but retains its pre-cutover revision in Git as an initial recovery option. Integrate the original delivery/continuity specs before this maintenance change and explicitly reconcile the historical recovery scenario through the appropriate OpenSpec update/sync workflow when implementation is authorized. Do not delete historical documents to resolve a requirements conflict.

## Risks / Trade-offs

- Lost asset or unique source during deletion -> recheck byte parity and ownership before removal; retain public assets and converted interactive content.
- Weaker checks after baseline retirement -> migrate contract assertions first and prove their failure cases before deleting the old verifier.
- Stale dev content after file changes -> restart the dev process and force a one-time content rebuild if needed; never suppress missing-slug validation.
- Literal-reference cleanup breaks published links -> allow exact legacy URL strings and historical records; scan active runtime/tooling separately.
- Workflow rename or remote settings differ -> inspect Pages Actions settings and observe a real deployment; do not infer from local YAML alone.
- Pre-cutover production revision or rollback path is not established -> block merge until the revision, prior Pages settings and tested recovery procedure are recorded; do not require an already-deployed Astro revision.

## Migration Plan

1. Record the current production revision and Pages settings, test the pre-cutover rollback procedure in isolation, and document the explicit successor recovery policy.
2. Freeze current routes, publication metadata, article/heading structure, asset parity and discovery output for comparison; migrate the independent compatibility inventory and verifier first.
3. Retire old sources/tooling, rename the single workflow and update active documentation/configuration. Preserve historical data and every compatibility URL.
4. From a clean Node-only environment, run `npm ci`, `npm run check`, `npm run build -- --force`, `npm run verify:routes` and `npm run verify:math`, plus deterministic verifier regression cases. No Ruby command or baseline directory is part of the accepted workflow.
5. Compare the 34 articles' canonical paths, dates, heading IDs, links and media references; verify both feeds and sitemap. Browser-check ordinary/math posts, category fragments, a fragment-bearing legacy redirect, the footprint sliders/models and representative Bokeh pages in WebKit without Playwright/Chromium.
6. Merge and deploy through the authorized normal Pages workflow, then verify public behavior and retain evidence. If deployment regresses, revert the PR or restore the identified pre-cutover production revision and its Pages source/workflow settings; that exceptional rollback may require the historical toolchain. Leave public verification incomplete until it has actually passed.
