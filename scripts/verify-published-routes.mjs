#!/usr/bin/env node
/*
 * Verify the built Astro `dist/` tree against the retained publication
 * contract in `src/data/published-compatibility-inventory.json`.
 *
 * The inventory is deliberately independent of `dist/`: it records the
 * published paths, aliases, assets, required heading/category anchors and
 * discovery expectations that must survive future changes. No browser,
 * network request, historical build or source tree is consulted.
 *
 * Run with --help for usage. Regression cases live in
 * `scripts/verify-published-routes.test.mjs` and run with `npm run test:routes`.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as parse5 from 'parse5';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
export const DEFAULT_DIST = path.join(REPO_ROOT, 'dist');
export const DEFAULT_INVENTORY = path.join(
  REPO_ROOT,
  'src/data/published-compatibility-inventory.json'
);
const DEFAULT_SITE = 'https://kktse.github.io';
const MAX_REPORTED = 80;

const SKIP_WALK_DIRS = new Set(['.git', 'node_modules']);

/* ------------------------------------------------------------------------- */
/* Small HTML helpers (parse5, no DOM abstraction layer)                     */
/* ------------------------------------------------------------------------- */

const isElement = (node) => typeof node?.tagName === 'string';

function attr(node, name) {
  return node.attrs?.find((attribute) => attribute.name === name)?.value;
}

function walk(node, visit, ancestors = []) {
  visit(node, ancestors);
  ancestors.push(node);
  for (const child of node.childNodes ?? []) walk(child, visit, ancestors);
  ancestors.pop();
}

function findAll(root, predicate) {
  const found = [];
  walk(root, (node) => {
    if (isElement(node) && predicate(node)) found.push(node);
  });
  return found;
}

function findFirst(root, predicate) {
  let found = null;
  walk(root, (node) => {
    if (!found && isElement(node) && predicate(node)) found = node;
  });
  return found;
}

function textOf(node) {
  let text = '';

  function visit(current) {
    if (current.nodeName === '#text') {
      text += current.value;
      return;
    }
    if (current.tagName === 'script' || current.tagName === 'style') return;
    for (const child of current.childNodes ?? []) visit(child);
  }

  visit(node);
  return text;
}

function visibleText(document) {
  return textOf(document).replace(/\s+/g, ' ').trim();
}

function parseAttributes(tag) {
  const attributes = new Map();
  const body = tag.replace(/^<\s*\/?\s*[^\s/>]+/, '').replace(/\/?>\s*$/, '');
  const attributePattern =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;

  while ((match = attributePattern.exec(body)) !== null) {
    const name = match[1].toLowerCase();
    const value = decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? '');
    if (!attributes.has(name)) attributes.set(name, value);
  }

  return attributes;
}

const NAMED_ENTITIES = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

function decodeHtmlEntities(value) {
  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]+);/gi, (full, entity) => {
    if (entity.startsWith('#')) {
      const hexadecimal = entity[1]?.toLowerCase() === 'x';
      const codePoint = Number.parseInt(
        hexadecimal ? entity.slice(2) : entity.slice(1),
        hexadecimal ? 16 : 10
      );
      return Number.isInteger(codePoint) &&
        codePoint >= 0 &&
        codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : full;
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? full;
  });
}

function extractMetaRefresh(document) {
  const refreshes = [];

  for (const meta of findAll(
    document,
    (node) =>
      node.tagName === 'meta' &&
      (attr(node, 'http-equiv') ?? '').trim().toLowerCase() === 'refresh'
  )) {
    const content = attr(meta, 'content');
    if (content == null) {
      refreshes.push({ error: 'meta refresh has no content attribute' });
      continue;
    }

    const parsed = /^\s*([0-9]+(?:\.[0-9]+)?)\s*;\s*(?:url\s*=\s*)?(.*?)\s*$/i.exec(
      content
    );
    if (!parsed) {
      refreshes.push({
        error: `meta refresh content is not a delay-and-URL pair: ${JSON.stringify(content)}`,
      });
      continue;
    }

    let target = parsed[2].trim();
    if (
      (target.startsWith('"') && target.endsWith('"')) ||
      (target.startsWith("'") && target.endsWith("'"))
    ) {
      target = target.slice(1, -1).trim();
    }

    if (!target) {
      refreshes.push({ error: 'meta refresh has an empty URL' });
      continue;
    }

    refreshes.push({ delay: Number(parsed[1]), target });
  }

  if (refreshes.length === 0) return null;
  if (refreshes.length > 1) {
    return { error: `${refreshes.length} meta refresh tags found` };
  }
  return refreshes[0];
}

function extractCanonical(document) {
  const links = findAll(document, (node) => {
    if (node.tagName !== 'link') return false;
    return (attr(node, 'rel') ?? '')
      .toLowerCase()
      .split(/\s+/)
      .includes('canonical');
  });

  if (links.length === 0) return null;
  return {
    href: (attr(links[0], 'href') ?? '').trim() || null,
    count: links.length,
  };
}

function pageHasNoindex(document) {
  for (const meta of findAll(
    document,
    (node) =>
      node.tagName === 'meta' &&
      (attr(node, 'name') ?? '').trim().toLowerCase() === 'robots'
  )) {
    const content = (attr(meta, 'content') ?? '').toLowerCase();
    if (/(^|[\s,;])noindex([\s,;]|$)/.test(content)) return true;
  }
  return false;
}

function looksLikeScriptRedirect(raw, document) {
  const navigates =
    /\b(?:window\.)?location(?:\.href)?\s*=\s*['"`]|\blocation\.(?:replace|assign)\s*\(/.test(
      raw
    );
  if (!navigates) return false;
  return visibleText(document).length < 250;
}

function collectFallbackLinks(document) {
  const body = findFirst(document, (node) => node.tagName === 'body');
  if (!body) return [];

  return findAll(body, (node) => node.tagName === 'a')
    .map((anchor) => {
      const href = (attr(anchor, 'href') ?? '').trim();
      const text = textOf(anchor).replace(/\s+/g, ' ').trim();
      const imageAlt = findAll(anchor, (node) => node.tagName === 'img')
        .map((image) => (attr(image, 'alt') ?? '').trim())
        .find(Boolean);
      return { href, text: text || imageAlt || '' };
    })
    .filter((link) => link.href);
}

const REFERENCE_TAGS = new Set([
  'a',
  'area',
  'audio',
  'embed',
  'iframe',
  'img',
  'link',
  'object',
  'script',
  'source',
  'track',
  'video',
]);

function collectReferences(document) {
  const references = [];

  for (const node of findAll(document, (element) =>
    REFERENCE_TAGS.has(element.tagName)
  )) {
    for (const attribute of ['src', 'href', 'poster']) {
      const value = (attr(node, attribute) ?? '').trim();
      if (value) references.push(value);
    }

    if (node.tagName === 'object') {
      const value = (attr(node, 'data') ?? '').trim();
      if (value) references.push(value);
    }

    const srcset = attr(node, 'srcset');
    if (srcset && !srcset.includes('data:')) {
      for (const part of srcset.split(',')) {
        const value = part.trim().split(/\s+/)[0];
        if (value) references.push(value);
      }
    }
  }

  return references;
}

/* ------------------------------------------------------------------------- */
/* Path and URL helpers                                                      */
/* ------------------------------------------------------------------------- */

const isHtmlFile = (rel) => /\.html?$/i.test(rel);
const isCssFile = (rel) => /\.css$/i.test(rel);

/*
 * Canonical post URLs are `/post/YYYY/MM/DD/<slug>/`, where the date is the
 * UTC calendar date of the authoritative frontmatter timestamp, never a
 * filename date. The verifier derives the expected path from `published`, so
 * a stale or timezone-shifted canonical URL fails instead of silently
 * becoming a second contract.
 */
const ISO_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/;
const DATED_POST_PATTERN =
  /^\/post\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATED_POST_PREFIX = '/post/';
const RETIRED_POST_PREFIX = '/posts/';
const padDatePart = (value, width = 2) => String(value).padStart(width, '0');

const isIsoTimestamp = (value) =>
  typeof value === 'string' && ISO_TIMESTAMP_PATTERN.test(value);

function formatDatedPostUrl(published, slug) {
  if (!isIsoTimestamp(published) || typeof slug !== 'string') return null;
  const time = Date.parse(published);
  if (!Number.isFinite(time)) return null;
  const date = new Date(time);
  const year = date.getUTCFullYear();
  if (!Number.isInteger(year) || year < 1) return null;
  return `${DATED_POST_PREFIX}${padDatePart(year, 4)}/${padDatePart(
    date.getUTCMonth() + 1
  )}/${padDatePart(date.getUTCDate())}/${slug}/`;
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function extractPathname(input) {
  const value = String(input ?? '').trim();
  if (!value) return null;

  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(value) || /^[a-z][a-z0-9+.-]*:/i.test(value)) {
    try {
      return new URL(value).pathname;
    } catch {
      return null;
    }
  }

  return value.split('#')[0].split('?')[0];
}

function normalizeDecodedPathname(value) {
  let pathname = String(value).replace(/\\/g, '/').replace(/\/{2,}/g, '/');
  const trailingSlash = pathname.endsWith('/');

  pathname = path.posix.normalize(pathname);
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  if (pathname === '/.') pathname = '/';
  if (trailingSlash && pathname !== '/' && !pathname.endsWith('/')) {
    pathname += '/';
  }
  return pathname;
}

