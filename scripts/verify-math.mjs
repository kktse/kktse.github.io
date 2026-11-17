#!/usr/bin/env node
/*
 * Verify the build-time math output in a production `dist/` tree.
 *
 * This is intentionally an output check: it reads the HTML that Astro wrote,
 * not the Markdown source, so it cannot pass just because a plugin is listed
 * in `astro.config.mjs`. Inline and display formulas are distinguished from
 * KaTeX's rendered wrapper classes, and every formula's TeX is checked through
 * the MathML `<annotation encoding="application/x-tex">`.
 *
 * The check is filesystem-only. It does not build, start a server, load a
 * browser, or run the site's JavaScript.
 *
 * Usage: node scripts/verify-math.mjs [--dist <dir>]
 *        node scripts/verify-math.mjs --help
 *
 * Exit codes:
 *   0  verification passed
 *   1  one or more math-output regressions
 *   2  missing/incomplete dist tree, missing parser, or usage error
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DEFAULT_DIST = path.join(REPO_ROOT, 'dist');
const MAX_REPORTED = 80;

/*
 * These floors make a broken or mostly-empty build fail instead of passing
 * vacuously. They are deliberately well below the current article count so
 * ordinary content edits do not trip them.
 */
const MINIMUMS = {
  mathPages: 10,
  inline: 100,
  display: 20,
  listItems: 5,
  tableCells: 5,
  matrices: 2,
};

const errors = [];
let errorCount = 0;

function usage() {
  console.log(`Usage: node scripts/verify-math.mjs [options]

Reads the built Astro output and verifies that math is rendered at build time.

Options:
  --dist <dir>  Build output to inspect (default: <repository>/dist)
  -h, --help    Show this help

Checks:
  - Every KaTeX formula has one MathML root and one application/x-tex annotation.
  - Display formulas are wrapped by .katex-display; inline formulas are not.
  - Math in list items and table cells remains inline.
  - Escaped percentages and subscripts survive as rendered math, not comments
    or literal underscores.
  - Multiline bmatrix formulas remain display math with MathML table rows.
  - No browser KaTeX/MathJax auto-render script or inline render call remains.
  - No unrendered $...$ / $$...$$ delimiters remain outside code and math.
  - The linked KaTeX stylesheet and its bundled font files are present.

Limitations:
  - Run a production build first; this script never builds.
  - Only canonical /posts/**/index.html pages are checked. Legacy redirect
    documents and the MDX/currency/code authoring fixtures are outside this
    check. They need their own build-level coverage.
  - This is a static structure check, not a visual/layout or browser test.
  - parse5 is used from Astro's existing transitive installation.
`);
}

function printErrors() {
  if (!errorCount) return;
  console.error(`\nMath verification failed (${errorCount} issue(s)).`);
  for (const error of errors.slice(0, MAX_REPORTED)) {
    console.error(`\n[${error.check}] ${error.page}`);
    console.error(`  ${error.message}`);
    if (error.detail) console.error(`  ${error.detail}`);
  }
  if (errorCount > MAX_REPORTED) {
    console.error(`\n... ${errorCount - MAX_REPORTED} more issue(s) not shown.`);
  }
}

function fail(check, page, message, detail) {
  errorCount += 1;
  errors.push({ check, page, message, detail });
}

function fatal(message) {
  console.error(`verify-math: ${message}`);
  process.exitCode = 2;
}

function parseArgs(argv) {
  const options = { dist: DEFAULT_DIST, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '-h' || arg === '--help') {
      options.help = true;
    } else if (arg === '--dist') {
      const value = argv[index + 1];
      if (!value) {
        fatal('--dist requires a directory');
        return options;
      }
      options.dist = path.resolve(value);
      index += 1;
    } else {
      fatal(`unknown option: ${arg}`);
      return options;
    }
  }
  return options;
}

const options = parseArgs(process.argv.slice(2));
if (options.help || process.exitCode === 2) {
  usage();
  process.exit();
}

