# Design

## Context

`migrate-blog-to-astro` is in progress and provides the shared site shell, article layout and static contact-patch widget. Both home and post pages use `Header.astro` via `Base.astro`. The contact-patch post loads a prebuilt widget whose stylesheet applies a global `box-sizing: content-box` reset, and whose React bundle mounts Material UI `CssBaseline`, including global body styling. These rules can interfere with the shared page; the precise computed-style cascade should be verified during implementation. Jekyll's generated classic-theme body used `background-color: #fdfdfd` and `color: #111111`.

In `src/styles/site.css`, the article shell is centered with a maximum width of 48rem. Its header and divider span that shell, but `.post-content` is separately limited to 68ch and remains left-aligned. Wide media uses its own breakout calculation.

## Goals / Non-Goals

**Goals:**
- Ensure the site remains light in either system color preference, with Jekyll's page background and readable text.
- Give the article header, divider and normal body content shared boundaries, while retaining responsive wide figures and interactive content.
- Prevent widget styles from changing the surrounding page and preserve widget behavior and asset paths.

**Non-Goals:**
- Rebuilding or retraining the widget, changing article content or public article URLs, or offering a theme selector.
- Replacing chart libraries or redesigning the wider site beyond the reported presentation issues.

## Decisions

### Light palette

Set the site background to `#fdfdfd`; use the former Jekyll body color `#111111` as the default text reference. Remove automatic dark palette overrides and dark browser/theme-color metadata, setting the browser color scheme to light. Retain accent and secondary surfaces where appropriate, but check actual rendered text/background combinations: at least 4.5:1 for normal text and 3:1 for large text. Do not rely on a user's OS color setting or a JavaScript toggle.

### Article alignment

Keep the centered, responsive 48rem article shell. Allow `.post-content` to fill that shell rather than limiting it to 68ch; do not widen unrelated generic `.prose` layouts. Align normal prose, title/metadata and divider at both edges. Recheck `.wide` and `figure` breakout calculations using the new containing width, including narrow-screen overflow, captions and interactive charts. Keep tables and long equations locally scrollable where required.

### Widget boundary

Isolate the existing contact-patch application in a same-origin iframe so its bundled stylesheet and injected Material UI global baseline cannot reach the parent document. Supply an accessible iframe title, the existing mount point, module and CSS, and keep model/WASM paths unchanged. Size the frame to its content responsively without nested scrolling, using a bounded same-origin resize mechanism and validating any message source/origin if messaging is used. Ensure the embedded document is not a canonical/search-index target. Verify its sliders and inference output, assets and parent header styling. This avoids modifying opaque compiled JavaScript; a parent-only specificity override was rejected because it leaves global CSS coupled to the page and can regress when widget styles change.

## Risks / Trade-offs

- Iframe isolation changes the widget's browsing context and may affect resizing, keyboard focus, canvas rendering or model loading. Browser-test these behaviors at desktop and mobile widths; do not accept broken interaction as a visual-only fix.
- Restoring the Jekyll background can expose insufficient contrast in muted text, links, controls, tables or code blocks; evaluate actual computed pairs, including focus indicators and the widget.
- Wider normal prose changes line length; retain the existing bounded article shell rather than widening the reading column.
- The prior migration is not yet archived or deployed. Apply this change on top of it, preserve its uncompleted deployment verification, and sync/archive in dependency order.
