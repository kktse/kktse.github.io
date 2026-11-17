#!/usr/bin/env node
/*
 * Compare a built Astro `dist/` tree with the Jekyll build that it replaces.
 *
 * The check is intentionally filesystem-only so it can run before deployment
 * without starting a server, a browser, or either build tool. See `--help` and
 * the caveats printed at the end of a run for the boundaries of the check.
 */
import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DEFAULT_BASELINE = '/tmp/kktse-jekyll-baseline';
const DEFAULT_DIST = path.join(REPO_ROOT, 'dist');
const DEFAULT_SITE = 'https://kktse.github.io';

const MAX_REPORTED = 80;

const SKIP_WALK_DIRS = new Set([
  '.git',
  '.jekyll-cache',
  '.sass-cache',
  '.bundle',
  '.astro',
  '_site',
  'node_modules',
  'vendor',
]);

/*
 * These names can be copied by Jekyll when it is pointed at a repository root,
 * but they are build/deployment metadata rather than published site content.
 * Keep this list deliberately narrow: an unknown baseline file is treated as a
 * public asset and must exist in the Astro output.
 */
const NON_PUBLIC_BASELINE_FILES = new Set([
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.yaml',
  'redirects.json',
  '.jekyll-metadata',
  '.DS_Store',
]);

/*
 * Jekyll's theme stylesheet is replaced by Astro's bundled CSS. The content
 * migration inventory records the same replacement; requiring the original
 * theme files here would reject a correct build.
 */
const REPLACED_BASELINE_ASSETS = new Map([
  ['assets/css/style.css', 'Jekyll theme stylesheet replaced by Astro CSS'],
  ['assets/css/style.css.map', 'source map for the replaced theme stylesheet'],
]);

const SITE_ORIGIN_DEFAULT = DEFAULT_SITE;
let siteOrigin = SITE_ORIGIN_DEFAULT;

const errors = [];
const warnings = [];

function addError(code, message) {
  errors.push({ code, message });
}

function addWarning(code, message) {
  warnings.push({ code, message });
}

/* ------------------------------------------------------------------------- */
/* Command line                                                              */
/* ------------------------------------------------------------------------- */

function printUsage() {
  console.log(`Usage: node scripts/verify-migration.mjs [options] [baseline-dir]

Compares a generated Astro dist/ tree with a built Jekyll baseline.

Arguments:
  baseline-dir        Jekyll build output to compare against
                      (default: ${DEFAULT_BASELINE})

Options:
  --dist <dir>        Astro build output to verify
                      (default: <repository>/dist)
  --site <origin>     Canonical site origin
                      (default: ${DEFAULT_SITE})
  -h, --help          Show this help

Exit codes:
  0  verification passed (warnings are allowed)
  1  one or more verification failures
  2  usage error, missing baseline, or missing/incomplete dist build

The script does not build either site. Build Jekyll into the baseline directory
and Astro into dist/ first.
`);
}

function printCaveats() {
  console.log(`Caveats:
  - This is a static-file comparison, not an HTTP or browser test. It does not
    verify headers, rendering, JavaScript, fragments, or external CDNs.
  - Legacy pages are verified as HTML meta-refresh documents. GitHub Pages
    serves those documents with HTTP 200; they are not real 301/308 redirects.
  - Links are checked by decoded pathname. Query strings and fragments are
    ignored when resolving a file, and malformed percent-encoding is treated
    literally rather than as a missing file.
  - Baseline files that are clearly build/deployment metadata (Dockerfile,
    docker-compose.yml, redirects.json, platform metadata) and the Jekyll theme
    stylesheet replaced by Astro are skipped. Unknown baseline files are
    treated as public assets and must be present in dist/.
  - Sitemap and feed checks run only when those files exist in dist/. Sitemap
    coverage is enforced for canonical post pages and for redirect targets
    under /posts/.
  - No baseline or no built dist/ directory is an error; a baseline source
    tree (for example the repository root) is rejected in favour of its build
    output.`);
}

