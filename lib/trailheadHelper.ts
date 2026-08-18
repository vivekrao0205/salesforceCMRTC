/**
  Trailhead Profile Helper Utilities
  Dynamically extracts profile identifiers and normalizes URLs without hardcoded profiles.
 */

export function extractTrailblazerProfileId(urlStr: string | null | undefined): string | null {
  if (!urlStr || typeof urlStr !== 'string') return null;
  const clean = urlStr.trim();
  if (!clean || !clean.startsWith('http')) return null;

  try {
    const parsed = new URL(clean);
    const pathname = parsed.pathname.replace(/\/+$/, ''); // Strip trailing slashes
    const parts = pathname.split('/').filter(Boolean);

    if (parts.length === 0) return null;

    // e.g. /trailblazer/cnwag9jss8h8w8rzm or /id/cnwag9jss8h8w8rzm or /me/cnwag9jss8h8w8rzm
    const lastPart = parts[parts.length - 1];

    if (lastPart && lastPart !== 'trailblazer' && lastPart !== 'id' && lastPart !== 'me' && lastPart.length > 2) {
      return lastPart;
    }
  } catch {
    // If URL constructor fails, attempt regex fallback
    const match = clean.match(/(?:trailblazer|id|me)\/([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) return match[1];
  }

  return null;
}

export function normalizeTrailheadUrl(urlStr: string | null | undefined): string | null {
  if (!urlStr || typeof urlStr !== 'string') return null;
  let clean = urlStr.trim();
  if (!clean) return null;

  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }

  try {
    const parsed = new URL(clean);
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return null;
  }
}