function normalizePathname(input) {
  const raw = extractPathname(input);
  if (raw == null) return '/';
  return normalizeDecodedPathname(safeDecodeURIComponent(raw));
}

function comparablePath(pathname) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

function urlToRelCandidates(pathname) {
  const withoutRoot = pathname.replace(/^\/+/, '');

  if (!withoutRoot) return ['index.html', 'index.htm', 'index.xhtml'];
  if (pathname.endsWith('/')) {
    return [
      `${withoutRoot}index.html`,
      `${withoutRoot}index.htm`,
      `${withoutRoot}index.xhtml`,
    ];
  }

  const candidates = [withoutRoot];
  const extension = path.posix.extname(withoutRoot);
  if (!extension) {
    candidates.push(
      `${withoutRoot}.html`,
      `${withoutRoot}.htm`,
      `${withoutRoot}/index.html`,
      `${withoutRoot}/index.htm`
    );
  }
  return candidates;
}

function htmlFileToUrlPath(rel) {
  const posix = rel.replace(/\\/g, '/');
  if (/^index\.html?$/i.test(posix)) return '/';

  const indexMatch = /^(.*)\/index\.html?$/i.exec(posix);
  if (indexMatch) return normalizePathname(`/${indexMatch[1]}/`);

  return normalizePathname(`/${posix}`);
}

function makeResolver(fileSet) {
  return function resolve(input) {
    const raw = extractPathname(input);
    if (raw == null) return null;

    const variants = new Set([
      normalizeDecodedPathname(safeDecodeURIComponent(raw)),
      normalizeDecodedPathname(raw),
    ]);

    for (const variant of variants) {
      for (const candidate of urlToRelCandidates(variant)) {
        if (fileSet.has(candidate)) return candidate;
      }
    }
    return null;
  };
}

function makeUrlFunctions(siteOrigin) {
  function resolveTarget(source, rawTarget) {
    const sourceUrl = source.startsWith('/') ? source : `/${source}`;
    let resolved;
    try {
      resolved = new URL(rawTarget, new URL(sourceUrl, siteOrigin));
    } catch {
      return { error: `invalid URL ${JSON.stringify(rawTarget)}` };
    }

    if (resolved.origin !== siteOrigin) {
      return { external: resolved.href, url: resolved };
    }

    return {
      path: normalizePathname(resolved.pathname),
      url: resolved,
      hash: resolved.hash,
      hasQuery: resolved.search.length > 0,
    };
  }

  function toSitePath(value) {
    const result = resolveTarget('/', value);
    if (result.error || result.external) return null;
    return result.path;
  }

  return { resolveTarget, toSitePath };
}

/* ------------------------------------------------------------------------- */
/* Filesystem scanning and page parsing                                     */
/* ------------------------------------------------------------------------- */

async function walkDirectory(root) {
  const files = [];
  const symlinks = [];

  async function visit(absoluteDir, relativeDir) {
    const entries = await readdir(absoluteDir, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name, 'en'));

    for (const entry of entries) {
      const relative = relativeDir
        ? `${relativeDir}/${entry.name}`
        : entry.name;

      if (entry.isSymbolicLink()) {
        symlinks.push(relative);
        continue;
      }
      if (entry.isDirectory()) {
        if (SKIP_WALK_DIRS.has(entry.name)) continue;
        await visit(path.join(absoluteDir, entry.name), relative);
        continue;
      }
      if (entry.isFile()) files.push(relative);
    }
  }

  await visit(root, '');
  return { files, symlinks };
}

async function parseHtmlPages(root, files) {
  const pages = new Map();

  for (const rel of files.filter(isHtmlFile)) {
    const raw = await readFile(path.join(root, rel), 'utf8');
    const document = parse5.parse(raw);
    const refresh = extractMetaRefresh(document);
    let kind = 'page';

    if (raw.trim() === '') {
      kind = 'empty';
    } else if (refresh) {
      kind = refresh.error ? 'invalid-redirect' : 'redirect';
    } else if (looksLikeScriptRedirect(raw, document)) {
      kind = 'script-redirect';
    }

    const ids = new Set(
      findAll(document, (node) => attr(node, 'id') != null).map((node) =>
        attr(node, 'id')
      )
    );
    const anchorNames = new Set(
      findAll(
        document,
        (node) => node.tagName === 'a' && attr(node, 'name') != null
      ).map((node) => attr(node, 'name'))
    );

    pages.set(rel, {
      rel,
      url: htmlFileToUrlPath(rel),
      raw,
      document,
      refresh,
      kind,
      noindex: pageHasNoindex(document),
      canonical: extractCanonical(document),
      ids,
      anchorNames,
      fallbackLinks: collectFallbackLinks(document),
    });
  }

  return pages;
}

/* ------------------------------------------------------------------------- */
/* Sitemap, feed and redirect parsing                                       */
/* ------------------------------------------------------------------------- */

function extractLocElements(xml) {
  const locations = [];
  for (const match of xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)) {
    let value = decodeHtmlEntities(match[1]).trim();
    value = value.replace(/^<!\[CDATA\[|\]\]>$/g, '').trim();
    if (value) locations.push(value);
  }
  return locations;
}

function isSitemapIndexDocument(xml) {
  return /<(?:[a-z0-9]+:)?sitemapindex\b/i.test(xml);
}

function isSitemapUrlsetDocument(xml) {
  return /<(?:[a-z0-9]+:)?urlset\b/i.test(xml);
}

function extractFeedEntries(xml) {
  const entries = [];

  for (const match of xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tagName = match[1].toLowerCase();
    const body = match[2];
    let link = null;

    if (tagName === 'item') {
      const linkMatch = /<link>\s*([\s\S]*?)\s*<\/link>/i.exec(body);
      if (linkMatch) link = linkMatch[1];
      if (!link) {
        const guidMatch =
          /<guid\b[^>]*\bisPermaLink\s*=\s*["']?true["']?[^>]*>\s*([\s\S]*?)\s*<\/guid>/i.exec(
            body
          );
        if (guidMatch) link = guidMatch[1];
      }
    } else {
      for (const linkMatch of body.matchAll(/<link\b[^>]*>/gi)) {
        const attributes = parseAttributes(linkMatch[0]);
        const rel = (attributes.get('rel') ?? 'alternate').trim().toLowerCase();
        if (rel !== 'alternate') continue;
        const href = attributes.get('href');
        if (href) {
          link = href;
          break;
        }
      }
    }

    if (link) {
      link = decodeHtmlEntities(link)
        .replace(/^<!\[CDATA\[|\]\]>$/g, '')
        .trim();
    }
    entries.push({ link });
  }

  return entries;
}

function followRedirectChain(sourcePath, firstTarget, distPages, resolveDist, resolveTarget) {
  const chain = [];
  const seen = new Set([sourcePath]);
  let current = firstTarget;

  for (let depth = 0; depth < 12; depth += 1) {
    if (seen.has(current)) {
      chain.push(`${current} (cycle)`);
      return chain.join(' -> ');
    }
    seen.add(current);
    chain.push(current);

    const rel = resolveDist(current);
    if (!rel) {
      chain.push('(missing)');
      return chain.join(' -> ');
    }
    const info = distPages.get(rel);
    if (!info) {
      chain.push('(non-HTML asset)');
      return chain.join(' -> ');
    }
    if (info.kind !== 'redirect') {
      if (info.kind !== 'page') chain.push(`(${info.kind})`);
      return chain.join(' -> ');
    }

    const next = resolveTarget(info.rel, info.refresh.target);
    if (next.error) {
      chain.push('(invalid target)');
      return chain.join(' -> ');
    }
    if (next.external) {
      chain.push('(external target)');
      return chain.join(' -> ');
    }
    current = next.path;
  }

  chain.push('(chain too long)');
  return chain.join(' -> ');
}

/* ------------------------------------------------------------------------- */
/* Verification                                                              */
/* ------------------------------------------------------------------------- */