function parseArgs(argv) {
  let baseline = DEFAULT_BASELINE;
  let dist = DEFAULT_DIST;
  let site = DEFAULT_SITE;
  let help = false;
  let baselineProvided = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '-h' || arg === '--help') {
      help = true;
      continue;
    }
    if (arg === '--dist') {
      const value = argv[index + 1];
      if (!value) throw new Error('--dist requires a directory');
      dist = value;
      index += 1;
      continue;
    }
    if (arg.startsWith('--dist=')) {
      dist = arg.slice('--dist='.length);
      if (!dist) throw new Error('--dist requires a directory');
      continue;
    }
    if (arg === '--site') {
      const value = argv[index + 1];
      if (!value) throw new Error('--site requires an origin');
      site = value;
      index += 1;
      continue;
    }
    if (arg.startsWith('--site=')) {
      site = arg.slice('--site='.length);
      if (!site) throw new Error('--site requires an origin');
      continue;
    }
    if (arg.startsWith('-')) throw new Error(`unknown option: ${arg}`);
    if (baselineProvided) throw new Error(`unexpected argument: ${arg}`);
    baseline = arg;
    baselineProvided = true;
  }

  if (help) return { help: true };

  let origin;
  try {
    origin = new URL(site).origin;
  } catch {
    throw new Error(`--site is not a valid URL origin: ${site}`);
  }
  if (!/^https?:$/.test(new URL(origin).protocol)) {
    throw new Error(`--site must use http or https: ${site}`);
  }

  return {
    help: false,
    baseline: path.resolve(process.cwd(), baseline),
    dist: path.resolve(process.cwd(), dist),
    site: origin,
  };
}

/* ------------------------------------------------------------------------- */
/* Small parsing helpers                                                     */
/* ------------------------------------------------------------------------- */

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

function extractMetaRefresh(html) {
  const refreshes = [];

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    if ((attributes.get('http-equiv') ?? '').trim().toLowerCase() !== 'refresh') {
      continue;
    }

    const content = attributes.get('content');
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

function extractCanonicalLink(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const rel = (attributes.get('rel') ?? '').toLowerCase().split(/\s+/);
    if (rel.includes('canonical')) {
      return (attributes.get('href') ?? '').trim() || null;
    }
  }
  return null;
}

function pageHasNoindex(html) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    if ((attributes.get('name') ?? '').trim().toLowerCase() !== 'robots') continue;
    const content = (attributes.get('content') ?? '').toLowerCase();
    if (/(^|[\s,;])noindex([\s,;]|$)/.test(content)) return true;
  }
  return false;
}

function looksLikeScriptRedirect(html) {
  const navigates =
    /\b(?:window\.)?location(?:\.href)?\s*=\s*['"`]|\blocation\.(?:replace|assign)\s*\(/.test(
      html
    );
  if (!navigates) return false;

  const visibleText = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return visibleText.length < 250;
}

function isHtmlFile(rel) {
  return /\.html?$/i.test(rel);
}

function isCssFile(rel) {
  return /\.css$/i.test(rel);
}

function isMetadataFile(rel) {
  if (rel.includes('/')) return false;
  return /^(?:sitemap(?:-index(?:-\d+)?|-\d+)?|feed|rss|atom)\.xml$/i.test(rel);
}

function isNonPublicBaselineFile(rel) {
  if (rel.includes('/')) return false;
  return NON_PUBLIC_BASELINE_FILES.has(rel);
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
      return new URL(value, siteOrigin).pathname;
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

function resolveTarget(sourceRel, rawTarget) {
  const sourceUrl = `/${sourceRel.replace(/\\/g, '/')}`;
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
    hasQuery: resolved.search.length > 0,
  };
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

/* ------------------------------------------------------------------------- */
/* Filesystem scanning                                                      */
/* ------------------------------------------------------------------------- */

async function walkDirectory(root, { skipDirs = SKIP_WALK_DIRS } = {}) {
  const files = [];
  const skippedDirs = [];
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
        if (skipDirs.has(entry.name)) {
          skippedDirs.push(`${relative}/`);
          continue;
        }
        await visit(path.join(absoluteDir, entry.name), relative);
        continue;
      }
      if (entry.isFile()) files.push(relative);
    }
  }

  await visit(root, '');
  return { files, skippedDirs, symlinks };
}

