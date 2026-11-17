import { readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const dist = resolve('dist');
const inventory = JSON.parse(await readFile('src/data/jekyll-baseline-inventory.json', 'utf8'));
const seen = new Set();
const errors = [];
const output = (url) => {
  const path = decodeURIComponent(new URL(url, 'https://kktse.github.io').pathname).replace(/^\/+/, '');
  return join(dist, path, ...(path.endsWith('/') ? ['index.html'] : []));
};

for (const { legacyUrl, canonicalUrl } of inventory.routeMapping) {
  if (seen.has(legacyUrl) || seen.has(canonicalUrl)) errors.push(`Duplicate route: ${legacyUrl} or ${canonicalUrl}`);
  seen.add(legacyUrl);
  seen.add(canonicalUrl);
  try {
    const oldPage = await readFile(output(legacyUrl), 'utf8');
    const newPage = await readFile(output(canonicalUrl), 'utf8');
    if (!/http-equiv=["']refresh["']/i.test(oldPage) || !oldPage.includes(canonicalUrl)) errors.push(`Invalid redirect: ${legacyUrl}`);
    if (!newPage.includes(`https://kktse.github.io${canonicalUrl}`)) errors.push(`Missing canonical URL: ${canonicalUrl}`);
  } catch (error) {
    errors.push(`Missing route ${legacyUrl} -> ${canonicalUrl}: ${error.message}`);
  }
}

for (const { file } of inventory.assets) {
  try {
    if (!(await stat(join(dist, file))).isFile()) errors.push(`Not a file: ${file}`);
  } catch {
    errors.push(`Missing asset: ${file}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${inventory.routeMapping.length} legacy routes and ${inventory.assets.length} public assets.`);
}
