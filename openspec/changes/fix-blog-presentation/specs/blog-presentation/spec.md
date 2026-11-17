# Spec Delta

## Purpose

Provide a consistent, readable light-themed blog presentation that remains stable when an article contains an interactive widget.

## ADDED Requirements

### Requirement: Consistent light theme
The site SHALL use a light appearance with page background `#fdfdfd` across the home page, articles and other site pages regardless of the reader's system color preference. Normal text and its actual background SHALL have at least 4.5:1 contrast; large text SHALL have at least 3:1 contrast.

#### Scenario: Reader prefers a dark system theme
- **WHEN** a reader whose system prefers dark mode opens the home page or an article
- **THEN** the site retains the same light background and readable foreground colors used with a light system preference.

### Requirement: Shared header is unaffected by article widgets
The site SHALL present the same navigation and brand header on the home page and article pages, apart from the intentional current-page navigation state. Embedded widget styles SHALL NOT change the surrounding header's layout, typography or colors.

#### Scenario: Reader opens the contact-patch article
- **WHEN** the contact-patch widget loads in an article
- **THEN** the surrounding site header retains the same layout and styling as the shared header on the home page at the same viewport width.

### Requirement: Aligned article reading column
The article title and metadata, their divider, and ordinary post content SHALL share the left and right boundaries of the centered article column. At narrow widths the column SHALL fit within the viewport without page-level horizontal overflow; intentional wide media SHALL remain centered and usable.

#### Scenario: Reader views an article on desktop
- **WHEN** a reader views an article with ordinary prose at desktop width
- **THEN** its content column aligns with both ends of the divider under its title and metadata.

#### Scenario: Reader views wide content on mobile
- **WHEN** an article includes a wide figure, chart, table or equation on a narrow screen
- **THEN** the reading column remains aligned and the wide content remains accessible without causing page-level horizontal scrolling.

### Requirement: Contact-patch widget remains usable
Presentation changes SHALL preserve the contact-patch widget's controls, canvas output and model and WASM asset loading. The widget SHALL be keyboard accessible and usable at desktop and mobile widths without nested scrolling.

#### Scenario: Reader changes a widget input
- **WHEN** a reader adjusts an available widget slider
- **THEN** the visualization updates and its required assets load successfully without changing the surrounding site theme or header.