let parse5;
try {
  parse5 = await import('parse5');
} catch (error) {
  fatal(
    `parse5 is required (it is installed transitively by Astro): ${error.message}`
  );
  process.exit();
}

/*
 * Small HTML helpers. parse5 is used directly; there is no DOM abstraction
 * layer beyond these node/attribute lookups.
 */
const isElement = (node) => typeof node?.tagName === 'string';

function attr(node, name) {
  return node.attrs?.find((attribute) => attribute.name === name)?.value;
}

function hasClass(node, name) {
  return (attr(node, 'class') ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .includes(name);
}

function walk(node, visit, ancestors = []) {
  visit(node, ancestors);
  ancestors.push(node);
  for (const child of node.childNodes ?? []) walk(child, visit, ancestors);
  ancestors.pop();
}

function findFirst(root, predicate) {
  let found = null;
  walk(root, (node) => {
    if (!found && isElement(node) && predicate(node)) found = node;
  });
  return found;
}

function findAll(root, predicate) {
  const found = [];
  walk(root, (node) => {
    if (isElement(node) && predicate(node)) found.push(node);
  });
  return found;
}

function countElements(root, predicate) {
  let count = 0;
  walk(root, (node) => {
    if (isElement(node) && predicate(node)) count += 1;
  });
  return count;
}

function textOf(node) {
  let text = '';
  walk(node, (child) => {
    if (child.nodeName === '#text') text += child.value;
  });
  return text;
}

function compact(value, limit = 180) {
  const text = String(value).replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit - 3)}...` : text;
}

function relativeToDist(distDir, file) {
  return path.relative(distDir, file).split(path.sep).join('/');
}

async function collectPostPages(distDir) {
  const postsDir = path.join(distDir, 'posts');
  const files = [];

  async function visit(directory) {
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(fullPath);
      } else if (entry.isFile() && entry.name === 'index.html') {
        files.push(fullPath);
      }
    }
  }

  await visit(postsDir);
  return files;
}

/*
 * Inspect every KaTeX output node in a content root. The annotation is the
 * authoritative copy of the TeX that KaTeX actually typeset, so it is used
 * instead of reconstructing formula text from the visual HTML.
 */
function analyseMath(root) {
  const entries = [];
  const displayWrappers = [];

  walk(root, (node, ancestors) => {
    if (!isElement(node)) return;

    if (hasClass(node, 'katex-display')) displayWrappers.push(node);
    if (!hasClass(node, 'katex')) return;

    const mathml = findFirst(node, (child) => child.tagName === 'math');
    const annotation = mathml
      ? findFirst(
          mathml,
          (child) =>
            child.tagName === 'annotation' &&
            (attr(child, 'encoding') ?? '') === 'application/x-tex'
        )
      : null;
    const visual = findFirst(node, (child) => hasClass(child, 'katex-html'));

    entries.push({
      node,
      display: ancestors.some(
        (ancestor) => isElement(ancestor) && hasClass(ancestor, 'katex-display')
      ),
      inList: ancestors.some(
        (ancestor) => isElement(ancestor) && ancestor.tagName === 'li'
      ),
      inTableCell: ancestors.some(
        (ancestor) =>
          isElement(ancestor) &&
          (ancestor.tagName === 'td' || ancestor.tagName === 'th')
      ),
      inParagraph: ancestors.some(
        (ancestor) => isElement(ancestor) && ancestor.tagName === 'p'
      ),
      inBold: ancestors.some(
        (ancestor) =>
          isElement(ancestor) &&
          (ancestor.tagName === 'strong' || ancestor.tagName === 'b')
      ),
      tex: annotation ? textOf(annotation).trim() : '',
      annotation,
      annotationCount: mathml
        ? countElements(
            mathml,
            (child) =>
              child.tagName === 'annotation' &&
              (attr(child, 'encoding') ?? '') === 'application/x-tex'
          )
        : 0,
      mathml,
      mathmlCount: countElements(node, (child) => child.tagName === 'math'),
      visual,
      visualCount: countElements(node, (child) =>
        hasClass(child, 'katex-html')
      ),
      mathmlStyleCount: countElements(node, (child) =>
        hasClass(child, 'katex-mathml')
      ),
    });
  });

  return { entries, displayWrappers };
}

function checkMathEntry(entry, page) {
  const kind = entry.display ? 'display math' : 'inline math';
  const label = entry.tex ? compact(entry.tex) : 'formula with no TeX annotation';

  if (!entry.annotation) {
    fail(`${entry.display ? 'display' : 'inline'}`, page, `${kind} has no MathML TeX annotation`, label);
  } else if (!entry.tex) {
    fail('annotation', page, `${kind} has an empty TeX annotation`, label);
  } else {
    if (entry.tex.includes('$')) {
      fail(
        'annotation',
        page,
        `${kind} annotation still includes dollar delimiters`,
        label
      );
    }
    if (entry.tex.includes('&amp;')) {
      fail(
        'annotation',
        page,
        `${kind} annotation contains an HTML-escaped ampersand instead of LaTeX &.`,
        label
      );
    }
  }

  if (entry.mathmlCount !== 1) {
    fail(
      'mathml',
      page,
      `${kind} has ${entry.mathmlCount} <math> roots; expected exactly one`,
      label
    );
  }
  if (entry.annotationCount !== 1) {
    fail(
      'mathml',
      page,
      `${kind} has ${entry.annotationCount} x-tex annotations; expected exactly one`,
      label
    );
  }
  if (entry.visualCount !== 1 || !entry.visual) {
    fail(
      'render',
      page,
      `${kind} has ${entry.visualCount} .katex-html renderings; expected exactly one`,
      label
    );
  } else if (!textOf(entry.visual).trim()) {
    fail('render', page, `${kind} has no visible KaTeX HTML output`, label);
  }
  if (entry.mathmlStyleCount !== 1) {
    fail(
      'mathml',
      page,
      `${kind} has ${entry.mathmlStyleCount} .katex-mathml wrappers; expected exactly one`,
      label
    );
  }

  if (entry.inList && entry.display) {
    fail(
      'lists',
      page,
      'list-item math is display math instead of inline math',
      label
    );
  }
  if (entry.inTableCell && entry.display) {
    fail(
      'tables',
      page,
      'table-cell math is display math instead of inline math',
      label
    );
  }
}

function checkDisplayWrappers(wrappers, page) {
  for (const wrapper of wrappers) {
    const mathRoots = countElements(wrapper, (child) => hasClass(child, 'katex'));
    if (mathRoots !== 1) {
      fail(
        'display',
        page,
        `.katex-display contains ${mathRoots} KaTeX roots; expected exactly one`
      );
    }
    const nestedDisplays = countElements(
      wrapper,
      (child) => child !== wrapper && hasClass(child, 'katex-display')
    );
    if (nestedDisplays > 0) {
      fail('display', page, '.katex-display is nested inside another display wrapper');
    }
  }
}

function checkKatexErrors(content, page) {
  for (const node of findAll(content, (child) =>
    hasClass(child, 'katex-error')
  )) {
    fail(
      'katex',
      page,
      `KaTeX error: ${attr(node, 'title') ?? 'unknown error'}`,
      compact(textOf(node))
    );
  }
}

function checkUnprocessedPlaceholders(content, page) {
  for (const node of findAll(
    content,
    (child) =>
      hasClass(child, 'math-display') ||
      hasClass(child, 'math-inline') ||
      hasClass(child, 'language-math')
  )) {
    fail(
      'pipeline',
      page,
      'unprocessed math placeholder remains in the DOM',
      compact(textOf(node)) || attr(node, 'class')
    );
  }
}

function checkResidualDelimiters(content, page) {
  const hits = [];

  function visit(node, blocked) {
    if (hits.length >= 8) return;
    if (isElement(node)) {
      const nextBlocked =
        blocked ||
        hasClass(node, 'katex') ||
        ['code', 'pre', 'script', 'style', 'textarea'].includes(node.tagName);
      for (const child of node.childNodes ?? []) visit(child, nextBlocked);
      return;
    }
    if (node.nodeName !== '#text' || blocked) return;

    const value = node.value;
    if (!value.includes('$')) return;
    if (value.includes('$$')) {
      hits.push(`display delimiters: ${compact(value)}`);
      return;
    }

    /*
     * A dollar followed by a digit is treated as currency, not as an opening
     * math delimiter. The final HTML has no escape backslash, so escaped
     * currency is indistinguishable from literal currency here by design.
     */
    const pattern = /\$(?!\d)([^$\n]{1,240}?)\$/g;
    for (const match of value.matchAll(pattern)) {
      if (match[1].trim()) hits.push(`inline delimiters: ${compact(value)}`);
    }
  }

  visit(content, false);
  for (const hit of hits) {
    fail('delimiters', page, 'math delimiters remain in rendered text', hit);
  }
}

function checkCodeContainsNoMath(content, page) {
  const codeBlocks = [];
  walk(content, (node, ancestors) => {
    if (!isElement(node)) return;
    const inPre = ancestors.some(
      (ancestor) => isElement(ancestor) && ancestor.tagName === 'pre'
    );
    if (node.tagName === 'pre' || (node.tagName === 'code' && !inPre)) {
      codeBlocks.push(node);
    }
  });

  for (const block of codeBlocks) {
    if (!textOf(block).includes('$')) continue;
    if (findFirst(block, (child) => hasClass(child, 'katex'))) {
      fail(
        'code',
        page,
        'KaTeX markup was generated inside a code example',
        compact(textOf(block))
      );
    }
  }
}

function checkRuntimeScripts(document, page) {
  for (const script of findAll(document, (node) => node.tagName === 'script')) {
    const source = attr(script, 'src') ?? '';
    const type = attr(script, 'type') ?? '';
    const body = textOf(script);

    if (/katex|mathjax|auto-render/i.test(source)) {
      fail('runtime', page, 'page loads a browser math renderer script', source);
    }
    if (/renderMathInElement|katex\.render|MathJax/i.test(body)) {
      fail(
        'runtime',
        page,
        'inline script performs browser-side math rendering',
        compact(body)
      );
    }
    if (/^math\/tex/i.test(type)) {
      fail('runtime', page, 'page contains a browser-math script element', type);
    }
  }
}

function checkExternalMathStylesheet(document, page) {
  for (const link of findAll(document, (node) => node.tagName === 'link')) {
    const rel = (attr(link, 'rel') ?? '').toLowerCase().split(/\s+/);
    const href = attr(link, 'href') ?? '';
    if (
      rel.includes('stylesheet') &&
      /^https?:/i.test(href) &&
      /katex/i.test(href)
    ) {
      fail('runtime', page, 'page loads KaTeX CSS from an external CDN', href);
    }
  }
}

function distPathFromUrl(url, baseFile, distDir) {
  const base = `https://dist.invalid/${relativeToDist(distDir, baseFile)}`;
  let parsed;
  try {
    parsed = new URL(url, base);
  } catch {
    return null;
  }
  if (parsed.origin !== 'https://dist.invalid') return null;

  let pathname;
  try {
    pathname = decodeURIComponent(parsed.pathname);
  } catch {
    return null;
  }
  const candidate = path.join(distDir, pathname.replace(/^\/+/, ''));
  const relative = path.relative(distDir, candidate);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return candidate;
}

