import type { APIRoute } from 'astro';

/*
 * Same-origin iframe document for the prebuilt contact-patch widget.
 *
 * The widget bundle installs a global reset (`* { box-sizing: content-box }`)
 * and Material UI's `CssBaseline` on `body`. Giving it its own document keeps
 * those rules inside the frame, so they cannot affect the article, header or
 * page colours.
 *
 * The route ends in `.html` on purpose: `astro.config.mjs` filters such routes
 * out of the sitemap, and the `noindex` metadata below keeps the frame document
 * from being treated as a canonical page in its own right.
 *
 * The `index.js`, `index.css`, ONNX models and WASM binary are loaded from
 * their existing published URLs; the prebuilt application is not modified.
 */
const embedDocument = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="googlebot" content="noindex, nofollow" />
    <title>Interactive tire contact patch visualization</title>
    <link
      rel="stylesheet"
      href="/assets/dist/2024-09-18-continental-ecf-cp-widget/assets/index.css"
    />
    <style>
      /*
       * Keep the frame transparent so the article background shows through,
       * and suppress the frame's own scrollbars: the parent page sizes the
       * iframe to the measured content height.
       */
      html,
      body {
        margin: 0;
        padding: 0;
        background: transparent !important;
        overflow: hidden;
      }

      #footprint-shape-widget {
        display: flow-root;
        width: 100%;
        max-width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="footprint-shape-widget"></div>

    <script
      type="module"
      src="/assets/dist/2024-09-18-continental-ecf-cp-widget/assets/index.js"
    ></script>

    <script>
      /*
       * Report the mount's rendered height to the parent page. The parent
       * validates both the message origin and the source window before
       * applying it, and asks for a fresh measurement once the frame loads.
       */
      (function () {
        var root = document.getElementById('footprint-shape-widget');
        if (!root) return;

        var HEIGHT_MESSAGE = 'contact-patch-widget:height';
        var REQUEST_MESSAGE = 'contact-patch-widget:request-height';
        var lastHeight = 0;
        var scheduled = 0;

        function postHeight() {
          scheduled = 0;
          var height = Math.ceil(root.getBoundingClientRect().height);
          if (height < 1 || height === lastHeight) return;

          lastHeight = height;
          window.parent.postMessage(
            { type: HEIGHT_MESSAGE, height: height },
            window.location.origin
          );
        }

        function schedule() {
          if (scheduled) return;
          scheduled = window.requestAnimationFrame(postHeight);
        }

        if (typeof ResizeObserver === 'function') {
          new ResizeObserver(schedule).observe(root);
        }

        if (typeof MutationObserver === 'function') {
          new MutationObserver(schedule).observe(root, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
          });
        }

        window.addEventListener('resize', schedule, { passive: true });
        window.addEventListener('load', schedule);
        window.addEventListener('message', function (event) {
          if (event.source !== window.parent) return;
          if (event.origin !== window.location.origin) return;

          var data = event.data;
          if (!data || data.type !== REQUEST_MESSAGE) return;

          lastHeight = 0;
          schedule();
        });

        schedule();
      })();
    </script>
  </body>
</html>
`;

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(embedDocument, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
