/*
 * Canonical post URLs depend only on the immutable frontmatter `date` and the
 * explicit `slug`. The date is read in UTC so the build machine's time zone
 * can never change a URL; source filenames and Jekyll's historical directory
 * dates are deliberately ignored.
 */

const POST_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CANONICAL_POST_PATH =
  /^\/post\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/;

export interface PostUrlSource {
  readonly id?: string;
  readonly data: {
    readonly date: Date;
    readonly slug: string;
  };
}

/** Builds `/post/YYYY/MM/DD/<slug>/` from the authoritative frontmatter data. */
export function postUrl(date: Date, slug: string): string {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error(
      `Cannot build a post URL from an invalid date for slug "${slug}"`
    );
  }
  if (!POST_SLUG.test(slug)) {
    throw new Error(`Cannot build a post URL from invalid slug "${slug}"`);
  }

  const year = String(date.getUTCFullYear()).padStart(4, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `/post/${year}/${month}/${day}/${slug}/`;
}

/** True when `path` has the exact shape emitted by `postUrl`. */
export function isCanonicalPostPath(path: string): boolean {
  return CANONICAL_POST_PATH.test(path);
}

/**
 * Maps every post slug to its canonical path. Duplicate slugs and duplicate
 * canonical paths fail the build instead of silently emitting one URL twice.
 */
export function postUrlMap(
  posts: readonly PostUrlSource[]
): ReadonlyMap<string, string> {
  const bySlug = new Map<string, string>();
  const slugOwners = new Map<string, string>();
  const urlOwners = new Map<string, string>();

  for (const post of posts) {
    const { date, slug } = post.data;
    const url = postUrl(date, slug);
    const owner = post.id ?? slug;

    const slugOwner = slugOwners.get(slug);
    if (slugOwner !== undefined) {
      throw new Error(
        `Duplicate post slug "${slug}" in ${slugOwner} and ${owner}`
      );
    }

    const urlOwner = urlOwners.get(url);
    if (urlOwner !== undefined) {
      throw new Error(
        `Duplicate canonical post URL "${url}" in ${urlOwner} and ${owner}`
      );
    }

    bySlug.set(slug, url);
    slugOwners.set(slug, owner);
    urlOwners.set(url, owner);
  }

  return bySlug;
}