async function parseHtmlPages(root, files) {
  const pages = new Map();

  for (const rel of files.filter(isHtmlFile)) {
    const html = await readFile(path.join(root, rel), 'utf8');
    const refresh = extractMetaRefresh(html);
    let kind = 'page';

    if (html.trim() === '') {
      kind = 'empty';
    } else if (refresh) {
      kind = refresh.error ? 'invalid-redirect' : 'redirect';
    } else if (looksLikeScriptRedirect(html)) {
      kind = 'script-redirect';
    }

    pages.set(rel, {
      rel,
      html,
      refresh,
      kind,
      noindex: pageHasNoindex(html),
      canonical: extractCanonicalLink(html),
    });
  }

  return pages;
}

async function requireDirectory(directory, label) {
  let info;
  try {
    info = await stat(directory);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`${label} not found: ${directory}`);
    }
    throw new Error(`cannot read ${label} ${directory}: ${error.message}`);
  }
  if (!info.isDirectory()) {
    throw new Error(`${label} is not a directory: ${directory}`);
  }
}

function looksLikeJekyllSource(directory) {
  return ['_config.yml', '_config.yaml', '_posts', '_layouts', '_includes'].some(
    (name) => existsSync(path.join(directory, name))
  );
}

function looksLikeAstroSource(directory) {
  return existsSync(path.join(directory, 'src', 'pages'));
}

/* ------------------------------------------------------------------------- */
/* Link and asset references                                                 */
/* ------------------------------------------------------------------------- */

