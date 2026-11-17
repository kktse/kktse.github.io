# Kelvin Tse's blog

A static vehicle-dynamics blog published at <https://kktse.github.io/>.

## Local development

Install [mise](https://mise.jdx.dev/), then install the tools and Node dependencies pinned by this repository:

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

Run `mise exec -- npm run verify:routes` after a build to check legacy routes and public assets against the committed inventory. CI runs this check before deployment. To compare the generated site with a full Jekyll baseline built as shown below, run `mise exec -- npm run verify:migration`; pass a different baseline directory after `--` when needed.

For presentation changes, use the production preview to check the home page, a regular article, and the contact-patch article at desktop and mobile widths under both system color preferences. On the contact-patch article, check that the embedded widget resizes without nested scrolling, its sliders work by keyboard, and its model and WASM requests succeed; also check a Bokeh article and an old article URL.

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

## Fonts and licensing

Article and About prose use [Source Serif 4](https://github.com/adobe-fonts/source-serif), self-hosted under `public/fonts/source-serif-4/` as latin-subset variable WOFF2 files: one upright file covering weights 400–700 and one italic file. The family is referenced only inside long-form prose scopes, so navigation, metadata and the rest of the site keep the system sans and mono stacks. The previous system serif stack remains the fallback while the web font loads or if it is unavailable.

Source Serif is Copyright 2014–2023 Adobe and licensed under the SIL Open Font License 1.1. The bundled `public/fonts/source-serif-4/LICENSE.md` is the upstream license; keep it with the font files when replacing or moving them. The committed WOFF2 files are the Google Fonts latin subsets of the upstream release.

## Jekyll baseline and rollback

During the migration, the prior Jekyll site can be built using the Ruby version configured in mise:

```sh
mise exec -- bundle install
JEKYLL_ENV=production mise exec -- bundle exec jekyll build --destination /tmp/kktse-jekyll-baseline
```

The known-good pre-migration revision is `ced0512d171cfd86f5d9eb05033848fd541bdc45`. If the Astro deployment must be rolled back, revert the cutover commit(s) on the default branch so that both the Jekyll source and the Jekyll Pages workflow are restored, then confirm the Pages deployment succeeds. Coordinate the revert with any subsequent changes; do not discard unrelated work.

## URL migration

The site keeps the `kktse.github.io` hostname. Old page paths are retained as HTML pages with an immediate meta refresh and a fallback link to the new canonical page. GitHub Pages serves these documents with HTTP 200, not a server-side 301. Keep the redirect pages and legacy asset URLs available when editing or publishing the site.
