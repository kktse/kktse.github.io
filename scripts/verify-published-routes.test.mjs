/*
 * Deterministic regression cases for scripts/verify-published-routes.mjs.
 *
 * Each case builds a tiny, self-contained dist/ tree and inventory in a
 * temporary directory. The verifier is exercised directly, so no server,
 * browser, network access, Astro build or historical baseline is involved.
 *
 * Run with: npm run test:routes
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { verifyPublishedSite } from './verify-published-routes.mjs';

const SITE = 'https://example.test';
const LEGACY = '/jekyll/update/2020/01/01/hello.html';
const CANONICAL = '/posts/hello/';
const ASSET = '/assets/hello.txt';

const sha256_16 = (content) =>
  createHash('sha256').update(content).digest('hex').slice(0, 16);

function canonicalPage({
  canonical,
  body = '',
  noindex = false,
  head = '',
}) {
  const href = new URL(canonical, SITE).href;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="canonical" href="${href}">
    ${noindex ? '<meta name="robots" content="noindex, follow">' : ''}
    ${head}
  </head>
  <body>${body}</body>
</html>`;
}

function redirectPage(target, { canonical = target, fallback = true } = {}) {
  const href = new URL(canonical, SITE).href;
  const fallbackHtml = fallback
    ? `<p>This page has moved to <a href="${target}">${target}</a>.</p>`
    : '<p>This page has moved.</p>';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="robots" content="noindex, follow">
    <link rel="canonical" href="${href}">
    <meta http-equiv="refresh" content="0; url=${target}">
  </head>
  <body>${fallbackHtml}</body>
</html>`;
}

function feedXml(links) {
  const items = links
    .map(
      (link) =>
        `<item><title>${new URL(link, SITE).pathname}</title><link>${new URL(link, SITE).href}</link></item>`
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Test feed</title><link>${SITE}/</link>${items}</channel></rss>`;
}

function sitemapIndex(children = [`${SITE}/sitemap-0.xml`]) {
  const entries = children
    .map((url) => `<sitemap><loc>${new URL(url, SITE).href}</loc></sitemap>`)
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`;
}

function sitemapUrlset(urls) {
  const locations = urls.map((url) => `<url><loc>${new URL(url, SITE).href}</loc></url>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locations}</urlset>`;
}

const assetContent = Buffer.from('hello asset\n');

function makeInventory() {
  return {
    site: SITE,
    routes: [
      {
        legacyUrl: LEGACY,
        canonicalUrl: CANONICAL,
        slug: 'hello',
        title: 'Hello',
        published: '2020-01-01T00:00:00+00:00',
        modified: null,
        requiredHeadings: ['intro'],
      },
    ],
    pages: [
      { url: '/', canonicalUrl: '/', indexable: true, requiredAnchors: [] },
      {
        url: '/about/',
        canonicalUrl: '/about/',
        indexable: true,
        requiredAnchors: [],
      },
      {
        url: '/categories/',
        canonicalUrl: '/categories/',
        indexable: true,
        requiredAnchors: ['tires'],
      },
      {
        url: '/404.html',
        canonicalUrl: '/404.html',
        indexable: false,
        requiredAnchors: [],
      },
    ],
    aliases: [
      { from: '/home.html', to: '/', kind: 'html-meta-refresh' },
      { from: '/feed.xml', to: '/rss.xml', kind: 'rss-alias' },
    ],
    assets: [
      {
        url: ASSET,
        bytes: assetContent.length,
        sha256_16: sha256_16(assetContent),
      },
    ],
    excludedAssets: [],
    sitemap: {
      requiredUrls: [
        `${SITE}/`,
        `${SITE}/about/`,
        `${SITE}/categories/`,
        `${SITE}${CANONICAL}`,
      ],
      excludedUrls: [
        `${SITE}${LEGACY}`,
        `${SITE}/home.html`,
        `${SITE}/feed.xml`,
        `${SITE}/rss.xml`,
        `${SITE}/404.html`,
      ],
      legacyUrl: '/sitemap.xml',
      legacyChildUrls: [`${SITE}/sitemap-0.xml`],
    },
    feed: {
      canonicalUrl: '/rss.xml',
      aliasUrl: '/feed.xml',
    },
    headingExceptions: [],
  };
}

function baseFiles() {
  const feed = feedXml([CANONICAL, `${SITE}/about/`]);
  return new Map([
    [
      'index.html',
      canonicalPage({
        canonical: '/',
        head: `<link rel="alternate" type="application/rss+xml" href="${SITE}/rss.xml">`,
        body: '<h1>Home</h1>',
      }),
    ],
    [
      'about/index.html',
      canonicalPage({ canonical: '/about/', body: '<h1>About</h1>' }),
    ],
    [
      'categories/index.html',
      canonicalPage({
        canonical: '/categories/',
        body:
          '<h2 id="tires">Tires</h2><p><a href="/posts/hello/#intro">Hello</a></p>',
      }),
    ],
    [
      '404.html',
      canonicalPage({
        canonical: '/404.html',
        noindex: true,
        body: '<h1>Not found</h1>',
      }),
    ],
    [
      'posts/hello/index.html',
      canonicalPage({
        canonical: CANONICAL,
        body:
          '<h1>Hello</h1><h2 id="intro">Intro</h2><p><a href="#intro">Intro</a> <a href="/categories/#tires">Tires</a></p>',
      }),
    ],
    [LEGACY.slice(1), redirectPage(CANONICAL)],
    ['home.html', redirectPage('/')],
    ['feed.xml', feed],
    ['rss.xml', feed],
    ['sitemap-index.xml', sitemapIndex()],
    ['sitemap.xml', sitemapIndex([`${SITE}/sitemap-0.xml`])],
    [
      'sitemap-0.xml',
      sitemapUrlset([
        `${SITE}/`,
        `${SITE}/about/`,
        `${SITE}/categories/`,
        `${SITE}${CANONICAL}`,
      ]),
    ],
    [ASSET.slice(1), assetContent],
  ]);
}

async function runCase(mutate) {
  const root = await mkdtemp(path.join(tmpdir(), 'published-routes-'));
  const dist = path.join(root, 'dist');
  const files = baseFiles();
  const inventory = makeInventory();

  if (mutate) await mutate({ files, inventory, dist });

  try {
    for (const [rel, content] of files) {
      const target = path.join(dist, rel);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, content);
    }

    return await verifyPublishedSite({ dist, inventory, site: SITE });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

const codes = (result) => result.errors.map((error) => error.code);
const messages = (result) => result.errors.map((error) => error.message);

function assertError(result, code) {
  assert.ok(
    codes(result).includes(code),
    `expected ${code}; got ${JSON.stringify(result.errors, null, 2)}`
  );
}

test('a valid publication passes the complete contract', async () => {
  const result = await runCase();
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.ok, true);
  assert.equal(result.stats.routes, 1);
  assert.equal(result.stats.assetsMatched, 1);
  assert.equal(result.stats.sitemap, 'sitemap-index.xml');
  assert.equal(result.stats.sitemapUrls, 4);
  assert.equal(result.stats.feedEntries, 4);
});

test('a missing redirect destination reports source and target', async () => {
  const result = await runCase(({ files }) => {
    files.delete('posts/hello/index.html');
  });
  assertError(result, 'route-destination-missing');
  assert.ok(
    messages(result).some(
      (message) => message.includes(LEGACY) && message.includes(CANONICAL)
    )
  );
});

test('a missing required asset fails', async () => {
  const result = await runCase(({ files }) => {
    files.delete(ASSET.slice(1));
  });
  assertError(result, 'missing-asset');
});

test('a missing required article heading fails', async () => {
  const result = await runCase(({ files }) => {
    files.set(
      'posts/hello/index.html',
      canonicalPage({ canonical: CANONICAL, body: '<h1>Hello</h1>' })
    );
  });
  assertError(result, 'missing-heading');
});

test('a wrong canonical target fails', async () => {
  const result = await runCase(({ files }) => {
    files.set(
      'posts/hello/index.html',
      canonicalPage({
        canonical: '/posts/not-hello/',
        body: '<h1>Hello</h1><h2 id="intro">Intro</h2>',
      })
    );
  });
  assertError(result, 'destination-canonical-mismatch');
});

test('a redirect chain fails', async () => {
  const result = await runCase(({ files }) => {
    files.set(LEGACY.slice(1), redirectPage('/home.html'));
  });
  assertError(result, 'redirect-chain');
});

test('an omitted sitemap URL fails coverage', async () => {
  const result = await runCase(({ files }) => {
    files.set(
      'sitemap-0.xml',
      sitemapUrlset([
        `${SITE}/`,
        `${SITE}/about/`,
        `${SITE}/categories/`,
      ])
    );
  });
  assertError(result, 'sitemap-coverage');
});

test('a redirected sitemap URL fails', async () => {
  const result = await runCase(({ files }) => {
    files.set('moved/index.html', redirectPage(CANONICAL));
    files.set(
      'sitemap-0.xml',
      sitemapUrlset([
        `${SITE}/`,
        `${SITE}/about/`,
        `${SITE}/categories/`,
        `${SITE}${CANONICAL}`,
        `${SITE}/moved/`,
      ])
    );
  });
  assertError(result, 'sitemap-redirect');
});

test('a retired feed URL fails', async () => {
  const result = await runCase(({ files }) => {
    const retired = feedXml([LEGACY]);
    files.set('feed.xml', retired);
    files.set('rss.xml', retired);
  });
  assertError(result, 'feed-legacy-url');
});

test('a redirect with the wrong canonical link fails', async () => {
  const result = await runCase(({ files }) => {
    files.set(
      LEGACY.slice(1),
      redirectPage(CANONICAL, { canonical: '/posts/not-hello/' })
    );
  });
  assertError(result, 'redirect-canonical-mismatch');
});

test('a redirect without a visible fallback link fails', async () => {
  const result = await runCase(({ files }) => {
    files.set(LEGACY.slice(1), redirectPage(CANONICAL, { fallback: false }));
  });
  assertError(result, 'redirect-fallback-missing');
});

test('a broken local fragment fails', async () => {
  const result = await runCase(({ files }) => {
    files.set(
      'categories/index.html',
      canonicalPage({
        canonical: '/categories/',
        body: '<h2 id="tires">Tires</h2><a href="/posts/hello/#missing">Hello</a>',
      })
    );
  });
  assertError(result, 'broken-reference');
});

test('duplicate output routes fail', async () => {
  const result = await runCase(({ files }) => {
    files.set(
      'index.htm',
      canonicalPage({ canonical: '/', body: '<h1>Duplicate home</h1>' })
    );
  });
  assertError(result, 'route-collision');
});

test('a feed alias that differs from the canonical feed fails', async () => {
  const result = await runCase(({ files }) => {
    files.set('feed.xml', feedXml([CANONICAL]));
  });
  assertError(result, 'feed-alias-mismatch');
});

test('a missing legacy sitemap fails', async () => {
  const result = await runCase(({ files }) => {
    files.delete('sitemap.xml');
  });
  assertError(result, 'legacy-sitemap-missing');
});

test('a legacy sitemap that lists URLs instead of sitemaps fails', async () => {
  const result = await runCase(({ files }) => {
    files.set(
      'sitemap.xml',
      sitemapUrlset([
        `${SITE}/`,
        `${SITE}/about/`,
        `${SITE}/categories/`,
        `${SITE}${CANONICAL}`,
      ])
    );
  });
  assertError(result, 'legacy-sitemap-index');
});

test('a legacy sitemap that nests the generated index fails', async () => {
  const result = await runCase(({ files }) => {
    files.set('sitemap.xml', sitemapIndex([`${SITE}/sitemap-index.xml`]));
  });
  assertError(result, 'legacy-sitemap-nested');
});

test('a legacy sitemap that references an off-site sitemap fails', async () => {
  const result = await runCase(({ files }) => {
    files.set(
      'sitemap.xml',
      sitemapIndex(['http://localhost:4321/sitemap-0.xml'])
    );
  });
  assertError(result, 'legacy-sitemap-child-external');
});

test('a legacy sitemap that references a missing sitemap fails', async () => {
  const result = await runCase(({ files }) => {
    files.set(
      'sitemap.xml',
      sitemapIndex([`${SITE}/sitemap-0.xml`, `${SITE}/sitemap-9.xml`])
    );
  });
  assertError(result, 'legacy-sitemap-child-missing');
});

test('a legacy sitemap that references an unrelated sitemap fails', async () => {
  const result = await runCase(({ files }) => {
    files.set('sitemap-9.xml', sitemapUrlset([`${SITE}/about/`]));
    files.set(
      'sitemap.xml',
      sitemapIndex([`${SITE}/sitemap-0.xml`, `${SITE}/sitemap-9.xml`])
    );
  });
  assertError(result, 'legacy-sitemap-target');
});

test('a legacy sitemap that repeats the same sitemap fails', async () => {
  const result = await runCase(({ files }) => {
    files.set(
      'sitemap.xml',
      sitemapIndex([`${SITE}/sitemap-0.xml`, `${SITE}/sitemap-0.xml`])
    );
  });
  assertError(result, 'legacy-sitemap-duplicate');
});

test('a legacy sitemap that omits a generated sitemap fails coverage', async () => {
  const result = await runCase(({ files, inventory }) => {
    files.set(
      'sitemap-index.xml',
      sitemapIndex([`${SITE}/sitemap-0.xml`, `${SITE}/sitemap-1.xml`])
    );
    files.set('sitemap-0.xml', sitemapUrlset([`${SITE}/`, `${SITE}/about/`]));
    files.set(
      'sitemap-1.xml',
      sitemapUrlset([`${SITE}/categories/`, `${SITE}${CANONICAL}`])
    );
    inventory.sitemap.legacyChildUrls = [
      `${SITE}/sitemap-0.xml`,
      `${SITE}/sitemap-1.xml`,
    ];
  });
  assertError(result, 'legacy-sitemap-coverage');
});

test('an inventory without a legacy sitemap contract fails', async () => {
  const result = await runCase(({ inventory }) => {
    delete inventory.sitemap.legacyUrl;
  });
  assertError(result, 'inventory-invalid');
});

test('an inventory without legacy sitemap targets fails', async () => {
  const result = await runCase(({ inventory }) => {
    delete inventory.sitemap.legacyChildUrls;
  });
  assertError(result, 'inventory-invalid');
});
