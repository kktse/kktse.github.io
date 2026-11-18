const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

/**
 * GitHub Pages serves these documents as HTTP 200, so the meta refresh is a
 * crawler hint rather than an HTTP redirect. The inline script runs before the
 * refresh tag and preserves old fragment links (`#heading`) by appending
 * `location.hash` before navigating. The visible link is the no-JS fallback.
 */
export function renderLegacyRedirect(target: string, origin: string): string {
  const absoluteTarget = new URL(target, origin).href;
  const href = escapeHtml(target);
  const canonical = escapeHtml(absoluteTarget);
  const scriptTarget = JSON.stringify(target);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="${canonical}">
    <title>Redirecting…</title>
    <script>
      (function () {
        var target = ${scriptTarget};
        window.location.replace(target + window.location.hash);
      })();
    </script>
    <meta http-equiv="refresh" content="0; url=${href}">
  </head>
  <body>
    <p>This page has moved to <a href="${href}">${href}</a>.</p>
  </body>
</html>
`;
}
