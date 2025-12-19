const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
const withProtocol = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;
const url = new URL(withProtocol);
url.protocol = 'https:';

export const SITE_URL = url.origin;

export function getCanonicalUrl(path: string): string {
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = new URL(safePath, SITE_URL);
  canonicalUrl.protocol = 'https:';
  return canonicalUrl.toString();
}