async function checkKatexCss(pages, distDir) {
  const stylesheets = new Map();
  for (const page of pages) {
    for (const link of findAll(
      page.document,
      (node) => node.tagName === 'link'
    )) {
      const rel = (attr(link, 'rel') ?? '').toLowerCase().split(/\s+/);
      const href = attr(link, 'href') ?? '';
      if (!rel.includes('stylesheet') || /^https?:/i.test(href) || href.startsWith('data:')) {
        continue;
      }
      const file = distPathFromUrl(href, page.file, distDir);
      if (file && !stylesheets.has(file)) {
        try {
          stylesheets.set(file, await readFile(file, 'utf8'));
        } catch {
          fail(
            'css',
            pageName(distDir, page.file),
            'linked stylesheet does not exist',
            href
          );
          stylesheets.set(file, '');
        }
      }
    }
  }

  const katexCss = [...stylesheets]
    .filter(
      ([, content]) =>
        content.includes('KaTeX_Main') && content.includes('.katex-display')
    )
    .map(([file, content]) => ({ file, content }));

  if (katexCss.length === 0) {
    fail(
      'css',
      'dist',
      'no linked stylesheet contains the bundled KaTeX CSS (KaTeX_Main/.katex-display)'
    );
    return 0;
  }

  let fontFiles = 0;
  for (const stylesheet of katexCss) {
    const pattern = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
    for (const match of stylesheet.content.matchAll(pattern)) {
      const url = match[2];
      if (url.startsWith('data:') || !/\.(?:woff2|woff|ttf)(?:[?#]|$)/i.test(url)) {
        continue;
      }
      const fontFile = distPathFromUrl(url, stylesheet.file, distDir);
      if (!fontFile) continue;
      try {
        if ((await stat(fontFile)).isFile()) fontFiles += 1;
      } catch {
        fail(
          'css',
          'dist',
          'KaTeX stylesheet references a missing font file',
          relativeToDist(distDir, fontFile)
        );
      }
    }
  }

  if (fontFiles === 0) {
    fail('css', 'dist', 'KaTeX stylesheet has no bundled font files');
  }
  return fontFiles;
}

function pageName(distDir, file) {
  return relativeToDist(distDir, file);
}

function checkEscapedPercentAndSubscripts(entries) {
  const percentTargets = entries.filter(
    (entry) =>
      entry.display &&
      /anti-lift|anti-dive/i.test(entry.tex) &&
      entry.tex.includes('%')
  );

  if (percentTargets.length === 0) {
    fail(
      'percent',
      'dist',
      'no display anti-lift/anti-dive percent formula found in rendered output'
    );
  } else {
    const target =
      percentTargets.find((entry) => /anti-lift/i.test(entry.tex)) ??
      percentTargets[0];
    const label = compact(target.tex);

    if (!target.tex.includes('\\%')) {
      fail('percent', pageNameForEntry(target), 'percent sign is not escaped as \\% in TeX', label);
    }
    if (target.tex.includes('\\\\%')) {
      fail(
        'percent',
        pageNameForEntry(target),
        'percent is preceded by a doubled backslash, so KaTeX treats it as a comment',
        label
      );
    }
    if (!target.tex.includes('_{')) {
      fail('subscript', pageNameForEntry(target), 'target formula has no braced subscript', label);
    }
    if (target.tex.includes('\\_{')) {
      fail(
        'subscript',
        pageNameForEntry(target),
        'subscript is escaped as \\_{, which renders a literal underscore',
        label
      );
    }
    if (!textOf(target.visual).includes('%')) {
      fail(
        'percent',
        pageNameForEntry(target),
        'rendered KaTeX HTML omits the percent sign',
        label
      );
    }
    if (
      !findFirst(target.mathml, (node) =>
        ['msub', 'msubsup'].includes(node.tagName)
      )
    ) {
      fail(
        'subscript',
        pageNameForEntry(target),
        'target formula has no MathML subscript element',
        label
      );
    }
  }

  const bracedSubscripts = entries.filter((entry) =>
    /(^|[^\\])_\{/.test(entry.tex)
  );
  if (bracedSubscripts.length < 5) {
    fail(
      'subscript',
      'dist',
      `only ${bracedSubscripts.length} subscript formulas found; expected at least 5`
    );
  }
  for (const entry of bracedSubscripts) {
    if (!entry.mathml) continue;
    if (
      !findFirst(entry.mathml, (node) =>
        ['msub', 'msubsup'].includes(node.tagName)
      )
    ) {
      fail(
        'subscript',
        pageNameForEntry(entry),
        'braced subscript has no MathML msub/msubsup',
        compact(entry.tex)
      );
    }
  }
  for (const entry of entries.filter((entry) => entry.tex.includes('\\_{'))) {
    fail(
      'subscript',
      pageNameForEntry(entry),
      'formula contains a legacy escaped underscore \\_{ instead of a subscript',
      compact(entry.tex)
    );
  }
}

function checkMatrices(entries) {
  const matrices = entries.filter((entry) =>
    entry.tex.includes('\\begin{bmatrix}')
  );

  if (matrices.length < MINIMUMS.matrices) {
    fail(
      'matrix',
      'dist',
      `only ${matrices.length} bmatrix formulas found; expected at least ${MINIMUMS.matrices}`
    );
  }

  let multiline = null;
  for (const entry of matrices) {
    const begins = entry.tex.match(/\\begin\{bmatrix\}/g)?.length ?? 0;
    const ends = entry.tex.match(/\\end\{bmatrix\}/g)?.length ?? 0;
    if (begins !== ends) {
      fail(
        'matrix',
        pageNameForEntry(entry),
        `unbalanced bmatrix delimiters (${begins} begin, ${ends} end)`,
        compact(entry.tex)
      );
    }
    if (!entry.display) {
      fail(
        'matrix',
        pageNameForEntry(entry),
        'matrix is rendered as inline math instead of display math',
        compact(entry.tex)
      );
    }
    if (!entry.mathml) continue;

    const tables = countElements(
      entry.mathml,
      (node) => node.tagName === 'mtable'
    );
    const rows = countElements(entry.mathml, (node) => node.tagName === 'mtr');
    if (tables === 0 || rows === 0) {
      fail(
        'matrix',
        pageNameForEntry(entry),
        'matrix has no MathML mtable/mtr structure',
        compact(entry.tex)
      );
    }

    const rowCount = entry.tex.split('\n').length;
    if (entry.tex.includes('\n') && rowCount > 1) {
      if (!multiline || rows > multiline.rows) {
        multiline = { entry, rows, tables };
      }
    }
  }

  if (!multiline) {
    fail(
      'matrix',
      'dist',
      'no newline-separated multiline matrix was found in the rendered output'
    );
    return;
  }
  if (multiline.rows < 3) {
    fail(
      'matrix',
      pageNameForEntry(multiline.entry),
      `multiline matrix rendered only ${multiline.rows} MathML rows; expected at least 3`,
      compact(multiline.entry.tex)
    );
  }

  const inertiaMatrix = matrices.find(
    (entry) =>
      entry.tex.includes('I_{xx}') &&
      (entry.tex.match(/\\begin\{bmatrix\}/g)?.length ?? 0) >= 2
  );
  if (!inertiaMatrix) {
    fail(
      'matrix',
      'dist',
      'expected the two-matrix inertia tensor formula in rendered output'
    );
  } else {
    const rows = countElements(
      inertiaMatrix.mathml,
      (node) => node.tagName === 'mtr'
    );
    if (rows < 6) {
      fail(
        'matrix',
        pageNameForEntry(inertiaMatrix),
        `inertia tensor rendered only ${rows} MathML rows; expected at least 6`,
        compact(inertiaMatrix.tex)
      );
    }
  }
}

const entryPages = new WeakMap();
function pageNameForEntry(entry) {
  return entryPages.get(entry) ?? 'dist';
}

async function main() {
  try {
    if (!(await stat(path.join(options.dist, 'posts'))).isDirectory()) {
      fatal(`missing posts directory in ${options.dist}`);
      return;
    }
  } catch {
    fatal(
      `missing or unreadable dist tree at ${options.dist}; run "npm run build" first`
    );
    return;
  }

  const files = await collectPostPages(options.dist);
  if (files.length === 0) {
    fatal(`no canonical post pages found under ${path.join(options.dist, 'posts')}`);
    return;
  }

  const pages = [];
  for (const file of files) {
    const document = parse5.parse(await readFile(file, 'utf8'));
    const content = findFirst(
      document,
      (node) => hasClass(node, 'post-content')
    );
    if (!content) {
      fail('structure', pageName(options.dist, file), 'post page has no .post-content container');
      continue;
    }

    const analysis = analyseMath(content);
    for (const entry of analysis.entries) entryPages.set(entry, pageName(options.dist, file));

    pages.push({ file, document, content, ...analysis });
  }

  for (const page of pages) {
    checkKatexErrors(page.content, pageName(options.dist, page.file));
    checkUnprocessedPlaceholders(page.content, pageName(options.dist, page.file));
    checkResidualDelimiters(page.content, pageName(options.dist, page.file));
    checkCodeContainsNoMath(page.content, pageName(options.dist, page.file));
    checkRuntimeScripts(page.document, pageName(options.dist, page.file));
    checkExternalMathStylesheet(page.document, pageName(options.dist, page.file));
    checkDisplayWrappers(page.displayWrappers, pageName(options.dist, page.file));
    for (const entry of page.entries) {
      checkMathEntry(entry, pageName(options.dist, page.file));
    }
  }

  const entries = pages.flatMap((page) => page.entries);
  const mathPages = pages.filter((page) => page.entries.length > 0);
  const inline = entries.filter((entry) => !entry.display);
  const display = entries.filter((entry) => entry.display);
  const inLists = entries.filter((entry) => entry.inList);
  const inTables = entries.filter((entry) => entry.inTableCell);
  const inBold = entries.filter((entry) => entry.inBold);

  if (mathPages.length < MINIMUMS.mathPages) {
    fail(
      'coverage',
      'dist',
      `only ${mathPages.length} post pages contain rendered math; expected at least ${MINIMUMS.mathPages}`
    );
  }
  if (inline.length < MINIMUMS.inline) {
    fail(
      'coverage',
      'dist',
      `only ${inline.length} inline formulas found; expected at least ${MINIMUMS.inline}`
    );
  }
  if (display.length < MINIMUMS.display) {
    fail(
      'coverage',
      'dist',
      `only ${display.length} display formulas found; expected at least ${MINIMUMS.display}`
    );
  }
  if (inLists.length < MINIMUMS.listItems) {
    fail(
      'lists',
      'dist',
      `only ${inLists.length} formulas inside list items; expected at least ${MINIMUMS.listItems}`
    );
  }
  if (inTables.length < MINIMUMS.tableCells) {
    fail(
      'tables',
      'dist',
      `only ${inTables.length} formulas inside table cells; expected at least ${MINIMUMS.tableCells}`
    );
  }

  checkEscapedPercentAndSubscripts(entries);
  checkMatrices(entries);
  const fontFiles = await checkKatexCss(pages, options.dist);

  printErrors();
  if (errorCount > 0) {
    process.exitCode = 1;
    return;
  }

  console.log('Math verification passed.');
  console.log(
    `  pages: ${mathPages.length} of ${pages.length} canonical post pages contain math`
  );
  console.log(
    `  formulas: ${inline.length} inline, ${display.length} display, ${inLists.length} in lists, ${inTables.length} in tables` +
      (inBold.length ? `, ${inBold.length} in bold text` : '')
  );
  console.log(
    `  MathML: every formula has an application/x-tex annotation; no KaTeX errors`
  );
  console.log(
    `  runtime: no KaTeX/MathJax browser renderer; KaTeX CSS bundled with ${fontFiles} font file reference(s)`
  );
  console.log('  delimiters: no unrendered $...$ or $$...$$ outside code and math');
}

/*
 * Run the checks. The build is deliberately never invoked here.
 */
await main();
