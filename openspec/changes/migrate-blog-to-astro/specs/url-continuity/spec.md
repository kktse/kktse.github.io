# Spec Delta

## Purpose

Maintain access to existing published blog links while moving articles to stable, discoverable canonical URLs on the same hostname.

## ADDED Requirements

### Requirement: Stable canonical article URLs
Each article SHALL have a unique, explicitly assigned stable slug and canonical URL under `https://kktse.github.io/posts/<slug>/`. Changing an article title SHALL NOT implicitly change its canonical URL.

#### Scenario: Article title changes
- **WHEN** an author edits an article title without changing its assigned slug
- **THEN** its canonical URL remains unchanged.

### Requirement: Legacy URL continuity
Each inventoried legacy page whose URL changes SHALL resolve directly to its corresponding new canonical destination via an immediate HTML meta refresh and a visible fallback link. Redirect documents SHALL remain crawlable and SHALL NOT rely solely on JavaScript. Paths that already identify the intended destination SHALL remain usable.

#### Scenario: Reader follows an old article link
- **WHEN** a reader requests an inventoried old article URL
- **THEN** the returned page immediately directs them to the corresponding new article and provides a fallback link to it.

#### Scenario: Invalid redirect mapping
- **WHEN** a mapped destination is missing, collides with another generated route or introduces a redirect chain
- **THEN** the build or migration verification fails rather than publishing the invalid mapping.

### Requirement: Preserve existing links and assets
The site SHALL retain existing public media and widget asset URLs, `/about/`, `/categories/` and existing category anchors. It SHALL preserve article heading IDs where practical and document and verify exceptions and fragment behavior.

#### Scenario: Existing category or asset link
- **WHEN** a reader follows an existing category-anchor or public asset link
- **THEN** the corresponding category or asset remains available at that link.

### Requirement: Search discovery uses canonical destinations
Canonical metadata, internal article links, the sitemap and RSS SHALL identify new canonical article URLs; redirect pages SHALL NOT be presented as canonical articles in the sitemap.

#### Scenario: Crawler discovers a migrated article
- **WHEN** a crawler reads the new article and sitemap
- **THEN** both identify the article's new canonical URL on the existing hostname.