const REFERENCE_TAGS = new Set([
  'a',
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

function collectReferences(html) {
  const references = [];

  const withoutInlineBodies = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2')
    .replace(/(<style\b[^>]*>)[\s\S]*?(<\/style>)/gi, '$1$2');

  for (const match of withoutInlineBodies.matchAll(/<([a-z][a-z0-9:-]*)\b[^>]*>/gi)) {
    const tagName = match[1].toLowerCase();
    if (!REFERENCE_TAGS.has(tagName)) continue;

    const attributes = parseAttributes(match[0]);
    for (const attribute of ['src', 'href', 'poster']) {
      const value = (attributes.get(attribute) ?? '').trim();
      if (value) references.push(value);
    }

    if (tagName === 'object') {
      const value = (attributes.get('data') ?? '').trim();
      if (value) references.push(value);
    }

    const srcset = attributes.get('srcset');
    if (srcset && !srcset.includes('data:')) {
      for (const part of srcset.split(',')) {
        const value = part.trim().split(/\s+/)[0];
        if (value) references.push(value);
      }
    }
  }

  return references;
}

function checkReference(pageUrl, rawReference, resolveDist, distPages) {
  const value = rawReference.trim();
  if (!value) return null;
  if (/^(?:#|data:|mailto:|tel:|javascript:|blob:|about:|sms:|irc:|ftp:)/i.test(value)) {
    return null;
  }

  let resolved;
  try {
    resolved = new URL(value, new URL(pageUrl, siteOrigin));
  } catch {
    return { error: 'invalid URL' };
  }

  if (resolved.origin !== siteOrigin) return null;

  const rel = resolveDist(resolved.pathname);
  if (!rel) return { error: 'missing file' };

  /*
   * Internal links may intentionally point at a legacy meta-refresh document;
   * that is a valid URL, not a broken asset. Only reject documents that cannot
   * serve as a useful navigation target at all.
   */
  const target = distPages.get(rel);
  if (
    target &&
    (target.kind === 'invalid-redirect' ||
      target.kind === 'script-redirect' ||
      target.kind === 'empty')
  ) {
    return { error: `target is a ${target.kind}` };
  }
  return null;
}

/* ------------------------------------------------------------------------- */
/* Sitemap and feed                                                          */
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

/* ------------------------------------------------------------------------- */
/* Main                                                                      */
/* ------------------------------------------------------------------------- */

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`verify-migration: ${error.message}`);
    console.error('Run with --help for usage.');
    process.exitCode = 2;
    return;
  }

  if (options.help) {
    printUsage();
    console.log('');
    printCaveats();
    return;
  }

  siteOrigin = options.site;
  const baselineRoot = options.baseline;
  const distRoot = options.dist;

  try {
    await requireDirectory(baselineRoot, 'baseline build');
    await requireDirectory(distRoot, 'Astro build output');
  } catch (error) {
    console.error(`verify-migration: ${error.message}`);
    console.error(
      'Build the Jekyll baseline and the Astro site first, then pass the baseline path and --dist if needed.'
    );
    process.exitCode = 2;
    return;
  }

  if (looksLikeJekyllSource(baselineRoot)) {
    console.error(
      `verify-migration: baseline path looks like a Jekyll source tree, not a build output: ${baselineRoot}`
    );
    console.error(
      'Pass the directory produced by `jekyll build --destination ...` (for example /tmp/kktse-jekyll-baseline).'
    );
    process.exitCode = 2;
    return;
  }
  if (looksLikeAstroSource(distRoot)) {
    console.error(
      `verify-migration: dist path looks like the Astro source tree, not a build output: ${distRoot}`
    );
    console.error('Run `npm run build` first, then pass the generated dist/ directory.');
    process.exitCode = 2;
    return;
  }

  let baselineWalk;
  let distWalk;
  try {
    baselineWalk = await walkDirectory(baselineRoot);
    distWalk = await walkDirectory(distRoot);
  } catch (error) {
    console.error(`verify-migration: cannot scan build output: ${error.message}`);
    process.exitCode = 2;
    return;
  }

  const baselineFiles = baselineWalk.files;
  const distFiles = distWalk.files;
  const distFileSet = new Set(distFiles);

  const baselineHtml = baselineFiles.filter(isHtmlFile);
  if (baselineHtml.length === 0) {
    console.error(
      `verify-migration: baseline contains no HTML pages: ${baselineRoot}`
    );
    console.error('Is this really a Jekyll build output?');
    process.exitCode = 2;
    return;
  }
  if (!distFileSet.has('index.html')) {
    console.error(
      `verify-migration: dist is missing index.html; build output looks incomplete: ${distRoot}`
    );
    process.exitCode = 2;
    return;
  }

  const baselinePages = await parseHtmlPages(baselineRoot, baselineFiles);
  const distPages = await parseHtmlPages(distRoot, distFiles);
  const resolveDist = makeResolver(distFileSet);

  const baselineAssets = baselineFiles.filter(
    (rel) =>
      !isHtmlFile(rel) &&
      !isMetadataFile(rel) &&
      !isNonPublicBaselineFile(rel) &&
      !REPLACED_BASELINE_ASSETS.has(rel)
  );
  const skippedMetadata = baselineFiles.filter(
    (rel) => !isHtmlFile(rel) && isNonPublicBaselineFile(rel)
  );
  const skippedReplaced = baselineFiles.filter((rel) =>
    REPLACED_BASELINE_ASSETS.has(rel)
  );

  if (baselineWalk.symlinks.length > 0) {
    addWarning(
      'baseline-symlink',
      `baseline contains symlinks that were not followed: ${baselineWalk.symlinks.join(', ')}`
    );
  }
  if (distWalk.symlinks.length > 0) {
    addWarning(
      'dist-symlink',
      `dist contains symlinks that were not followed: ${distWalk.symlinks.join(', ')}`
    );
  }

  /* Route collisions and page URLs. */
  const routeMap = new Map();
  const lowerRouteMap = new Map();

  for (const info of distPages.values()) {
    info.url = htmlFileToUrlPath(info.rel);

    const existing = routeMap.get(info.url);
    if (existing) {
      addError(
        'route-collision',
        `${info.url} is emitted by both ${existing} and ${info.rel}`
      );
    } else {
      routeMap.set(info.url, info.rel);
    }

    const lower = info.url.toLowerCase();
    const lowerExisting = lowerRouteMap.get(lower);
    if (lowerExisting && lowerExisting !== info.url) {
      addError(
        'route-case-collision',
        `${info.url} and ${lowerExisting} differ only by case`
      );
    } else if (!lowerExisting) {
      lowerRouteMap.set(lower, info.url);
    }
  }

  /* Legacy HTML URL continuity. */
  let legacyCanonical = 0;
  let legacyRedirect = 0;

  for (const [rel, baselinePage] of baselinePages) {
    const url = htmlFileToUrlPath(rel);
    baselinePage.url = url;

    const distRel = resolveDist(url);
    if (!distRel) {
      addError(
        'legacy-missing',
        `${url} (baseline ${rel}) has no generated output or redirect`
      );
      continue;
    }

    const distPage = distPages.get(distRel);
    if (!distPage) {
      addError(
        'legacy-not-page',
        `${url} resolves to a non-HTML asset in dist: ${distRel}`
      );
      continue;
    }

    if (distPage.kind === 'empty') {
      addError('legacy-empty', `${url} has an empty generated HTML file`);
      continue;
    }
    if (distPage.kind === 'invalid-redirect') {
      addError(
        'legacy-invalid-redirect',
        `${url} has an invalid meta refresh: ${distPage.refresh.error}`
      );
      continue;
    }
    if (distPage.kind === 'script-redirect') {
      addError(
        'legacy-js-only',
        `${url} relies on JavaScript instead of an immediate meta refresh`
      );
      continue;
    }

    if (distPage.kind === 'redirect') {
      legacyRedirect += 1;

      if (baselinePage.kind === 'redirect' && baselinePage.refresh?.target) {
        const baselineTarget = resolveTarget(rel, baselinePage.refresh.target);
        const distTarget = resolveTarget(distPage.rel, distPage.refresh.target);
        if (
          baselineTarget.path &&
          distTarget.path &&
          comparablePath(baselineTarget.path) !==
            comparablePath(distTarget.path)
        ) {
          addError(
            'legacy-target-changed',
            `${url} redirected to ${baselineTarget.path} in the baseline but redirects to ${distTarget.path} in dist`
          );
        }
      }
      continue;
    }

    if (distPage.kind === 'page') {
      legacyCanonical += 1;
      if (baselinePage.kind === 'redirect') {
        addWarning(
          'legacy-semantics',
          `${url} was a redirect in the baseline but is now a canonical page`
        );
      }
      continue;
    }

    addError(
      'legacy-unknown',
      `${url} resolved to an unrecognised generated document (${distPage.kind})`
    );
  }

  /* Dist redirect validation: targets, chains, cycles, and metadata. */
  const redirectPages = [...distPages.values()].filter(
    (info) => info.kind === 'redirect' || info.kind === 'invalid-redirect'
  );
  const canonicalRedirectTargets = new Set();

  function followRedirectChain(sourcePath, firstTarget) {
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
        `${sourcePath} redirects off-site to ${target.external}`
      );
      continue;
    }
    if (target.path === sourcePath) {
      addError('redirect-self', `${sourcePath} redirects to itself`);
      continue;
    }
    if (info.refresh.delay > 0) {
      addWarning(
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
    if (targetPage.kind === 'redirect' || targetPage.kind === 'invalid-redirect') {
      addError(
        'redirect-chain',
        `${sourcePath} -> ${followRedirectChain(sourcePath, target.path)} (redirects must point directly at a canonical page)`
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

    if (info.canonical) {
      const canonical = resolveTarget(info.rel, info.canonical);
      if (canonical.error) {
        addError(
          'redirect-canonical-invalid',
          `${sourcePath} has an invalid canonical link: ${info.canonical}`
        );
      } else if (canonical.external) {
        addError(
          'redirect-canonical-external',
          `${sourcePath} has an off-site canonical link: ${info.canonical}`
        );
      } else if (
        comparablePath(canonical.path) !== comparablePath(target.path)
      ) {
        addError(
          'redirect-canonical-mismatch',
          `${sourcePath} redirects to ${target.path} but its canonical link is ${canonical.path}`
        );
      }
    } else {
      addWarning(
        'redirect-canonical-missing',
        `${sourcePath} has no canonical link on its redirect document`
      );
    }

    if (targetPage.url !== target.path) {
      addWarning(
        'redirect-alias-target',
        `${sourcePath} redirects to ${target.path}, whose canonical form is ${targetPage.url}`
      );
    }

    canonicalRedirectTargets.add(comparablePath(target.path));
  }

  /* Baseline public assets. */
  let assetsPresent = 0;
  for (const rel of baselineAssets) {
    if (distFileSet.has(rel)) {
      assetsPresent += 1;
    } else {
      addError('missing-asset', `/${rel} from the baseline is missing in dist`);
    }
  }

  /* Local references in generated HTML. */
  for (const info of distPages.values()) {
    if (!info.html) continue;

    const seen = new Set();
    for (const reference of collectReferences(info.html)) {
      const key = `${info.url}\u0000${reference}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const result = checkReference(
        info.url,
        reference,
        resolveDist,
        distPages
      );
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
    const css = await readFile(path.join(distRoot, rel), 'utf8');
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

      const result = checkReference(
        pageUrl,
        reference,
        resolveDist,
        distPages
      );
      if (result?.error) {
        addError(
          'broken-css-reference',
          `${pageUrl}: ${reference} (${result.error})`
        );
      }
    }
  }

  /* Canonical sitemap. */
  let sitemapRoot = null;
  if (distFileSet.has('sitemap-index.xml')) {
    sitemapRoot = 'sitemap-index.xml';
  } else if (distFileSet.has('sitemap.xml')) {
    sitemapRoot = 'sitemap.xml';
  } else {
    const chunk = distFiles.find((rel) => /^sitemap-\d+\.xml$/i.test(rel));
    if (chunk) sitemapRoot = chunk;
  }

  const sitemapCanonicalPaths = new Set();
  let sitemapPageCount = 0;

  if (sitemapRoot) {
    const visitedSitemaps = new Set();

    async function validateSitemap(rel, depth = 0) {
      if (visitedSitemaps.has(rel)) return;
      visitedSitemaps.add(rel);

      if (depth > 3) {
        addError('sitemap-depth', `sitemap nesting is too deep at ${rel}`);
        return;
      }

      const xml = await readFile(path.join(distRoot, rel), 'utf8');
      const isIndex = /<(?:[a-z0-9]+:)?sitemapindex\b/i.test(xml);
      const isUrlset = /<(?:[a-z0-9]+:)?urlset\b/i.test(xml);
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
        sitemapPageCount += 1;
      }
    }

    await validateSitemap(sitemapRoot);

    for (const [rel, info] of distPages) {
      if (info.kind !== 'page' || !info.url.startsWith('/posts/')) continue;
      if (!sitemapCanonicalPaths.has(comparablePath(info.url))) {
        addError(
          'sitemap-coverage',
          `Canonical post ${info.url} (${rel}) is missing from ${sitemapRoot}`
        );
      }
    }

    for (const targetPath of canonicalRedirectTargets) {
      if (!targetPath.startsWith('/posts/')) continue;
      if (!sitemapCanonicalPaths.has(targetPath)) {
        addError(
          'sitemap-coverage',
          `Redirect target ${targetPath} is missing from ${sitemapRoot}`
        );
      }
    }
  } else {
    const baselineHasSitemap = baselineFiles.some(
      (rel) => rel === 'sitemap.xml' || rel === 'sitemap-index.xml'
    );
    if (baselineHasSitemap) {
      addWarning(
        'sitemap-missing',
        'the baseline has a sitemap but dist has no sitemap.xml or sitemap-index.xml'
      );
    }
  }

  /* Canonical feed. */
  const feedFiles = new Set(
    distFiles.filter((rel) => /(?:^|\/)(?:rss|feed|atom)\.xml$/i.test(rel))
  );

  const homePage = distPages.get('index.html');
  if (homePage) {
    for (const match of homePage.html.matchAll(/<link\b[^>]*>/gi)) {
      const attributes = parseAttributes(match[0]);
      const rel = (attributes.get('rel') ?? '').toLowerCase().split(/\s+/);
      const type = (attributes.get('type') ?? '').toLowerCase();
      const href = attributes.get('href');
      if (
        !href ||
        !rel.includes('alternate') ||
        !(type.includes('rss') || type.includes('atom'))
      ) {
        continue;
      }

      const target = resolveTarget('index.html', href);
      if (target.external || target.error) continue;
      const feedRel = resolveDist(target.path);
      if (feedRel) {
        feedFiles.add(feedRel);
      } else {
        addWarning(
          'feed-alternate-missing',
          `alternate feed link ${href} does not resolve to a file in dist`
        );
      }
    }
  }

  let feedEntryCount = 0;

  for (const rel of feedFiles) {
    const xml = await readFile(path.join(distRoot, rel), 'utf8');
    if (!/<(?:rss|feed)\b/i.test(xml)) {
      addError('feed-root', `${rel} is not an RSS or Atom feed`);
      continue;
    }

    const entries = extractFeedEntries(xml);
    if (entries.length === 0) {
      addWarning('feed-empty', `${rel} contains no feed entries`);
    }

    const seenLinks = new Set();
    for (const entry of entries) {
      feedEntryCount += 1;
      if (!entry.link) {
        addError('feed-entry-link', `${rel} contains an entry without a link`);
        continue;
      }

      const target = resolveTarget(rel, entry.link);
      if (target.error) {
        addError(
          'feed-entry-invalid',
          `${rel}: ${target.error} (${entry.link})`
        );
        continue;
      }
      if (target.external) {
        addWarning(
          'feed-external-entry',
          `${rel} links off-site: ${target.url.href}`
        );
        continue;
      }

      const pagePath = target.path;
      if (/\.html?$/i.test(pagePath)) {
        addError(
          'feed-legacy-url',
          `${rel} links a legacy HTML URL instead of a canonical URL: ${pagePath}`
        );
        continue;
      }

      const pageRel = resolveDist(pagePath);
      if (!pageRel) {
        addError(
          'feed-missing-page',
          `${rel} links missing output: ${pagePath}`
        );
        continue;
      }

      const page = distPages.get(pageRel);
      if (!page) {
        addError(
          'feed-not-page',
          `${rel} links a non-HTML asset: ${pagePath}`
        );
        continue;
      }
      if (page.kind === 'redirect' || page.kind === 'invalid-redirect') {
        addError(
          'feed-redirect',
          `${rel} links a redirect document: ${pagePath}`
        );
        continue;
      }
      if (page.kind !== 'page') {
        addError(
          'feed-page-kind',
          `${rel} links a ${page.kind} document: ${pagePath}`
        );
        continue;
      }

      if (page.url !== pagePath) {
        addWarning(
          'feed-alias-url',
          `${rel} links ${pagePath}, whose canonical form is ${page.url}`
        );
      }

      const key = comparablePath(pagePath);
      if (seenLinks.has(key)) {
        addWarning(
          'feed-duplicate',
          `${rel} links the same canonical page more than once: ${pagePath}`
        );
      } else {
        seenLinks.add(key);
      }
    }
  }

  if (feedFiles.size === 0) {
    const baselineHasFeed = baselineFiles.some((rel) =>
      /(?:^|\/)(?:rss|feed|atom)\.xml$/i.test(rel)
    );
    if (baselineHasFeed) {
      addWarning(
        'feed-missing',
        'the baseline has a feed but dist has no rss.xml, feed.xml, or atom.xml'
      );
    }
  }

  /* Report. */
  console.log('Migration verification');
  console.log(`  baseline: ${baselineRoot}`);
  console.log(`  dist:     ${distRoot}`);
  console.log(`  origin:   ${siteOrigin}`);
  console.log('');
  console.log('Inventory');
  console.log(
    `  baseline: ${baselinePages.size} HTML pages, ${baselineAssets.length} public assets`
  );
  console.log(
    `  dist:     ${distFiles.length} files (${distPages.size} HTML, ${
      distFiles.length - distPages.size
    } other)`
  );
  console.log(
    `  legacy URLs: ${legacyCanonical} canonical, ${legacyRedirect} redirects, ${
      baselinePages.size - legacyCanonical - legacyRedirect
    } unresolved`
  );
  console.log(`  public assets matched: ${assetsPresent}/${baselineAssets.length}`);
  console.log(
    `  redirect documents: ${redirectPages.filter((info) => info.kind === 'redirect').length}`
  );

  if (skippedMetadata.length > 0) {
    console.log(
      `  skipped non-public baseline files: ${skippedMetadata.join(', ')}`
    );
  }
  if (skippedReplaced.length > 0) {
    console.log(
      `  skipped replaced theme assets: ${skippedReplaced
        .map((rel) => `${rel} (${REPLACED_BASELINE_ASSETS.get(rel)})`)
        .join(', ')}`
    );
  }
  if (baselineWalk.skippedDirs.length > 0) {
    console.log(`  skipped baseline directories: ${baselineWalk.skippedDirs.join(', ')}`);
  }

  if (sitemapRoot) {
    console.log(
      `  sitemap: ${sitemapRoot} (${sitemapPageCount} canonical page URLs)`
    );
  } else {
    console.log('  sitemap: not present (skipped)');
  }

  if (feedFiles.size > 0) {
    console.log(
      `  feed: ${[...feedFiles].join(', ')} (${feedEntryCount} entries)`
    );
  } else {
    console.log('  feed: not present (skipped)');
  }

  if (warnings.length > 0) {
    console.log('');
    console.log(`Warnings (${warnings.length})`);
    for (const warning of warnings.slice(0, MAX_REPORTED)) {
      console.log(`  [${warning.code}] ${warning.message}`);
    }
    if (warnings.length > MAX_REPORTED) {
      console.log(`  ... ${warnings.length - MAX_REPORTED} more`);
    }
  }

  if (errors.length > 0) {
    console.log('');
    console.log(`Errors (${errors.length})`);
    for (const error of errors.slice(0, MAX_REPORTED)) {
      console.log(`  [${error.code}] ${error.message}`);
    }
    if (errors.length > MAX_REPORTED) {
      console.log(`  ... ${errors.length - MAX_REPORTED} more`);
    }
  }

  console.log('');
  printCaveats();

  if (errors.length > 0) {
    console.log('');
    console.log(`Result: FAIL (${errors.length} error${errors.length === 1 ? '' : 's'})`);
    process.exitCode = 1;
    return;
  }

  console.log('');
  console.log(
    `Result: PASS${warnings.length > 0 ? ` (${warnings.length} warning${warnings.length === 1 ? '' : 's'})` : ''}`
  );
}

await main();
