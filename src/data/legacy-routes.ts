/*
 * Legacy Jekyll routes captured from the production baseline build, not
 * inferred from filenames. Each `from` path is the exact `.html` document the
 * old blog published, including the 16 posts whose Jekyll date differs from
 * their filename date. The target is resolved from the collection's
 * authoritative frontmatter `date` and explicit `slug`, never from the
 * historical path or source filename.
 *
 * `/home.html` was a Jekyll redirect to `/`; it is kept in `siteRedirects`
 * because that path is not part of the post permalink space.
 */

import { isCanonicalPostPath } from '../lib/post-url';

const LEGACY_POST_PATH =
  /^\/jekyll\/update\/\d{4}\/\d{2}\/\d{2}\/([a-z0-9]+(?:-[a-z0-9]+)*)\.html$/;

export interface LegacyPostRoute {
  readonly from: string;
  readonly slug: string;
}

export interface ResolvedLegacyPostRoute extends LegacyPostRoute {
  readonly to: string;
}

export interface LegacySiteRedirect {
  readonly from: string;
  readonly to: string;
}

export const legacyPostRoutes: readonly LegacyPostRoute[] = [
  { from: '/jekyll/update/2017/07/25/open-lapping-smartphone-cayuga.html', slug: 'open-lapping-smartphone-cayuga' },
  { from: '/jekyll/update/2018/02/08/champcar-2018-road-atlanta.html', slug: 'champcar-2018-road-atlanta' },
  { from: '/jekyll/update/2018/09/18/single-track-bicycle.html', slug: 'single-track-bicycle' },
  { from: '/jekyll/update/2018/10/26/driver-heart-rate-karting.html', slug: 'driver-heart-rate-karting' },
  { from: '/jekyll/update/2018/12/01/understeer-gradient-identification.html', slug: 'understeer-gradient-identification' },
  { from: '/jekyll/update/2019/01/06/cornering-compliance-identification.html', slug: 'cornering-compliance-identification' },
  { from: '/jekyll/update/2019/02/13/on-centre-handling-metrics.html', slug: 'on-centre-handling-metrics' },
  { from: '/jekyll/update/2019/02/16/super-lap-battle.html', slug: 'super-lap-battle' },
  { from: '/jekyll/update/2019/03/17/parameter-sensitivity-analysis.html', slug: 'parameter-sensitivity-analysis' },
  { from: '/jekyll/update/2019/06/01/typical-cornering-compliances.html', slug: 'typical-cornering-compliances' },
  { from: '/jekyll/update/2019/07/15/driver-science-in-amateur-motorsports.html', slug: 'driver-science-in-amateur-motorsports' },
  { from: '/jekyll/update/2019/08/01/re71r-influence-of-pressure-on-tire-footprint.html', slug: 're71r-influence-of-pressure-on-tire-footprint' },
  { from: '/jekyll/update/2019/09/14/driver-workload-nasa-tlx-ota-smp.html', slug: 'driver-workload-nasa-tlx-ota-smp' },
  { from: '/jekyll/update/2019/11/27/science-of-motorsport-review.html', slug: 'science-of-motorsport-review' },
  { from: '/jekyll/update/2020/01/30/static-suspension-geometry-analysis-acura-rsx.html', slug: 'static-suspension-geometry-analysis-acura-rsx' },
  { from: '/jekyll/update/2020/05/20/slvstopy-python-library.html', slug: 'slvstopy-python-library' },
  { from: '/jekyll/update/2020/06/21/rsx-kinematic-curves.html', slug: 'rsx-kinematic-curves' },
  { from: '/jekyll/update/2020/07/25/rsx-front-motion-ratios.html', slug: 'rsx-front-motion-ratios' },
  { from: '/jekyll/update/2020/09/07/rsx-front-kinematic-roll-centre.html', slug: 'rsx-front-kinematic-roll-centre' },
  { from: '/jekyll/update/2020/10/25/estimating-vehicle-inertia-properties-with-nhtsa-database.html', slug: 'estimating-vehicle-inertia-properties-with-nhtsa-database' },
  { from: '/jekyll/update/2020/12/10/rsx-rear-kinematic-curves.html', slug: 'rsx-rear-kinematic-curves' },
  { from: '/jekyll/update/2020/12/10/rsx-rear-motion-ratios.html', slug: 'rsx-rear-motion-ratios' },
  { from: '/jekyll/update/2020/12/10/rsx-rsx-rear-kinematic-roll-centre.html', slug: 'rsx-rsx-rear-kinematic-roll-centre' },
  { from: '/jekyll/update/2021/02/19/rsx-suspension-longitudinal-antis.html', slug: 'rsx-suspension-longitudinal-antis' },
  { from: '/jekyll/update/2021/05/12/simplied-lateral-load-transfer-analysis.html', slug: 'simplied-lateral-load-transfer-analysis' },
  { from: '/jekyll/update/2021/07/18/re71r-255-40-r17-tire-vertical-stiffness.html', slug: 're71r-255-40-r17-tire-vertical-stiffness' },
  { from: '/jekyll/update/2021/10/06/re71r-255-40-r17-tire-static-footprints.html', slug: 're71r-255-40-r17-tire-static-footprints' },
  { from: '/jekyll/update/2022/07/28/trends-in-vehicle-cg-height-and-ssf.html', slug: 'trends-in-vehicle-cg-height-and-ssf' },
  { from: '/jekyll/update/2022/09/24/photography-measuring-roll-camber-inclination-angle-ek20r.html', slug: 'photography-measuring-roll-camber-inclination-angle-ek20r' },
  { from: '/jekyll/update/2023/02/07/intro-to-front-kinematics-ek20r.html', slug: 'intro-to-front-kinematics-ek20r' },
  { from: '/jekyll/update/2023/03/08/front-kinematic-wheel-plane-control-ek20r.html', slug: 'front-kinematic-wheel-plane-control-ek20r' },
  { from: '/jekyll/update/2024/01/05/front-steering-analysis-ek20r.html', slug: 'front-steering-analysis-ek20r' },
  { from: '/jekyll/update/2024/09/22/continental-ecf-255-40-r17-contact-patch-sensitivity.html', slug: 'continental-ecf-255-40-r17-contact-patch-sensitivity' },
  { from: '/jekyll/update/2026/04/20/driver-development-as-skill-acquisition.html', slug: 'driver-development-as-skill-acquisition' },
];

