# Proposal

## Why

The repository deploys Astro but still carries a second, obsolete source tree and a Ruby-based comparison workflow. Retiring that baseline makes Astro the sole maintained site without breaking published links or losing regression checks.

## What Changes

- Remove the old root posts, templates, pages, theme sources, duplicate public assets, Ruby dependencies and container runner; retain `src/` and `public/` as the maintained site sources.
- Rename the existing Astro Pages workflow to `astro-deploy.yml`; retain Node managed by mise and deployment of `dist/` only.
- Replace baseline-build comparison with an independently maintained published-compatibility inventory and Node-only output verification; preserve URL, canonical, sitemap, feed, asset and anchor coverage.
- Preserve every published `/jekyll/update/...html` redirect, `/home.html`, `/feed.xml`, existing asset URL, article slug and publication date. These are compatibility contracts, not an old runtime.
- Remove obsolete coexistence configuration and active baseline instructions. Keep immutable URL strings and historical OpenSpec records; relocate historical baseline notes out of active site data.
- **BREAKING (maintainer tooling only):** retire `npm run verify:migration`, Ruby/Bundler setup and the old container commands; document the replacement checks and recovery procedure.
- Prepare and validate the Astro cutover and source retirement in one PR. Before merge, identify the current known-good production revision and a tested rollback path; after deployment, verify public compatibility and interactive behavior before marking the migration complete.

## Capabilities

### New Capabilities

- `astro-repository-maintenance`: A single Astro source/toolchain, baseline-independent compatibility verification, and retirement/recovery safeguards for maintaining the repository.

### Modified Capabilities

None in the current main spec inventory, which is empty. The pending `migrate-blog-to-astro` change owns `site-delivery` and `url-continuity`; their public URL requirements remain constraints. Reconcile its recovery requirement with the one-PR cutover: initial rollback can restore the pre-cutover production revision, including its historical toolchain, while normal Astro operations remain Node-only.

## Impact

Affected areas include root legacy files and `assets/`, `mise.toml`, `.gitignore`, `tsconfig.json`, `astro.config.mjs`, `.github/workflows/jekyll-deploy.yml`, package scripts, compatibility data/verifiers, README and historical baseline documentation. No article text, filename dates, clean URL scheme, font choices, math renderer, Preact integration or interactive application rewrite is included. Historical Git objects and unrelated local tooling are outside scope. Repository Pages settings and successful public deployment have not been verified in this planning session.
