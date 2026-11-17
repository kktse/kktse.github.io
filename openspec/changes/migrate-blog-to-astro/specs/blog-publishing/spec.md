# Spec Delta

## Purpose

Provide a readable, accessible static blog that preserves the existing technical articles and supports ongoing Markdown and MDX publishing.

## ADDED Requirements

### Requirement: Reading-first site navigation
The site SHALL provide responsive home, chronological archive, categories, article, about and not-found pages, with navigation usable by keyboard and on narrow screens. The home page SHALL provide a brief introduction, a date-ordered list of recent articles and access to the complete archive.

#### Scenario: Reader discovers an article
- **WHEN** a reader visits the home or category page
- **THEN** they can navigate to the archive or a relevant article using accessible links.

#### Scenario: Reader uses a narrow viewport
- **WHEN** a reader opens a page on a narrow screen
- **THEN** navigation, article text and media remain usable without page-level horizontal overflow caused by the site layout.

### Requirement: Existing articles retain content and metadata
The site SHALL render every previously published article with its content, publication date, categories, author and modified date where present, along with its existing media and math. The migration SHALL preserve article heading identifiers where practical and explicitly account for exceptions.

#### Scenario: Reader opens an article containing technical content
- **WHEN** an existing article with equations, figures, tables or video is opened
- **THEN** its technical content and media render correctly alongside the original article metadata.

### Requirement: Markdown and MDX authoring
The publishing system SHALL accept Markdown and MDX articles with front matter, stable slugs and the metadata necessary to render listings and article pages.

#### Scenario: Author publishes a new article
- **WHEN** an author adds a valid Markdown or MDX article with a unique slug and required metadata
- **THEN** the static build produces an article page and includes it in relevant listings.

#### Scenario: Duplicate slug
- **WHEN** two articles resolve to the same canonical slug
- **THEN** the build fails rather than silently overwriting a page.
