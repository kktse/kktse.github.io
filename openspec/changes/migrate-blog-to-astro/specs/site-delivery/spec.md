# Spec Delta

## Purpose

Build, preview and deploy the static blog reliably to GitHub Pages while providing a verifiable migration and rollback path.

## ADDED Requirements

### Requirement: Local production verification
A maintainer SHALL be able to install dependencies, run the site locally, build the production site and preview that build using documented commands.

#### Scenario: Maintainer previews a production build
- **WHEN** the maintainer follows the documented build and preview commands
- **THEN** the resulting site serves its canonical pages, legacy redirect pages and required static assets locally.

#### Scenario: Maintainer starts and stops the development server
- **WHEN** a maintainer installs the documented runtime and dependencies and runs the documented development command
- **THEN** the local site is available in a browser and the maintainer can stop the server using the documented procedure.

### Requirement: Static GitHub Pages deployment
The default branch deployment workflow SHALL build the static site and publish its generated output to GitHub Pages at the existing hostname without requiring a server runtime.

#### Scenario: Default branch deployment
- **WHEN** the deployment workflow runs successfully for the default branch
- **THEN** GitHub Pages serves the generated blog at `https://kktse.github.io`.

### Requirement: Migration verification and rollback
The migration SHALL verify the legacy URL inventory, canonical destinations, representative rendered content and every interactive article before cutover, and SHALL document how to redeploy the known-good previous site. Deployed redirects and interactive asset requests SHALL be checked on GitHub Pages after cutover.

#### Scenario: Invalid legacy mapping detected before cutover
- **WHEN** verification finds an inventoried old page with no appropriate destination
- **THEN** the migration is not considered ready for deployment until the mapping is corrected.

#### Scenario: Cutover regression requires the prior site
- **WHEN** a regression in the initial Astro cutover requires restoring the pre-cutover production site
- **THEN** a maintainer can follow the documented procedure to redeploy the known-good Jekyll revision, including its historical toolchain when necessary.

#### Scenario: Later Astro regression requires recovery
- **WHEN** a production regression occurs after a known-good Astro deployment is established
- **THEN** a maintainer can follow the documented procedure to restore a known-good Astro revision using the normal Node-based delivery workflow.

### Requirement: Production analytics
Existing configured analytics SHALL continue to be loaded on production pages and SHALL NOT be unintentionally triggered by local development or preview.

#### Scenario: Local preview
- **WHEN** a maintainer previews the site locally
- **THEN** production analytics are not loaded.
