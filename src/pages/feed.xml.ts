export const prerender = true;

/*
 * The Jekyll site published its feed at /feed.xml. Keep that URL serving the
 * same RSS document as /rss.xml so existing feed clients continue to work;
 * this is not an HTML redirect.
 */
export { GET } from './rss.xml';
