/**
 * Formatting helpers shared by the site shell and listing pages.
 *
 * Category anchors are part of the public URL surface (legacy Jekyll links use
 * `/categories/#<slug>`), so every page must derive them with the same
 * function. Dates are rendered in UTC to keep listings stable regardless of
 * the build machine's timezone.
 */

const longDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const shortDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export type DateStyle = 'long' | 'short';

export function formatDate(value: Date, style: DateStyle = 'long'): string {
  return (style === 'long' ? longDate : shortDate).format(value);
}

/**
 * Mirrors Jekyll's default `slugify` filter so existing category fragment
 * links keep resolving after the migration.
 */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}
