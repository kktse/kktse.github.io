# Proposal

## Why

The migrated contact-patch article can alter the shared site header and colors through its embedded widget, while article prose does not align with the title divider. The site also follows the operating system's dark preference even though the desired appearance is the former Jekyll light background.

## What Changes

- Use the Jekyll page background `#fdfdfd` and a light-only theme across the site, independent of system color preference.
- Prevent the contact-patch widget's global styles from changing site-wide header layout, colors or typography while keeping the widget functional.
- Align the post title, metadata, divider and reading column to the same article width; retain responsive layouts and intentional wide media.
- Improve contrast and visual continuity between article title and body; verify representative pages, including the contact-patch widget, at desktop and mobile widths.

Out of scope: a new visual redesign, a theme toggle, changes to post content or routes, and rewriting the interactive application.

## Capabilities

### New Capabilities

- `blog-presentation`: Consistent light-mode site chrome, accessible article presentation and isolation of embedded widget styles.

### Modified Capabilities

None in the durable OpenSpec inventory. This change builds on `migrate-blog-to-astro`, whose in-progress `blog-publishing` and `interactive-articles` specs already establish responsive reading and interactive behavior; archive the migration first and reconcile these additions with those capabilities when syncing specs.

## Impact

Primarily affects `src/styles/site.css`, `src/layouts/Base.astro` and the contact-patch widget integration. The bundled widget currently injects Material UI `CssBaseline` global body styles and loads a universal `box-sizing: content-box` reset; isolation must preserve its runtime models, WASM and interactions. The existing migration's deployment verification remains a separate pending task.
