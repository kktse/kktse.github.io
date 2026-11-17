/*
 * Legacy Jekyll routes captured from the production baseline build, not
 * inferred from filenames. Each `from` path is the exact `.html` document the
 * old blog published, including the 16 posts whose Jekyll date differs from
 * their filename date. `/home.html` was a Jekyll redirect to `/`; it is kept in
 * `siteRedirects` because that path is not part of the post permalink space.
 */

export interface LegacyPostRoute {
  readonly from: string;
  readonly to: string;
  readonly slug: string;
}

export interface LegacySiteRedirect {
  readonly from: string;
  readonly to: string;
}

export const legacyPostRoutes: readonly LegacyPostRoute[] = [
  { from: '/jekyll/update/2017/07/25/open-lapping-smartphone-cayuga.html', to: '/posts/open-lapping-smartphone-cayuga/', slug: 'open-lapping-smartphone-cayuga' },
  { from: '/jekyll/update/2018/02/08/champcar-2018-road-atlanta.html', to: '/posts/champcar-2018-road-atlanta/', slug: 'champcar-2018-road-atlanta' },
  { from: '/jekyll/update/2018/09/18/single-track-bicycle.html', to: '/posts/single-track-bicycle/', slug: 'single-track-bicycle' },
  { from: '/jekyll/update/2018/10/26/driver-heart-rate-karting.html', to: '/posts/driver-heart-rate-karting/', slug: 'driver-heart-rate-karting' },
  { from: '/jekyll/update/2018/12/01/understeer-gradient-identification.html', to: '/posts/understeer-gradient-identification/', slug: 'understeer-gradient-identification' },
  { from: '/jekyll/update/2019/01/06/cornering-compliance-identification.html', to: '/posts/cornering-compliance-identification/', slug: 'cornering-compliance-identification' },
  { from: '/jekyll/update/2019/02/13/on-centre-handling-metrics.html', to: '/posts/on-centre-handling-metrics/', slug: 'on-centre-handling-metrics' },
  { from: '/jekyll/update/2019/02/16/super-lap-battle.html', to: '/posts/super-lap-battle/', slug: 'super-lap-battle' },
  { from: '/jekyll/update/2019/03/17/parameter-sensitivity-analysis.html', to: '/posts/parameter-sensitivity-analysis/', slug: 'parameter-sensitivity-analysis' },
  { from: '/jekyll/update/2019/06/01/typical-cornering-compliances.html', to: '/posts/typical-cornering-compliances/', slug: 'typical-cornering-compliances' },
  { from: '/jekyll/update/2019/07/15/driver-science-in-amateur-motorsports.html', to: '/posts/driver-science-in-amateur-motorsports/', slug: 'driver-science-in-amateur-motorsports' },
  { from: '/jekyll/update/2019/08/01/re71r-influence-of-pressure-on-tire-footprint.html', to: '/posts/re71r-influence-of-pressure-on-tire-footprint/', slug: 're71r-influence-of-pressure-on-tire-footprint' },
  { from: '/jekyll/update/2019/09/14/driver-workload-nasa-tlx-ota-smp.html', to: '/posts/driver-workload-nasa-tlx-ota-smp/', slug: 'driver-workload-nasa-tlx-ota-smp' },
  { from: '/jekyll/update/2019/11/27/science-of-motorsport-review.html', to: '/posts/science-of-motorsport-review/', slug: 'science-of-motorsport-review' },
  { from: '/jekyll/update/2020/01/30/static-suspension-geometry-analysis-acura-rsx.html', to: '/posts/static-suspension-geometry-analysis-acura-rsx/', slug: 'static-suspension-geometry-analysis-acura-rsx' },
  { from: '/jekyll/update/2020/05/20/slvstopy-python-library.html', to: '/posts/slvstopy-python-library/', slug: 'slvstopy-python-library' },
  { from: '/jekyll/update/2020/06/21/rsx-kinematic-curves.html', to: '/posts/rsx-kinematic-curves/', slug: 'rsx-kinematic-curves' },
  { from: '/jekyll/update/2020/07/25/rsx-front-motion-ratios.html', to: '/posts/rsx-front-motion-ratios/', slug: 'rsx-front-motion-ratios' },
  { from: '/jekyll/update/2020/09/07/rsx-front-kinematic-roll-centre.html', to: '/posts/rsx-front-kinematic-roll-centre/', slug: 'rsx-front-kinematic-roll-centre' },
  { from: '/jekyll/update/2020/10/25/estimating-vehicle-inertia-properties-with-nhtsa-database.html', to: '/posts/estimating-vehicle-inertia-properties-with-nhtsa-database/', slug: 'estimating-vehicle-inertia-properties-with-nhtsa-database' },
  { from: '/jekyll/update/2020/12/10/rsx-rear-kinematic-curves.html', to: '/posts/rsx-rear-kinematic-curves/', slug: 'rsx-rear-kinematic-curves' },
  { from: '/jekyll/update/2020/12/10/rsx-rear-motion-ratios.html', to: '/posts/rsx-rear-motion-ratios/', slug: 'rsx-rear-motion-ratios' },
  { from: '/jekyll/update/2020/12/10/rsx-rsx-rear-kinematic-roll-centre.html', to: '/posts/rsx-rsx-rear-kinematic-roll-centre/', slug: 'rsx-rsx-rear-kinematic-roll-centre' },
  { from: '/jekyll/update/2021/02/19/rsx-suspension-longitudinal-antis.html', to: '/posts/rsx-suspension-longitudinal-antis/', slug: 'rsx-suspension-longitudinal-antis' },
  { from: '/jekyll/update/2021/05/12/simplied-lateral-load-transfer-analysis.html', to: '/posts/simplied-lateral-load-transfer-analysis/', slug: 'simplied-lateral-load-transfer-analysis' },
  { from: '/jekyll/update/2021/07/18/re71r-255-40-r17-tire-vertical-stiffness.html', to: '/posts/re71r-255-40-r17-tire-vertical-stiffness/', slug: 're71r-255-40-r17-tire-vertical-stiffness' },
  { from: '/jekyll/update/2021/10/06/re71r-255-40-r17-tire-static-footprints.html', to: '/posts/re71r-255-40-r17-tire-static-footprints/', slug: 're71r-255-40-r17-tire-static-footprints' },
  { from: '/jekyll/update/2022/07/28/trends-in-vehicle-cg-height-and-ssf.html', to: '/posts/trends-in-vehicle-cg-height-and-ssf/', slug: 'trends-in-vehicle-cg-height-and-ssf' },
  { from: '/jekyll/update/2022/09/24/photography-measuring-roll-camber-inclination-angle-ek20r.html', to: '/posts/photography-measuring-roll-camber-inclination-angle-ek20r/', slug: 'photography-measuring-roll-camber-inclination-angle-ek20r' },
  { from: '/jekyll/update/2023/02/07/intro-to-front-kinematics-ek20r.html', to: '/posts/intro-to-front-kinematics-ek20r/', slug: 'intro-to-front-kinematics-ek20r' },
  { from: '/jekyll/update/2023/03/08/front-kinematic-wheel-plane-control-ek20r.html', to: '/posts/front-kinematic-wheel-plane-control-ek20r/', slug: 'front-kinematic-wheel-plane-control-ek20r' },
  { from: '/jekyll/update/2024/01/05/front-steering-analysis-ek20r.html', to: '/posts/front-steering-analysis-ek20r/', slug: 'front-steering-analysis-ek20r' },
  { from: '/jekyll/update/2024/09/22/continental-ecf-255-40-r17-contact-patch-sensitivity.html', to: '/posts/continental-ecf-255-40-r17-contact-patch-sensitivity/', slug: 'continental-ecf-255-40-r17-contact-patch-sensitivity' },
  { from: '/jekyll/update/2026/04/20/driver-development-as-skill-acquisition.html', to: '/posts/driver-development-as-skill-acquisition/', slug: 'driver-development-as-skill-acquisition' },
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
 * collection, points at another legacy path (a redirect chain), or would
 * shadow a canonical post URL. `canonicalSlugs` is the set rendered by
 * `/posts/[slug].astro`.
 */
export function assertLegacyRoutes(
  routes: readonly LegacyPostRoute[],
  canonicalSlugs: ReadonlySet<string>
): void {
  const sources = new Set<string>();
  const canonicalPaths = new Set(
    [...canonicalSlugs].map((slug) => `/posts/${slug}/`)
  );

  for (const route of routes) {
    if (!route.from.startsWith('/jekyll/update/') || !route.from.endsWith('.html')) {
      throw new Error(`Legacy route is not a Jekyll post path: ${route.from}`);
    }
    if (sources.has(route.from)) {
      throw new Error(`Duplicate legacy route: ${route.from}`);
    }
    sources.add(route.from);

    if (!canonicalSlugs.has(route.slug)) {
      throw new Error(
        `Legacy route ${route.from} targets missing post slug "${route.slug}"`
      );
    }
    if (route.to !== `/posts/${route.slug}/`) {
      throw new Error(
        `Legacy route ${route.from} target does not match its slug: ${route.to}`
      );
    }
    if (canonicalPaths.has(route.from) || routes.some((item) => item.from === route.to)) {
      throw new Error(`Legacy route ${route.from} would collide or chain`);
    }
  }
}