export async function verifyPublishedSite({
  dist = DEFAULT_DIST,
  inventory,
  site = inventory?.site ?? DEFAULT_SITE,
} = {}) {
  const errors = [];
  const warnings = [];
  const addError = (code, message) => errors.push({ code, message });
  const addWarning = (code, message) => warnings.push({ code, message });

  let origin;
  try {
    origin = new URL(site).origin;
  } catch {
    addError('usage', `site is not a valid URL origin: ${site}`);
    return { ok: false, errors, warnings, stats: {} };
  }
  if (!/^https?:$/.test(new URL(origin).protocol)) {
    addError('usage', `site must use http or https: ${site}`);
    return { ok: false, errors, warnings, stats: {} };
  }

  if (!inventory || typeof inventory !== 'object') {
    addError('inventory-invalid', 'inventory must be a JSON object');
    return { ok: false, errors, warnings, stats: {} };
  }

  const routes = Array.isArray(inventory.routes) ? inventory.routes : [];
  const pagesContract = Array.isArray(inventory.pages) ? inventory.pages : [];
  const aliases = Array.isArray(inventory.aliases) ? inventory.aliases : [];
  const assets = Array.isArray(inventory.assets) ? inventory.assets : [];
  const exceptions = Array.isArray(inventory.headingExceptions)
    ? inventory.headingExceptions
    : [];

  if (!Array.isArray(inventory.routes)) {
    addError('inventory-invalid', 'inventory.routes must be an array');
  }
  if (!Array.isArray(inventory.pages)) {
    addError('inventory-invalid', 'inventory.pages must be an array');
  }
  if (!Array.isArray(inventory.aliases)) {
    addError('inventory-invalid', 'inventory.aliases must be an array');
  }
  if (!Array.isArray(inventory.assets)) {
    addError('inventory-invalid', 'inventory.assets must be an array');
  }

  const { resolveTarget, toSitePath } = makeUrlFunctions(origin);

  let distInfo;
  try {
    distInfo = await stat(dist);
  } catch (error) {
    addError('dist-missing', `cannot read dist ${dist}: ${error.message}`);
    return { ok: false, errors, warnings, stats: {} };
  }
  if (!distInfo.isDirectory()) {
    addError('dist-missing', `dist is not a directory: ${dist}`);
    return { ok: false, errors, warnings, stats: {} };
  }

  const walk = await walkDirectory(dist);
  const distFiles = walk.files;
  const fileSet = new Set(distFiles);
  if (walk.symlinks.length > 0) {
    addWarning(
      'dist-symlink',
      `dist contains symlinks that were not followed: ${walk.symlinks.join(', ')}`
    );
  }

  const distPages = await parseHtmlPages(dist, distFiles);
  const resolveDist = makeResolver(fileSet);

  if (!fileSet.has('index.html')) {
    addError('dist-incomplete', 'dist is missing index.html');
  }

  /* Inventory path normalization and structural collisions. */
  const compatSources = new Map();
  const canonicalTargets = new Map();

  const addSource = (source, label) => {
    if (typeof source !== 'string' || !source.startsWith('/')) {
      addError('inventory-invalid', `${label} must be a root-relative path: ${source}`);
      return null;
    }
    const normalized = comparablePath(normalizePathname(source));
    const existing = compatSources.get(normalized);
    if (existing) {
      addError(
        'route-collision',
        `${source} is declared more than once (${existing} and ${label})`
      );
    } else {
      compatSources.set(normalized, label);
    }
    return normalized;
  };

  const addCanonical = (target, label) => {
    if (typeof target !== 'string' || !target.startsWith('/')) {
      addError('inventory-invalid', `${label} must be a root-relative path: ${target}`);
      return null;
    }
    const normalized = comparablePath(normalizePathname(target));
    const existing = canonicalTargets.get(normalized);
    if (existing) {
      addError(
        'route-collision',
        `${target} is declared as a destination more than once (${existing} and ${label})`
      );
    } else {
      canonicalTargets.set(normalized, label);
    }
    return normalized;
  };

  const routeRecords = [];
  const routeSlugs = new Map();
  for (const [index, route] of routes.entries()) {
    const label = `route ${route?.legacyUrl ?? index}`;
    if (!route || typeof route !== 'object') {
      addError('inventory-invalid', `${label} is not an object`);
      continue;
    }

    const source = addSource(route.legacyUrl, label);
    const slugSource = addSource(route.slugUrl, `${label} slug URL`);
    const destination = addCanonical(route.canonicalUrl, label);

    if (typeof route.slug === 'string' && SLUG_PATTERN.test(route.slug)) {
      const previous = routeSlugs.get(route.slug);
      if (previous) {
        addError(
          'route-collision',
          `slug "${route.slug}" is declared by both ${previous} and ${label}`
        );
      } else {
        routeSlugs.set(route.slug, label);
      }
    } else {
      addError(
        'inventory-invalid',
        `${label} slug must be lowercase words separated by single hyphens: ${route.slug}`
      );
    }

    if (!isIsoTimestamp(route.published)) {
      addError(
        'inventory-invalid',
        `${label} published must be an ISO 8601 timestamp with an explicit UTC offset: ${route.published}`
      );
    } else {
      const derived = formatDatedPostUrl(route.published, route.slug);
      if (derived == null) {
        addError(
          'inventory-invalid',
          `${label} published is not a representable date: ${route.published}`
        );
      } else if (route.canonicalUrl !== derived) {
        addError(
          'inventory-invalid',
          `${label} canonical URL ${route.canonicalUrl} does not match its UTC publication date; expected ${derived}`
        );
      }
    }

    if (route.slugUrl !== `/posts/${route.slug}/`) {
      addError(
        'inventory-invalid',
        `${label} slug URL ${route.slugUrl} does not match slug ${route.slug}`
      );
    }

    if (!source || !slugSource || !destination) continue;

    if (source === destination || slugSource === destination) {
      addError(
        'route-collision',
        `${route.legacyUrl} cannot also be its own destination`
      );
    }
    if (source === slugSource) {
      addError(
        'route-collision',
        `${route.legacyUrl} and ${route.slugUrl} name the same compatibility path`
      );
    }
    if (!Array.isArray(route.requiredHeadings)) {
      addError('inventory-invalid', `${label} requiredHeadings must be an array`);
    }

    routeRecords.push({
      ...route,
      sourcePath: source,
      slugSourcePath: slugSource,
      destinationPath: destination,
      requiredHeadings: Array.isArray(route.requiredHeadings)
        ? route.requiredHeadings
        : [],
    });
  }

  const pageRecords = [];
  for (const [index, page] of pagesContract.entries()) {
    const label = `page ${page?.url ?? index}`;
    if (!page || typeof page !== 'object') {
      addError('inventory-invalid', `${label} is not an object`);
      continue;
    }
    const url = addCanonical(page.url, label);
    const canonicalPath = toSitePath(page.canonicalUrl);
    if (canonicalPath == null) {
      addError(
        'inventory-invalid',
        `${label} canonicalUrl is not a local path: ${page.canonicalUrl}`
      );
    }
    if (!url || canonicalPath == null) continue;
    if (!Array.isArray(page.requiredAnchors)) {
      addError('inventory-invalid', `${label} requiredAnchors must be an array`);
    }
    pageRecords.push({
      ...page,
      path: url,
      canonicalPath: comparablePath(canonicalPath),
      requiredAnchors: Array.isArray(page.requiredAnchors)
        ? page.requiredAnchors
        : [],
    });
  }

  const aliasRecords = [];
  for (const [index, alias] of aliases.entries()) {
    const label = `alias ${alias?.from ?? index}`;
    if (!alias || typeof alias !== 'object') {
      addError('inventory-invalid', `${label} is not an object`);
      continue;
    }
    const source = addSource(alias.from, label);
    const to = toSitePath(alias.to);
    if (to == null) {
      addError('inventory-invalid', `${label} target is not a local path: ${alias.to}`);
    }
    if (source && to) {
      if (comparablePath(source) === comparablePath(to)) {
        addError('route-collision', `${alias.from} cannot alias itself`);
      }
      aliasRecords.push({
        ...alias,
        sourcePath: source,
        targetPath: comparablePath(to),
      });
    }
  }

  for (const [source, label] of compatSources) {
    if (canonicalTargets.has(source)) {
      addError(
        'route-collision',
        `${source} is both a compatibility source (${label}) and a canonical destination`
      );
    }
  }

  for (const alias of aliasRecords) {
    if (alias.kind === 'html-meta-refresh' && compatSources.has(alias.targetPath)) {
      addError(
        'redirect-chain',
        `${alias.sourcePath} would redirect to another compatibility source ${alias.targetPath}`
      );
    }
  }

  /* Output route collisions. */
  const outputRoutes = new Map();
  const lowerOutputRoutes = new Map();
  for (const [rel, info] of distPages) {
    const existing = outputRoutes.get(info.url);
    if (existing) {
      addError(
        'route-collision',
        `${info.url} is emitted by both ${existing} and ${rel}`
      );
    } else {
      outputRoutes.set(info.url, rel);
    }

    const lower = info.url.toLowerCase();
    const lowerExisting = lowerOutputRoutes.get(lower);
    if (lowerExisting && lowerExisting !== info.url) {
      addError(
        'route-case-collision',
        `${info.url} and ${lowerExisting} differ only by case`
      );
    } else if (!lowerExisting) {
      lowerOutputRoutes.set(lower, info.url);
    }
  }

  /* Canonical pages and their required anchors. */
  function checkCanonicalPage(info, expectedPath, codePrefix, { requireNoindex = null } = {}) {
    if (!info) return false;
    if (info.kind === 'empty') {
      addError(`${codePrefix}-empty`, `${expectedPath} is an empty HTML file`);
      return false;
    }
    if (info.kind === 'invalid-redirect') {
      addError(
        `${codePrefix}-redirect`,
        `${expectedPath} has an invalid meta refresh: ${info.refresh.error}`
      );
      return false;
    }
    if (info.kind === 'script-redirect') {
      addError(
        `${codePrefix}-js-redirect`,
        `${expectedPath} is a JavaScript-only redirect instead of a canonical page`
      );
      return false;
    }
    if (info.kind === 'redirect') {
      addError(
        `${codePrefix}-redirect`,
        `${expectedPath} is a redirect document, not a canonical page`
      );
      return false;
    }
    if (info.kind !== 'page') {
      addError(
        `${codePrefix}-kind`,
        `${expectedPath} resolves to an unrecognised document (${info.kind})`
      );
      return false;
    }

    if (comparablePath(info.url) !== comparablePath(expectedPath)) {
      addError(
        `${codePrefix}-alias`,
        `${expectedPath} is served from ${info.url} instead of its canonical path`
      );
    }

    if (info.canonical == null) {
      addError(
        `${codePrefix}-canonical-missing`,
        `${expectedPath} has no canonical link`
      );
    } else if (info.canonical.count > 1) {
      addError(
        `${codePrefix}-canonical-duplicate`,
        `${expectedPath} has ${info.canonical.count} canonical links`
      );
    } else if (!info.canonical.href) {
      addError(
        `${codePrefix}-canonical-missing`,
        `${expectedPath} has an empty canonical link`
      );
    } else {
      const canonical = resolveTarget(info.rel, info.canonical.href);
      if (canonical.error) {
        addError(
          `${codePrefix}-canonical-invalid`,
          `${expectedPath} has an invalid canonical link: ${info.canonical.href}`
        );
      } else if (canonical.external) {
        addError(
          `${codePrefix}-canonical-external`,
          `${expectedPath} has an off-site canonical link: ${canonical.url.href}`
        );
      } else if (comparablePath(canonical.path) !== comparablePath(expectedPath)) {
        addError(
          `${codePrefix}-canonical-mismatch`,
          `${expectedPath} has canonical link ${canonical.path}`
        );
      }
    }

    if (requireNoindex === true && !info.noindex) {
      addError(
        `${codePrefix}-indexable`,
        `${expectedPath} must be marked noindex`
      );
    }
    if (requireNoindex === false && info.noindex) {
      addError(`${codePrefix}-noindex`, `${expectedPath} is marked noindex`);
    }

    return true;
  }

  const headingExceptions = new Map();
  for (const [index, exception] of exceptions.entries()) {
    if (!exception || typeof exception !== 'object') {
      addError(
        'inventory-invalid',
        `heading exception ${index} is not an object`
      );
      continue;
    }
    const route = routeRecords.find(
      (candidate) =>
        comparablePath(candidate.destinationPath) ===
        comparablePath(normalizePathname(exception.canonicalUrl ?? ''))
    );
    if (!route) {
      addError(
        'inventory-invalid',
        `heading exception ${exception.canonicalUrl} does not name a declared article`
      );
      continue;
    }
    if (
      typeof exception.heading !== 'string' ||
      !route.requiredHeadings.includes(exception.heading)
    ) {
      addError(
        'inventory-invalid',
        `heading exception ${exception.canonicalUrl}#${exception.heading} does not name a required heading`
      );
      continue;
    }
    headingExceptions.set(
      `${route.destinationPath}\u0000${exception.heading}`,
      exception.reason ?? 'approved heading exception'
    );
  }

  for (const page of pageRecords) {
    const rel = resolveDist(page.path);
    if (!rel) {
      addError('page-missing', `${page.url} has no generated output`);
      continue;
    }
    const info = distPages.get(rel);
    if (!info) {
      addError('page-not-page', `${page.url} resolves to a non-HTML asset: ${rel}`);
      continue;
    }
    if (
      checkCanonicalPage(info, page.canonicalPath, 'page', {
        requireNoindex: page.indexable === false ? true : false,
      })
    ) {
      for (const anchor of page.requiredAnchors) {
        if (!info.ids.has(anchor) && !info.anchorNames.has(anchor)) {
          addError(
            'missing-anchor',
            `${page.url} is missing required anchor #${anchor}`
          );
        }
      }
    }
  }

  /*
   * Every retained compatibility path must be an immediate redirect to the
   * dated canonical article. Legacy Jekyll URLs and the retired slug-only
   * `/posts/<slug>/` paths are checked identically so neither may chain
   * through the other.
   */
  function verifyArticleRedirect({
    prefix,
    sourceUrl,
    sourcePath,
    canonicalUrl,
    destinationPath,
    description,
  }) {
    const sourceRel = resolveDist(sourcePath);
    if (!sourceRel) {
      addError(
        `${prefix}-source-missing`,
        `${sourceUrl} -> ${canonicalUrl}: ${description} has no generated output`
      );
      return;
    }
    const sourcePage = distPages.get(sourceRel);
    if (!sourcePage) {
      addError(
        `${prefix}-source-not-page`,
        `${sourceUrl} -> ${canonicalUrl}: ${description} is a non-HTML asset`
      );
      return;
    }
    if (sourcePage.kind !== 'redirect') {
      addError(
        `${prefix}-source-not-redirect`,
        `${sourceUrl} -> ${canonicalUrl}: ${description} is a ${sourcePage.kind}, not an immediate redirect`
      );
      return;
    }

    const target = resolveTarget(sourcePage.rel, sourcePage.refresh.target);
    if (target.error) {
      addError(
        `${prefix}-target-invalid`,
        `${sourceUrl} -> ${canonicalUrl}: ${target.error}`
      );
    } else if (target.external) {
      addError(
        `${prefix}-target-external`,
        `${sourceUrl} -> ${canonicalUrl}: redirects off-site to ${target.url.href}`
      );
    } else if (
      canonicalUrl.startsWith(DATED_POST_PREFIX)
        ? target.path !== canonicalUrl
        : comparablePath(target.path) !== destinationPath
    ) {
      addError(
        `${prefix}-target-mismatch`,
        `${sourceUrl} -> ${canonicalUrl}: redirects to ${target.path}`
      );
    }
  }

  for (const route of routeRecords) {
    const destinationRel = resolveDist(route.destinationPath);
    if (!destinationRel) {
      addError(
        'route-destination-missing',
        `${route.legacyUrl} -> ${route.canonicalUrl}: destination has no generated output`
      );
    } else {
      const destinationPage = distPages.get(destinationRel);
      if (!destinationPage) {
        addError(
          'route-destination-not-page',
          `${route.legacyUrl} -> ${route.canonicalUrl}: destination is a non-HTML asset`
        );
      } else if (
        checkCanonicalPage(
          destinationPage,
          route.canonicalUrl,
          'destination',
          { requireNoindex: false }
        )
      ) {
        for (const heading of route.requiredHeadings) {
          if (
            destinationPage.ids.has(heading) ||
            destinationPage.anchorNames.has(heading)
          ) {
            continue;
          }
          const exception = headingExceptions.get(
            `${route.destinationPath}\u0000${heading}`
          );
          if (exception) {
            addWarning(
              'heading-exception',
              `${route.canonicalUrl}#${heading} is missing as approved: ${exception}`
            );
          } else {
            addError(
              'missing-heading',
              `${route.canonicalUrl} is missing required heading #${heading}`
            );
          }
        }
      }
    }

    verifyArticleRedirect({
      prefix: 'route',
      sourceUrl: route.legacyUrl,
      sourcePath: route.sourcePath,
      canonicalUrl: route.canonicalUrl,
      destinationPath: route.destinationPath,
      description: 'legacy URL',
    });
    verifyArticleRedirect({
      prefix: 'slug',
      sourceUrl: route.slugUrl,
      sourcePath: route.slugSourcePath,
      canonicalUrl: route.canonicalUrl,
      destinationPath: route.destinationPath,
      description: 'slug-only URL',
    });
  }

  /* Every redirect document, including aliases not named in the inventory. */
  const redirectPages = [...distPages.values()].filter(
    (info) => info.kind === 'redirect' || info.kind === 'invalid-redirect'
  );
  const redirectTargets = new Set();

  for (const info of distPages.values()) {
    if (info.kind === 'script-redirect') {
      addError(
        'redirect-js-only',
        `${info.url} relies on JavaScript instead of an immediate meta refresh`
      );
    }
    if (info.kind === 'empty') {
      addError('route-empty', `${info.url} is an empty HTML file`);
    }
  }

  for (const info of redirectPages) {
    const sourcePath = info.url;

    if (info.kind === 'invalid-redirect') {
      addError('redirect-invalid', `${sourcePath}: ${info.refresh.error}`);
      continue;
    }

    const target = resolveTarget(info.rel, info.refresh.target);
    if (target.error) {
      addError('redirect-invalid-target', `${sourcePath}: ${target.error}`);
      continue;
    }
    if (target.external) {
      addError(
        'redirect-external',
        `${sourcePath} redirects off-site to ${target.url.href}`
      );
      continue;
    }
    if (comparablePath(target.path) === comparablePath(sourcePath)) {
      addError('redirect-self', `${sourcePath} redirects to itself`);
      continue;
    }
    if (target.path.startsWith(RETIRED_POST_PREFIX)) {
      addError(
        'redirect-retired-target',
        `${sourcePath} redirects to retired slug-only path ${target.path}; redirects must target the dated canonical URL`
      );
    }
    if (
      target.path.startsWith(DATED_POST_PREFIX) &&
      !DATED_POST_PATTERN.test(target.path)
    ) {
      addError(
        'redirect-canonical-format',
        `${sourcePath} redirects to ${target.path}, which is not a dated canonical post URL`
      );
    }
    if (
      sourcePath.startsWith(RETIRED_POST_PREFIX) &&
      !DATED_POST_PATTERN.test(target.path)
    ) {
      addError(
        'redirect-retired-source',
        `${sourcePath} must redirect directly to a dated canonical post URL, not ${target.path}`
      );
    }
    if (info.refresh.delay > 0) {
      addError(
        'redirect-delay',
        `${sourcePath} uses a ${info.refresh.delay}s delay instead of an immediate redirect`
      );
    }

    const targetRel = resolveDist(target.path);
    if (!targetRel) {
      addError(
        'redirect-missing',
        `${sourcePath} redirects to missing output ${target.path}`
      );
      continue;
    }
    if (targetRel === info.rel) {
      addError(
        'redirect-self',
        `${sourcePath} redirects to an alias of itself: ${target.path}`
      );
      continue;
    }

    const targetPage = distPages.get(targetRel);
    if (!targetPage) {
      addError(
        'redirect-not-page',
        `${sourcePath} redirects to a non-HTML asset: ${target.path}`
      );
      continue;
    }
    if (
      targetPage.kind === 'redirect' ||
      targetPage.kind === 'invalid-redirect'
    ) {
      addError(
        'redirect-chain',
        `${sourcePath} -> ${followRedirectChain(
          sourcePath,
          target.path,
          distPages,
          resolveDist,
          resolveTarget
        )} (redirects must point directly at a canonical page)`
      );
      continue;
    }
    if (targetPage.kind === 'script-redirect') {
      addError(
        'redirect-js-target',
        `${sourcePath} redirects to a JavaScript-only redirect at ${target.path}`
      );
      continue;
    }
    if (targetPage.kind === 'empty') {
      addError(
        'redirect-empty-target',
        `${sourcePath} redirects to an empty page at ${target.path}`
      );
      continue;
    }
    if (targetPage.kind !== 'page') {
      addError(
        'redirect-target-kind',
        `${sourcePath} redirects to a ${targetPage.kind} document at ${target.path}`
      );
      continue;
    }
    if (targetPage.noindex) {
      addError(
        'redirect-noindex-target',
        `${sourcePath} redirects to a noindex page at ${target.path}`
      );
    }

    if (info.canonical == null) {
      addError(
        'redirect-canonical-missing',
        `${sourcePath} has no canonical link`
      );
    } else if (info.canonical.count > 1) {
      addError(
        'redirect-canonical-duplicate',
        `${sourcePath} has ${info.canonical.count} canonical links`
      );
    } else if (!info.canonical.href) {
      addError(
        'redirect-canonical-missing',
        `${sourcePath} has an empty canonical link`
      );
    } else {
      const canonical = resolveTarget(info.rel, info.canonical.href);
      if (canonical.error) {
        addError(
          'redirect-canonical-invalid',
          `${sourcePath} has an invalid canonical link: ${info.canonical.href}`
        );
      } else if (canonical.external) {
        addError(
          'redirect-canonical-external',
          `${sourcePath} has an off-site canonical link: ${canonical.url.href}`
        );
      } else if (
        comparablePath(canonical.path) !== comparablePath(target.path)
      ) {
        addError(
          'redirect-canonical-mismatch',
          `${sourcePath} redirects to ${target.path} but its canonical link is ${canonical.path}`
        );
      }
    }

    if (info.fallbackLinks.length === 0) {
      addError(
        'redirect-fallback-missing',
        `${sourcePath} has no visible fallback link`
      );
    } else {
      const matching = info.fallbackLinks.find((link) => {
        const resolved = resolveTarget(info.rel, link.href);
        return (
          resolved.path != null &&
          comparablePath(resolved.path) === comparablePath(target.path)
        );
      });
      if (!matching) {
        addError(
          'redirect-fallback-mismatch',
          `${sourcePath} has no visible fallback link to ${target.path}`
        );
      } else if (!matching.text) {
        addError(
          'redirect-fallback-empty',
          `${sourcePath} fallback link to ${target.path} has no visible text`
        );
      }
    }

    if (targetPage.url !== target.path) {
      addWarning(
        'redirect-alias-target',
        `${sourcePath} redirects to ${target.path}, whose canonical form is ${targetPage.url}`
      );
    }

    redirectTargets.add(comparablePath(target.path));
  }

  /* Feed alias redirect semantics are explicitly not HTML redirects. */
  for (const alias of aliasRecords) {
    const sourceRel = resolveDist(alias.sourcePath);
    if (!sourceRel) {
      addError(
        'alias-source-missing',
        `${alias.from} has no generated output`
      );
      continue;
    }
    const page = distPages.get(sourceRel);
    if (alias.kind === 'html-meta-refresh') {
      if (!page) {
        addError(
          'alias-not-page',
          `${alias.from} resolves to a non-HTML asset`
        );
        continue;
      }
      if (page.kind !== 'redirect') {
        addError(
          'alias-not-redirect',
          `${alias.from} must be an immediate redirect to ${alias.to}`
        );
        continue;
      }
      const target = resolveTarget(page.rel, page.refresh.target);
      if (target.error || target.external) {
        addError(
          'alias-target-invalid',
          `${alias.from} has an invalid redirect target: ${page.refresh.target}`
        );
      } else if (comparablePath(target.path) !== alias.targetPath) {
        addError(
          'alias-target-mismatch',
          `${alias.from} redirects to ${target.path} instead of ${alias.to}`
        );
      }
    } else if (alias.kind === 'rss-alias') {
      if (page) {
        addError(
          'alias-html-redirect',
          `${alias.from} is an HTML redirect; the feed alias must serve the feed`
        );
      }
    } else {
      addError('alias-kind', `${alias.from} has unknown alias kind ${alias.kind}`);
    }
  }

  /* Required assets, including byte-level integrity. */
  let assetsMatched = 0;
  for (const asset of assets) {
    if (!asset || typeof asset.url !== 'string') {
      addError('inventory-invalid', 'asset entry has no url');
      continue;
    }
    const assetPath = toSitePath(asset.url);
    if (assetPath == null) {
      addError('inventory-invalid', `asset url is not local: ${asset.url}`);
      continue;
    }
    const rel = resolveDist(assetPath);
    if (!rel) {
      addError('missing-asset', `${asset.url} is missing from dist`);
      continue;
    }

    let fileInfo;
    try {
      fileInfo = await stat(path.join(dist, rel));
    } catch (error) {
      addError('missing-asset', `${asset.url} is missing from dist: ${error.message}`);
      continue;
    }
    if (!fileInfo.isFile()) {
      addError('asset-not-file', `${asset.url} is not a regular file`);
      continue;
    }

    const content = await readFile(path.join(dist, rel));
    if (typeof asset.bytes === 'number' && content.length !== asset.bytes) {
      addError(
        'asset-integrity',
        `${asset.url} is ${content.length} bytes; expected ${asset.bytes}`
      );
      continue;
    }
    if (typeof asset.sha256_16 === 'string' && asset.sha256_16) {
      const digest = createHash('sha256').update(content).digest('hex');
      if (!digest.startsWith(asset.sha256_16.toLowerCase())) {
        addError(
          'asset-integrity',
          `${asset.url} sha256 ${digest.slice(0, 16)} does not match ${asset.sha256_16}`
        );
        continue;
      }
    }
    assetsMatched += 1;
  }

  /* Local document links and fragments. */
  function followRedirectForFragment(info) {
    if (!info || info.kind !== 'redirect') return info;
    const target = resolveTarget(info.rel, info.refresh.target);
    if (target.error || target.external) return null;
    const rel = resolveDist(target.path);
    return rel ? distPages.get(rel) : null;
  }

  function checkReference(pageUrl, rawReference) {
    const value = rawReference.trim();
    if (!value) return null;
    if (
      /^(?:data:|mailto:|tel:|javascript:|blob:|about:|sms:|irc:|ftp:)/i.test(
        value
      )
    ) {
      return null;
    }

    let resolved;
    try {
      resolved = new URL(value, new URL(pageUrl, origin));
    } catch {
      return { error: 'invalid URL' };
    }

    if (resolved.origin !== origin) return null;

    const rel = resolveDist(resolved.pathname);
    if (!rel) return { error: 'missing file' };

    const target = distPages.get(rel);
    if (
      target &&
      (target.kind === 'invalid-redirect' ||
        target.kind === 'script-redirect' ||
        target.kind === 'empty')
    ) {
      return { error: `target is a ${target.kind}` };
    }

    const hash = resolved.hash;
    if (hash && hash !== '#' && !hash.startsWith('#:~:')) {
      const fragment = safeDecodeURIComponent(hash.slice(1));
      if (fragment && !fragment.startsWith(':~:')) {
        let fragmentPage = target ?? null;
        if (fragmentPage && fragmentPage.kind === 'redirect') {
          fragmentPage = followRedirectForFragment(fragmentPage);
        }
        if (
          fragmentPage &&
          fragmentPage.kind === 'page' &&
          !fragmentPage.ids.has(fragment) &&
          !fragmentPage.anchorNames.has(fragment)
        ) {
          return { error: `missing fragment #${fragment}` };
        }
      }
    }

    return null;
  }

  for (const info of distPages.values()) {
    const seen = new Set();
    for (const reference of collectReferences(info.document)) {
      const key = `${info.url}\u0000${reference}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const result = checkReference(info.url, reference);
      if (result?.error) {
        addError(
          'broken-reference',
          `${info.url}: ${reference} (${result.error})`
        );
      }
    }
  }

  /* Local references in generated CSS. */
  for (const rel of distFiles.filter(isCssFile)) {
    const css = await readFile(path.join(dist, rel), 'utf8');
    const pageUrl = `/${rel}`;
    const seen = new Set();

    for (const match of css.matchAll(
      /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"]*))\s*\)/gi
    )) {
      const reference = (match[1] ?? match[2] ?? match[3] ?? '').trim();
      if (
        !reference ||
        seen.has(reference) ||
        /^(?:attr|env|var)\(/i.test(reference)
      ) {
        continue;
      }
      seen.add(reference);

      const result = checkReference(pageUrl, reference);
      if (result?.error) {
        addError(
          'broken-css-reference',
          `${pageUrl}: ${reference} (${result.error})`
        );
      }
    }
  }

  /* Sitemap coverage and exclusions. */
  const sitemapContract =
    inventory.sitemap && typeof inventory.sitemap === 'object'
      ? inventory.sitemap
      : {};
  const requiredSitemapPaths = new Set();
  const excludedSitemapPaths = new Set();

  for (const value of Array.isArray(sitemapContract.requiredUrls)
    ? sitemapContract.requiredUrls
    : []) {
    const target = toSitePath(value);
    if (target == null) {
      addError(
        'inventory-invalid',
        `sitemap required URL is not local: ${value}`
      );
      continue;
    }
    requiredSitemapPaths.add(comparablePath(target));
  }
  for (const value of Array.isArray(sitemapContract.excludedUrls)
    ? sitemapContract.excludedUrls
    : []) {
    const target = toSitePath(value);
    if (target == null) {
      addError(
        'inventory-invalid',
        `sitemap excluded URL is not local: ${value}`
      );
      continue;
    }
    excludedSitemapPaths.add(comparablePath(target));
  }

  /*
   * The sitemap contract names canonical URLs only: dated `/post/.../` paths
   * belong in requiredUrls and both compatibility spaces (Jekyll `.html` and
   * slug-only `/posts/.../`) belong in excludedUrls.
   */
  for (const required of requiredSitemapPaths) {
    if (required.startsWith(RETIRED_POST_PREFIX)) {
      addError(
        'inventory-invalid',
        `sitemap.requiredUrls lists the retired slug-only URL ${required}`
      );
    } else if (
      required.startsWith(DATED_POST_PREFIX) &&
      !DATED_POST_PATTERN.test(`${required}/`)
    ) {
      addError(
        'inventory-invalid',
        `sitemap.requiredUrls lists a non-dated canonical post URL ${required}`
      );
    }
  }
  for (const excluded of excludedSitemapPaths) {
    if (excluded.startsWith(DATED_POST_PREFIX)) {
      addError(
        'inventory-invalid',
        `sitemap.excludedUrls excludes canonical post URL ${excluded}`
      );
    }
  }

  let sitemapRoot = null;
  if (fileSet.has('sitemap-index.xml')) {
    sitemapRoot = 'sitemap-index.xml';
  } else if (fileSet.has('sitemap.xml')) {
    sitemapRoot = 'sitemap.xml';
  } else {
    const chunk = distFiles.find((rel) => /^sitemap-\d+\.xml$/i.test(rel));
    if (chunk) sitemapRoot = chunk;
  }

  /* The inventory itself must not silently drop a retained expectation. */
  for (const route of routeRecords) {
    if (!requiredSitemapPaths.has(route.destinationPath)) {
      addError(
        'inventory-sitemap-coverage',
        `sitemap.requiredUrls omits canonical article ${route.canonicalUrl}`
      );
    }
    if (!excludedSitemapPaths.has(route.sourcePath)) {
      addError(
        'inventory-sitemap-exclusion',
        `sitemap.excludedUrls omits legacy URL ${route.legacyUrl}`
      );
    }
    if (!excludedSitemapPaths.has(route.slugSourcePath)) {
      addError(
        'inventory-sitemap-exclusion',
        `sitemap.excludedUrls omits slug-only alias ${route.slugUrl}`
      );
    }
  }
  for (const page of pageRecords) {
    if (page.indexable === false) {
      if (!excludedSitemapPaths.has(page.path)) {
        addError(
          'inventory-sitemap-exclusion',
          `sitemap.excludedUrls omits non-indexable page ${page.url}`
        );
      }
    } else if (!requiredSitemapPaths.has(page.path)) {
      addError(
        'inventory-sitemap-coverage',
        `sitemap.requiredUrls omits canonical page ${page.url}`
      );
    }
  }
  for (const alias of aliasRecords) {
    if (!excludedSitemapPaths.has(alias.sourcePath)) {
      addError(
        'inventory-sitemap-exclusion',
        `sitemap.excludedUrls omits compatibility alias ${alias.from}`
      );
    }
  }

  const sitemapCanonicalPaths = new Set();
  const sitemapLeafFiles = new Set();
  let sitemapUrlCount = 0;

  if (!sitemapRoot) {
    addError(
      'sitemap-missing',
      'dist has no sitemap-index.xml, sitemap.xml, or sitemap-<n>.xml'
    );
  } else {
    const visitedSitemaps = new Set();

    async function validateSitemap(rel, depth = 0) {
      if (visitedSitemaps.has(rel)) return;
      visitedSitemaps.add(rel);

      if (depth > 3) {
        addError('sitemap-depth', `sitemap nesting is too deep at ${rel}`);
        return;
      }

      const xml = await readFile(path.join(dist, rel), 'utf8');
      const isIndex = isSitemapIndexDocument(xml);
      const isUrlset = isSitemapUrlsetDocument(xml);
      if (!isIndex && !isUrlset) {
        addError('sitemap-root', `${rel} is not a sitemap or sitemap index`);
        return;
      }

      const locations = extractLocElements(xml);
      if (locations.length === 0) {
        addError('sitemap-empty', `${rel} contains no <loc> entries`);
        return;
      }

      if (isIndex) {
        for (const location of locations) {
          const child = resolveTarget(rel, location);
          if (child.error) {
            addError('sitemap-child-invalid', `${rel}: ${child.error}`);
            continue;
          }
          if (child.external) {
            addWarning(
              'sitemap-child-external',
              `${rel} references an off-site sitemap: ${location}`
            );
            continue;
          }

          const childRel = resolveDist(child.path);
          if (!childRel) {
            addError(
              'sitemap-child-missing',
              `${rel} references a missing sitemap: ${child.path}`
            );
            continue;
          }
          if (!/\.xml$/i.test(childRel)) {
            addError(
              'sitemap-child-type',
              `${rel} references a non-XML sitemap: ${child.path}`
            );
            continue;
          }
          await validateSitemap(childRel, depth + 1);
        }
        return;
      }

      for (const location of locations) {
        const target = resolveTarget(rel, location);
        if (target.error) {
          addError('sitemap-url-invalid', `${rel}: ${target.error}`);
          continue;
        }
        if (target.external) {
          addError(
            'sitemap-url-external',
            `${rel} lists an off-site URL: ${target.url.href}`
          );
          continue;
        }

        const pagePath = target.path;
        if (pagePath.startsWith(RETIRED_POST_PREFIX)) {
          addError(
            'sitemap-retired-url',
            `${rel} lists the retired slug-only URL ${pagePath}; the canonical URL is the dated /post/.../ path`
          );
          continue;
        }
        if (/\.html?$/i.test(pagePath)) {
          addError(
            'sitemap-legacy-url',
            `${rel} lists a legacy HTML URL instead of a canonical URL: ${pagePath}`
          );
          continue;
        }

        const pageRel = resolveDist(pagePath);
        if (!pageRel) {
          addError(
            'sitemap-missing-page',
            `${rel} lists missing output: ${pagePath}`
          );
          continue;
        }

        if (
          pagePath.startsWith(DATED_POST_PREFIX) &&
          !DATED_POST_PATTERN.test(pagePath)
        ) {
          addError(
            'sitemap-canonical-format',
            `${rel} lists ${pagePath}, which is not a dated canonical post URL`
          );
          continue;
        }

        const page = distPages.get(pageRel);
        if (!page) {
          addError(
            'sitemap-not-page',
            `${rel} lists a non-HTML asset: ${pagePath}`
          );
          continue;
        }
        if (page.kind === 'redirect' || page.kind === 'invalid-redirect') {
          addError(
            'sitemap-redirect',
            `${rel} lists a redirect document: ${pagePath}`
          );
          continue;
        }
        if (page.kind !== 'page') {
          addError(
            'sitemap-page-kind',
            `${rel} lists a ${page.kind} document: ${pagePath}`
          );
          continue;
        }
        if (page.noindex) {
          addError(
            'sitemap-noindex',
            `${rel} lists a noindex page: ${pagePath}`
          );
          continue;
        }
        if (page.url !== pagePath) {
          addWarning(
            'sitemap-alias-url',
            `${rel} lists ${pagePath}, whose canonical form is ${page.url}`
          );
        }

        const key = comparablePath(pagePath);
        if (sitemapCanonicalPaths.has(key)) {
          addError(
            'sitemap-duplicate',
            `${rel} lists the same canonical page more than once: ${pagePath}`
          );
          continue;
        }
        sitemapCanonicalPaths.add(key);
        sitemapUrlCount += 1;
      }

      sitemapLeafFiles.add(rel);
    }

    await validateSitemap(sitemapRoot);

    for (const required of requiredSitemapPaths) {
      if (!sitemapCanonicalPaths.has(required)) {
        addError(
          'sitemap-coverage',
          `${sitemapRoot} is missing required URL ${required}`
        );
      }
    }
    for (const excluded of excludedSitemapPaths) {
      if (sitemapCanonicalPaths.has(excluded)) {
        addError(
          'sitemap-excluded-url',
          `${sitemapRoot} lists excluded URL ${excluded}`
        );
      }
    }
    for (const route of routeRecords) {
      if (!sitemapCanonicalPaths.has(route.destinationPath)) {
        addError(
          'sitemap-coverage',
          `Canonical article ${route.canonicalUrl} is missing from ${sitemapRoot}`
        );
      }
    }
    for (const target of redirectTargets) {
      if (target.startsWith(DATED_POST_PREFIX) && !sitemapCanonicalPaths.has(target)) {
        addError(
          'sitemap-coverage',
          `Redirect target ${target} is missing from ${sitemapRoot}`
        );
      }
    }
    for (const info of distPages.values()) {
      if (info.kind !== 'page' || !info.url.startsWith(DATED_POST_PREFIX)) continue;
      if (!sitemapCanonicalPaths.has(comparablePath(info.url))) {
        addError(
          'sitemap-coverage',
          `Canonical post ${info.url} (${info.rel}) is missing from ${sitemapRoot}`
        );
      }
    }
  }

  /*
   * The retained discovery URL is a contract, not a convenience: crawlers and
   * submitted sitemap URLs still point at it. It must be emitted and resolve
   * to the generated URL sets. A sitemap index may not list another index, so
   * sitemap-index.xml itself is not an acceptable target.
   */
  const legacySitemapPath =
    typeof sitemapContract.legacyUrl === 'string'
      ? sitemapContract.legacyUrl
      : null;
  const legacySitemapTargets = [];

  if (legacySitemapPath == null) {
    addError(
      'inventory-invalid',
      'sitemap.legacyUrl must declare the retained /sitemap.xml discovery URL'
    );
  }
  for (const value of Array.isArray(sitemapContract.legacyChildUrls)
    ? sitemapContract.legacyChildUrls
    : []) {
    const target = toSitePath(value);
    if (target == null) {
      addError(
        'inventory-invalid',
        `sitemap legacy child URL is not local: ${value}`
      );
      continue;
    }
    legacySitemapTargets.push(target);
  }
  if (legacySitemapPath != null && legacySitemapTargets.length === 0) {
    addError(
      'inventory-invalid',
      'sitemap.legacyChildUrls must list the generated sitemap files'
    );
  }

  if (legacySitemapPath != null) {
    const target = toSitePath(legacySitemapPath);
    const legacyRel = target == null ? null : resolveDist(target);

    if (target == null) {
      addError(
        'inventory-invalid',
        `sitemap.legacyUrl is not local: ${legacySitemapPath}`
      );
    } else if (!legacyRel) {
      addError(
        'legacy-sitemap-missing',
        `${legacySitemapPath} is not emitted; crawlers must still reach the generated sitemaps`
      );
    } else if (legacyRel !== sitemapRoot) {
      const xml = await readFile(path.join(dist, legacyRel), 'utf8');
      const locations = extractLocElements(xml);

      if (!isSitemapIndexDocument(xml)) {
        addError(
          'legacy-sitemap-index',
          `${legacySitemapPath} must be a sitemap index listing the generated sitemap files`
        );
      } else if (locations.length === 0) {
        addError(
          'legacy-sitemap-empty',
          `${legacySitemapPath} contains no <sitemap> entries`
        );
      } else {
        const referenced = new Set();

        for (const location of locations) {
          const child = resolveTarget(legacyRel, location);
          if (child.error) {
            addError(
              'legacy-sitemap-child-invalid',
              `${legacySitemapPath}: ${child.error}`
            );
            continue;
          }
          if (child.external) {
            addError(
              'legacy-sitemap-child-external',
              `${legacySitemapPath} references an off-site sitemap: ${location}`
            );
            continue;
          }

          const childRel = resolveDist(child.path);
          if (!childRel) {
            addError(
              'legacy-sitemap-child-missing',
              `${legacySitemapPath} references a missing sitemap: ${child.path}`
            );
            continue;
          }
          if (!/\.xml$/i.test(childRel)) {
            addError(
              'legacy-sitemap-child-type',
              `${legacySitemapPath} references a non-XML sitemap: ${child.path}`
            );
            continue;
          }

          const childXml = await readFile(path.join(dist, childRel), 'utf8');
          if (isSitemapIndexDocument(childXml)) {
            addError(
              'legacy-sitemap-nested',
              `${legacySitemapPath} references another sitemap index: ${child.path}`
            );
            continue;
          }
          if (sitemapLeafFiles.size > 0 && !sitemapLeafFiles.has(childRel)) {
            addError(
              'legacy-sitemap-target',
              `${legacySitemapPath} references ${child.path}, which is not a generated sitemap`
            );
            continue;
          }

          const key = comparablePath(child.path);
          if (referenced.has(key)) {
            addError(
              'legacy-sitemap-duplicate',
              `${legacySitemapPath} references the same sitemap more than once: ${child.path}`
            );
            continue;
          }
          referenced.add(key);
        }

        if (sitemapRoot) {
          for (const expected of legacySitemapTargets) {
            if (!referenced.has(comparablePath(expected))) {
              addError(
                'legacy-sitemap-coverage',
                `${legacySitemapPath} omits the generated sitemap ${expected}`
              );
            }
          }
          for (const leaf of sitemapLeafFiles) {
            if (!referenced.has(comparablePath(`/${leaf}`))) {
              addError(
                'legacy-sitemap-coverage',
                `${legacySitemapPath} omits the generated sitemap /${leaf}`
              );
            }
          }
        }
      }
    }
  }

  /* Feeds: both the alias and canonical path must serve the same RSS/Atom. */
  const feedContract =
    inventory.feed && typeof inventory.feed === 'object' ? inventory.feed : {};
  const feedPaths = [];
  const feedCanonicalPath = feedContract.canonicalUrl
    ? toSitePath(feedContract.canonicalUrl)
    : null;
  const feedAliasPath = feedContract.aliasUrl
    ? toSitePath(feedContract.aliasUrl)
    : null;

  if (feedCanonicalPath == null && feedAliasPath == null) {
    addError('inventory-invalid', 'feed must declare canonicalUrl or aliasUrl');
  }
  for (const feedPath of [feedCanonicalPath, feedAliasPath]) {
    if (feedPath && !feedPaths.includes(feedPath)) feedPaths.push(feedPath);
  }

  const feedAliasRecord = aliasRecords.find(
    (alias) => alias.kind === 'rss-alias'
  );
  if (feedAliasRecord) {
    if (
      feedAliasPath &&
      comparablePath(feedAliasRecord.sourcePath) !== comparablePath(feedAliasPath)
    ) {
      addError(
        'inventory-invalid',
        `feed alias ${feedAliasPath} does not match alias source ${feedAliasRecord.from}`
      );
    }
    if (
      feedCanonicalPath &&
      feedAliasRecord.targetPath !== comparablePath(feedCanonicalPath)
    ) {
      addError(
        'inventory-invalid',
        `feed alias target ${feedAliasRecord.to} does not match feed canonicalUrl ${feedContract.canonicalUrl}`
      );
    }
  } else if (feedAliasPath) {
    addError(
      'inventory-invalid',
      `feed alias ${feedAliasPath} is not declared in aliases`
    );
  }

  const feedEntries = new Map();
  let feedEntryCount = 0;

  for (const feedPath of feedPaths) {
    const rel = resolveDist(feedPath);
    if (!rel) {
      addError('feed-missing', `${feedPath} is missing from dist`);
      continue;
    }
    if (distPages.has(rel)) {
      addError('feed-not-feed', `${feedPath} is an HTML document, not a feed`);
      continue;
    }

    const xml = await readFile(path.join(dist, rel), 'utf8');
    if (!/<(?:rss|feed)\b/i.test(xml)) {
      addError('feed-root', `${feedPath} is not an RSS or Atom feed`);
      continue;
    }

    const entries = extractFeedEntries(xml);
    if (entries.length === 0) {
      addError('feed-empty', `${feedPath} contains no feed entries`);
    }
    feedEntries.set(feedPath, entries);
    feedEntryCount += entries.length;

    const seenLinks = new Set();
    for (const entry of entries) {
      if (!entry.link) {
        addError('feed-entry-link', `${feedPath} contains an entry without a link`);
        continue;
      }

      const target = resolveTarget(rel, entry.link);
      if (target.error) {
        addError(
          'feed-entry-invalid',
          `${feedPath}: ${target.error} (${entry.link})`
        );
        continue;
      }
      if (target.external) {
        addWarning(
          'feed-external-entry',
          `${feedPath} links off-site: ${target.url.href}`
        );
        continue;
      }

      const pagePath = target.path;
      if (pagePath.startsWith(RETIRED_POST_PREFIX)) {
        addError(
          'feed-retired-url',
          `${feedPath} links the retired slug-only URL ${pagePath}; feeds must link the dated canonical URL`
        );
        continue;
      }
      if (/\.html?$/i.test(pagePath)) {
        addError(
          'feed-legacy-url',
          `${feedPath} links a legacy HTML URL instead of a canonical URL: ${pagePath}`
        );
        continue;
      }

      const pageRel = resolveDist(pagePath);
      if (!pageRel) {
        addError(
          'feed-missing-page',
          `${feedPath} links missing output: ${pagePath}`
        );
        continue;
      }

      if (
        pagePath.startsWith(DATED_POST_PREFIX) &&
        !DATED_POST_PATTERN.test(pagePath)
      ) {
        addError(
          'feed-canonical-format',
          `${feedPath} links ${pagePath}, which is not a dated canonical post URL`
        );
        continue;
      }

      const page = distPages.get(pageRel);
      if (!page) {
        addError('feed-not-page', `${feedPath} links a non-HTML asset: ${pagePath}`);
        continue;
      }
      if (page.kind === 'redirect' || page.kind === 'invalid-redirect') {
        addError(
          'feed-redirect',
          `${feedPath} links a redirect document: ${pagePath}`
        );
        continue;
      }
      if (page.kind !== 'page') {
        addError(
          'feed-page-kind',
          `${feedPath} links a ${page.kind} document: ${pagePath}`
        );
        continue;
      }
      if (page.noindex) {
        addError(
          'feed-noindex',
          `${feedPath} links a noindex page: ${pagePath}`
        );
      }
      if (page.canonical == null || !page.canonical.href) {
        addError(
          'feed-canonical-missing',
          `${pagePath} linked from ${feedPath} has no canonical link`
        );
      } else {
        const canonical = resolveTarget(page.rel, page.canonical.href);
        if (canonical.error || canonical.external) {
          addError(
            'feed-canonical-invalid',
            `${pagePath} has an unusable canonical link: ${page.canonical.href}`
          );
        } else if (
          comparablePath(canonical.path) !== comparablePath(pagePath)
        ) {
          addError(
            'feed-canonical-mismatch',
            `${feedPath} links ${pagePath}, whose canonical link is ${canonical.path}`
          );
        }
      }

      if (page.url !== pagePath) {
        addWarning(
          'feed-alias-url',
          `${feedPath} links ${pagePath}, whose canonical form is ${page.url}`
        );
      }

      const key = comparablePath(pagePath);
      if (seenLinks.has(key)) {
        addWarning(
          'feed-duplicate',
          `${feedPath} links the same canonical page more than once: ${pagePath}`
        );
      } else {
        seenLinks.add(key);
      }
    }
  }

  if (
    feedCanonicalPath &&
    feedAliasPath &&
    feedEntries.has(feedCanonicalPath) &&
    feedEntries.has(feedAliasPath)
  ) {
    const canonicalLinks = feedEntries
      .get(feedCanonicalPath)
      .map((entry) => entry.link ?? '');
    const aliasLinks = feedEntries
      .get(feedAliasPath)
      .map((entry) => entry.link ?? '');
    if (
      canonicalLinks.length !== aliasLinks.length ||
      canonicalLinks.some((link, index) => link !== aliasLinks[index])
    ) {
      addError(
        'feed-alias-mismatch',
        `${feedAliasPath} does not serve the same entries as ${feedCanonicalPath}`
      );
    }
  }

  const homePage = distPages.get('index.html');
  if (homePage) {
    let alternateCount = 0;
    for (const node of findAll(homePage.document, (element) => {
      if (element.tagName !== 'link') return false;
      const rels = (attr(element, 'rel') ?? '').toLowerCase().split(/\s+/);
      const type = (attr(element, 'type') ?? '').toLowerCase();
      return (
        rels.includes('alternate') &&
        (type.includes('rss') || type.includes('atom'))
      );
    })) {
      alternateCount += 1;
      const href = attr(node, 'href');
      if (!href) continue;
      const target = resolveTarget(homePage.rel, href);
      if (target.error || target.external) {
        addError('feed-alternate-invalid', `homepage feed link is invalid: ${href}`);
        continue;
      }
      if (!resolveDist(target.path)) {
        addError(
          'feed-alternate-missing',
          `homepage feed link ${href} does not resolve to a file in dist`
        );
      }
    }
    if (alternateCount === 0) {
      addWarning('feed-alternate-absent', 'homepage does not advertise an RSS or Atom feed');
    }
  }

  const stats = {
    routes: routeRecords.length,
    slugRedirects: routeRecords.length,
    aliases: aliasRecords.length,
    pages: pageRecords.length,
    assets: assets.length,
    assetsMatched,
    distFiles: distFiles.length,
    htmlPages: distPages.size,
    redirects: redirectPages.length,
    sitemap: sitemapRoot,
    sitemapUrls: sitemapUrlCount,
    feeds: feedPaths.length,
    feedEntries: feedEntryCount,
  };

  return { ok: errors.length === 0, errors, warnings, stats };
}

/* ------------------------------------------------------------------------- */
/* Command line                                                              */
/* ------------------------------------------------------------------------- */

function printUsage() {
  console.log(`Usage: node scripts/verify-published-routes.mjs [options]

Verifies the built Astro dist/ tree against the retained publication contract.
No build tool, browser, network request or historical baseline is used.

Options:
  --dist <dir>         Astro build output (default: ${DEFAULT_DIST})
  --inventory <file>   Compatibility inventory
                       (default: ${DEFAULT_INVENTORY})
  --site <origin>      Canonical site origin (default: inventory site, then
                       ${DEFAULT_SITE})
  -h, --help           Show this help

Exit codes:
  0  verification passed (warnings are allowed)
  1  one or more contract failures
  2  usage, inventory, or dist error

Regression cases:
  npm run test:routes
`);
}

function parseArgs(argv) {
  let dist = DEFAULT_DIST;
  let inventoryFile = DEFAULT_INVENTORY;
  let site = null;
  let help = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '-h' || arg === '--help') {
      help = true;
      continue;
    }
    const readValue = (name) => {
      const value = argv[index + 1];
      if (!value) throw new Error(`${name} requires a value`);
      index += 1;
      return value;
    };
    if (arg === '--dist') {
      dist = readValue('--dist');
      continue;
    }
    if (arg.startsWith('--dist=')) {
      dist = arg.slice('--dist='.length);
      if (!dist) throw new Error('--dist requires a directory');
      continue;
    }
    if (arg === '--inventory') {
      inventoryFile = readValue('--inventory');
      continue;
    }
    if (arg.startsWith('--inventory=')) {
      inventoryFile = arg.slice('--inventory='.length);
      if (!inventoryFile) throw new Error('--inventory requires a file');
      continue;
    }
    if (arg === '--site') {
      site = readValue('--site');
      continue;
    }
    if (arg.startsWith('--site=')) {
      site = arg.slice('--site='.length);
      if (!site) throw new Error('--site requires an origin');
      continue;
    }
    throw new Error(`unknown option: ${arg}`);
  }

  return { help, dist, inventoryFile, site };
}

export async function main(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(`verify-published-routes: ${error.message}`);
    console.error('Run with --help for usage.');
    process.exitCode = 2;
    return 2;
  }

  if (options.help) {
    printUsage();
    return 0;
  }

  let inventory;
  try {
    inventory = JSON.parse(await readFile(options.inventoryFile, 'utf8'));
  } catch (error) {
    console.error(
      `verify-published-routes: cannot read inventory ${options.inventoryFile}: ${error.message}`
    );
    process.exitCode = 2;
    return 2;
  }

  const site = options.site ?? inventory.site ?? DEFAULT_SITE;
  const result = await verifyPublishedSite({
    dist: path.resolve(options.dist),
    inventory,
    site,
  });

  console.log('Published route verification');
  console.log(`  dist:      ${path.resolve(options.dist)}`);
  console.log(`  inventory: ${path.resolve(options.inventoryFile)}`);
  console.log(`  origin:    ${site}`);
  console.log('');
  console.log('Contract');
  console.log(`  routes:     ${result.stats.routes ?? 0}`);
  console.log(`  slug URLs:  ${result.stats.slugRedirects ?? 0}`);
  console.log(`  aliases:    ${result.stats.aliases ?? 0}`);
  console.log(`  pages:      ${result.stats.pages ?? 0}`);
  console.log(
    `  assets:     ${result.stats.assetsMatched ?? 0}/${result.stats.assets ?? 0}`
  );
  console.log(`  dist files: ${result.stats.distFiles ?? 0} (${result.stats.htmlPages ?? 0} HTML)`);
  console.log(`  redirects:  ${result.stats.redirects ?? 0}`);
  console.log(
    `  sitemap:    ${result.stats.sitemap ?? 'missing'} (${result.stats.sitemapUrls ?? 0} URLs)`
  );
  console.log(
    `  feeds:      ${result.stats.feeds ?? 0} (${result.stats.feedEntries ?? 0} entries)`
  );

  if (result.warnings.length > 0) {
    console.log('');
    console.log(`Warnings (${result.warnings.length})`);
    for (const warning of result.warnings.slice(0, MAX_REPORTED)) {
      console.log(`  [${warning.code}] ${warning.message}`);
    }
    if (result.warnings.length > MAX_REPORTED) {
      console.log(`  ... ${result.warnings.length - MAX_REPORTED} more`);
    }
  }

  if (result.errors.length > 0) {
    console.log('');
    console.log(`Errors (${result.errors.length})`);
    for (const error of result.errors.slice(0, MAX_REPORTED)) {
      console.log(`  [${error.code}] ${error.message}`);
    }
    if (result.errors.length > MAX_REPORTED) {
      console.log(`  ... ${result.errors.length - MAX_REPORTED} more`);
    }
    console.log('');
    console.log(
      `Result: FAIL (${result.errors.length} error${result.errors.length === 1 ? '' : 's'})`
    );
    process.exitCode = 1;
    return 1;
  }

  console.log('');
  console.log(
    `Result: PASS${result.warnings.length > 0 ? ` (${result.warnings.length} warning${result.warnings.length === 1 ? '' : 's'})` : ''}`
  );
  return 0;
}

const entrypoint = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : null;
if (entrypoint === import.meta.url) {
  await main();
}
