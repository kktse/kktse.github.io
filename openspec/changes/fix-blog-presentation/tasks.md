# Tasks

## 1. Light theme and article layout

- [x] 1.1 Set the site-wide light background to the Jekyll value `#fdfdfd`, use a readable body text color, and remove OS-driven dark theme and dark browser/theme-color metadata.
- [x] 1.2 Adjust foreground, secondary text, links and surface colors as needed to meet 4.5:1 contrast for normal text and 3:1 for large text against their rendered backgrounds.
- [x] 1.3 Make the article prose column fill the existing centered article shell so the title, metadata, divider and content align at both edges without widening unrelated `.prose` layouts.
- [x] 1.4 Adjust and verify responsive wide figures, charts, tables and equations so they remain centered or locally scrollable without page-level horizontal overflow.

## 2. Contact-patch widget isolation

- [x] 2.1 Isolate the existing widget's bundled global CSS reset and Material UI baseline in a same-origin iframe without modifying the prebuilt application or its asset URLs.
- [x] 2.2 Provide a descriptive iframe title, responsive content-driven height without nested scrolling, and safe same-origin resize communication; prevent the embedded document from becoming an indexed canonical page.
- [x] 2.3 Preserve widget mount, JavaScript, CSS, model and WASM loading, slider keyboard access and canvas updates within the isolated context.

## 3. Verification

- [x] 3.1 Build the production site and compare the home page, a regular article and the contact-patch article at desktop and mobile widths under both light and dark system preferences; confirm the page background remains `#fdfdfd`.
- [x] 3.2 Check article header/divider/content boundary alignment, actual text-background contrast, navigation/focus and wide media overflow.
- [x] 3.3 Exercise the contact-patch sliders and canvas, verify model/WASM/CSS/JS network requests and console errors, and confirm its global styles no longer alter the parent header or page colors.
- [x] 3.4 Check representative legacy Bokeh charts and existing URL/asset compatibility; use native WebKit or another available browser without Playwright or Chromium.
- [x] 3.5 Document any changed local verification procedure; retain the existing migration's pending post-deployment verification task.
