# Spec Delta

## Purpose

Preserve the blog's existing interactive technical visualizations and support new interactive components embedded in articles.

## ADDED Requirements

### Requirement: Existing chart interactions remain usable
Articles SHALL preserve the existing Bokeh visualizations and their user-visible interactions, data and layout, including when multiple charts appear on a single page.

#### Scenario: Reader interacts with an existing chart
- **WHEN** a reader opens an article containing Bokeh charts and uses the available chart tools
- **THEN** the charts render and their supported interactions respond without one chart preventing another from working.

### Requirement: Tire footprint widget remains functional
The tire footprint article SHALL load the existing widget and the model, WASM and other assets it requires at runtime, retaining its controls and calculated output.

#### Scenario: Reader changes a widget parameter
- **WHEN** the widget loads and the reader changes an available input
- **THEN** the widget responds with the corresponding updated visualization and its required assets load successfully.

### Requirement: MDX articles support Preact islands
Authors SHALL be able to embed interactive Preact components in MDX articles with client-side hydration, while ordinary article content remains available as static HTML. Components SHALL be authored against native Preact APIs; no React compatibility layer is provided.

#### Scenario: Interactive component in an article
- **WHEN** an MDX article includes a Preact component configured for client hydration
- **THEN** the article renders as static content and the component becomes interactive at its configured hydration point.