export const siteRedirects: readonly LegacySiteRedirect[] = [
  { from: '/home.html', to: '/' },
];

export interface LegacyAlias {
  readonly from: string;
  readonly to: string;
  readonly kind: 'rss-alias';
}

/** Non-redirect compatibility endpoints that must keep serving a document. */
export const legacyAliases: readonly LegacyAlias[] = [
  { from: '/feed.xml', to: '/rss.xml', kind: 'rss-alias' },
];

/**
 * Validates the two compatibility paths that are not post permalinks:
 * `/home.html` is a meta-refresh page and `/feed.xml` serves RSS directly.
 */
export function assertSiteRedirects(
  redirects: readonly LegacySiteRedirect[],
  aliases: readonly LegacyAlias[]
): void {
  const sources = new Set<string>();

  for (const { from, to } of [...redirects, ...aliases]) {
    if (!from.startsWith('/') || !to.startsWith('/')) {
      throw new Error(`Compatibility path must be root-relative: ${from}`);
    }
    if (sources.has(from)) {
      throw new Error(`Duplicate compatibility path: ${from}`);
    }
    sources.add(from);
    if (redirects.some((route) => route.to === from)) {
      throw new Error(`Compatibility path would form a redirect chain: ${from}`);
    }
  }
}

assertSiteRedirects(siteRedirects, legacyAliases);

/**
 * Fails the build when a legacy path is duplicated, points outside the posts
 * collection, points at a compatibility redirect (a chain), or would shadow a
 * canonical post URL. `canonicalUrlsBySlug` is the slug-to-canonical map built
 * by `postUrlMap` from the collection's frontmatter dates.
 */
export function assertLegacyRoutes(
  routes: readonly LegacyPostRoute[],
  canonicalUrlsBySlug: ReadonlyMap<string, string>
): void {
  const sources = new Set<string>();
  const fallbackPaths = new Set(
    [...canonicalUrlsBySlug.keys()].map((slug) => `/posts/${slug}/`)
  );

  for (const route of routes) {
    const sourceMatch = LEGACY_POST_PATH.exec(route.from);
    if (sourceMatch === null) {
      throw new Error(`Legacy route is not a Jekyll post path: ${route.from}`);
    }
    if (sourceMatch[1] !== route.slug) {
      throw new Error(
        `Legacy route ${route.from} path does not match slug "${route.slug}"`
      );
    }
    if (sources.has(route.from)) {
      throw new Error(`Duplicate legacy route: ${route.from}`);
    }
    sources.add(route.from);

    const target = canonicalUrlsBySlug.get(route.slug);
    if (target === undefined) {
      throw new Error(
        `Legacy route ${route.from} targets missing post slug "${route.slug}"`
      );
    }
    if (!isCanonicalPostPath(target) || !target.endsWith(`/${route.slug}/`)) {
      throw new Error(
        `Legacy route ${route.from} target is not the canonical URL for "${route.slug}": ${target}`
      );
    }
    if (fallbackPaths.has(route.from)) {
      throw new Error(
        `Legacy route ${route.from} would shadow a compatibility path`
      );
    }
  }

  for (const route of routes) {
    const target = canonicalUrlsBySlug.get(route.slug);
    if (target === undefined) continue;
    if (sources.has(target) || fallbackPaths.has(target)) {
      throw new Error(
        `Legacy route ${route.from} would form a redirect chain to ${target}`
      );
    }
  }
}

/**
 * Resolves each explicit historical path to the canonical dated URL for its
 * slug. The target comes from the collection, so a wrong Jekyll date or a
 * renamed source file cannot change where a redirect points.
 */
export function resolveLegacyPostRoutes(
  routes: readonly LegacyPostRoute[],
  canonicalUrlsBySlug: ReadonlyMap<string, string>
): readonly ResolvedLegacyPostRoute[] {
  assertLegacyRoutes(routes, canonicalUrlsBySlug);

  return routes.map((route) => {
    const to = canonicalUrlsBySlug.get(route.slug);
    if (to === undefined) {
      throw new Error(
        `Legacy route ${route.from} targets missing post slug "${route.slug}"`
      );
    }
    return { ...route, to };
  });
}
