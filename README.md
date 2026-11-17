# Kelvin Tse's blog

A static vehicle-dynamics blog published at <https://kktse.github.io/>.

## Local development

Install [mise](https://mise.jdx.dev/), then install the pinned Node runtime and dependencies. Normal Astro development does not require Ruby:

```sh
mise install
mise exec -- npm ci
mise exec -- npm run dev
```

Open the local URL printed by Astro. Stop a background development server with `mise exec -- npm run dev:stop`; use `Ctrl+C` for a foreground server.

For a production build and local preview:

```sh
mise exec -- npm run build
mise exec -- npm run preview
```

Stop a background preview with `mise exec -- npm run preview:stop`; use `Ctrl+C` for a foreground server. Local development and preview do not enable production analytics. The GitHub Pages deployment sets `PUBLIC_ENABLE_ANALYTICS=true` for its build.

Run `mise exec -- npm run verify:routes` and `mise exec -- npm run verify:math` after a build to check published compatibility and rendered mathematics. CI runs both checks before deployment. Run `mise exec -- npm run test:routes` for the publication verifier's isolated regression cases.

For presentation changes, use the production preview to check the home page, a regular article, and the contact-patch article at desktop and mobile widths under both system color preferences. On the contact-patch article, check that the embedded widget resizes without nested scrolling, its sliders work by keyboard, and its model and WASM requests succeed; also check a Bokeh article and an old article URL.

## Post filenames

Posts in `src/content/posts/` use `YYYY-MM-DD-<slug>.md` (or `.mdx`).
Migrated posts retain their original filename dates, which can differ
from the publication date. The frontmatter `date` controls publication and
ordering, and the explicit `slug` controls the URL.
Set `description` in the frontmatter to a concise summary; it appears below
the article title and in search and social-sharing metadata.

If Astro reports a missing content module after renames, rebuild its content
cache with `mise exec -- npm run sync -- --force`.

## Math authoring

Post math is typeset at build time by `remark-math` and `rehype-katex` through the unified processor configured in `astro.config.mjs`. The build emits KaTeX HTML with a MathML fallback, so articles need no client-side KaTeX script, CDN stylesheet or auto-render pass. KaTeX's stylesheet and font files are bundled from the `katex` package and load with the site CSS.

Author equations with dollar delimiters:

- Inline math uses `$…$` on a single line, for example `$a_y$`. Do not leave a space immediately inside the delimiters: `$ a_y $` is not math to `remark-math`.
- Display math opens and closes with `$$` on their own lines, with a blank line before the opening delimiter and after the closing one:

  ```markdown
  The rear slip angle is

  $$
  \alpha_r = \frac{m_r a_y}{C_r}
  $$

  where the terms are defined below.
  ```

- Use KaTeX-supported LaTeX only. `rehype-katex` does not fail the build for malformed TeX; it emits a visible red `katex-error` span instead, so inspect the built article after editing equations.
- Do not wrap display math in raw `<div>` or `<span>` HTML, and do not HTML-escape math content (`&amp;`, `&lt;`). A raw HTML block passes through unchanged, so `$$` inside it never becomes math, and escaped ampersands reach KaTeX as text instead of alignment separators.
- Escape a literal dollar sign as `\$`; otherwise a second `$` on the same line can turn the text between them into math.

The same syntax works in `.mdx` posts; the MDX integration inherits the unified processor from the Markdown configuration.

After building, run `mise exec -- npm run verify:math` to check rendered equations, MathML, and bundled font assets.

