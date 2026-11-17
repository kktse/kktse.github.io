# Spec Delta

## Purpose

Maintain a single authoritative Astro site with reproducible Node-only operations, independently verified published compatibility, and recoverable retirement of the former source stack.

## ADDED Requirements

### Requirement: Single maintained site source
The repository SHALL maintain article content, templates and public files only in the Astro source structure. Normal installation, development, verification and deployment SHALL NOT require Ruby, Bundler, the retired site generator, its theme, or its container runner.

#### Scenario: Fresh maintainer environment
- **WHEN** a maintainer follows the documented setup with the pinned Node runtime and no Ruby installation
- **THEN** dependency installation, development, production build and required verification succeed using only the maintained site sources.

#### Scenario: Author locates an existing article
- **WHEN** an author opens a migrated article after retirement
- **THEN** only its maintained Astro content copy exists, with its original date-prefixed filename, publication metadata and explicit URL slug preserved.

### Requirement: Baseline-independent publication verification
Required output verification SHALL run from a fresh checkout without a historical site build or temporary baseline directory. It SHALL use retained published compatibility expectations and fail for missing destinations, invalid redirects, lost required assets or anchors, broken local links, or inconsistent canonical, sitemap and feed references.

#### Scenario: Published redirect target disappears
- **WHEN** the built output omits a destination for a retained legacy URL
- **THEN** verification fails with the affected source URL and destination.

#### Scenario: Canonical discovery regresses
- **WHEN** the sitemap includes a redirect or omits a canonical article, or a feed links to a retired article URL
- **THEN** verification fails before the artifact is eligible for deployment.

#### Scenario: Required media or anchor disappears
- **WHEN** an inventoried public asset or required category or article anchor is missing
- **THEN** verification identifies the missing resource or fragment rather than silently updating its expectations.

### Requirement: Retired tooling does not retire published URLs
Retirement SHALL preserve all inventoried old article paths, direct canonical destinations, public asset URLs, category fragments, the homepage alias, feed alias and `/sitemap.xml` discovery URL. Literal legacy path segments SHALL remain permitted compatibility data. The redirect mechanism SHALL retain its immediate refresh, canonical target and visible fallback link.

#### Scenario: Reader follows an old article link
- **WHEN** a reader requests a retained `/jekyll/update/...html` URL after cleanup
- **THEN** Astro serves the direct redirect to the same `/posts/<slug>/` destination, without invoking the retired toolchain.

#### Scenario: Reader uses an existing feed or homepage alias
- **WHEN** a reader requests `/feed.xml` or `/home.html`
- **THEN** the feed alias still serves the feed and the homepage alias still redirects to `/`.

#### Scenario: Crawler requests the existing sitemap URL
- **WHEN** a crawler requests `/sitemap.xml`
- **THEN** it receives a valid XML sitemap index identifying the generated canonical sitemap files, without including legacy redirects as canonical articles.

### Requirement: Cutover has verification and recovery evidence
Before merging the cutover PR, maintainers SHALL validate the Astro artifact and identify the known-good current production revision and a tested rollback path. Public Astro deployment checks SHALL occur after deployment; incomplete production checks SHALL NOT be marked complete solely because local checks pass.

#### Scenario: Public Astro deployment is not yet available
- **WHEN** local and CI checks pass before the first Astro deployment
- **THEN** the cutover MAY proceed in one PR without requiring prior public Astro deployment evidence, provided the production recovery point and rollback path are established.

#### Scenario: Post-deployment evidence is unavailable
- **WHEN** the maintainer cannot verify public old and new URLs, discovery documents, and interactive asset loading after deployment
- **THEN** the production verification task remains incomplete and the missing evidence is reported.

#### Scenario: Cutover requires recovery
- **WHEN** a production regression requires reverting the cutover
- **THEN** the documented recovery procedure restores the identified known-good pre-cutover production revision, including its historical toolchain if required.

### Requirement: Active operations describe only the maintained site
Active setup, verification and deployment instructions SHALL describe the Astro site. Recovery instructions SHALL distinguish normal Astro recovery from the pre-cutover rollback exception. Historical OpenSpec records and preserved compatibility URLs SHALL be distinguished from active instructions. GitHub Pages SHALL receive only the Astro production artifact from the maintained deployment workflow.

#### Scenario: Maintainer deploys the cleanup
- **WHEN** the deployment workflow runs for the default branch
- **THEN** it installs the pinned Node environment, runs the required checks and uploads only the Astro build output.

#### Scenario: Maintainer follows current documentation
- **WHEN** a maintainer reads the current development or recovery guide
- **THEN** normal Astro setup and verification do not require the retired runtime, while the documented pre-cutover rollback may require its historical toolchain.
