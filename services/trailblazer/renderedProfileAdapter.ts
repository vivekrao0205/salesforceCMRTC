import { TrailblazerRecord, getCachedProfile, setCachedProfile } from './cache';
import { extractTrailblazerProfileId, normalizeTrailheadUrl, deriveRankFromPoints } from './normalizer';
import { parseNumericValue } from '@/lib/utils';

const CACHE_TTL_MS = 10 * 60 * 1000; // 10-minute cache for verified profiles

const ERROR_COOLDOWN_MS = 45 * 1000; // 45-second retry cooldown for failed/unavailable requests

// In-flight request deduplication store
const inFlightRequests = new Map<string, Promise<TrailblazerRecord>>();

export async function getPublicTrailblazerProfile(
  studentId: string,
  rawUrl: string | undefined | null,
  submittedPoints = 0,
  submittedBadges = 0,
  forceRefresh = false
): Promise<TrailblazerRecord> {
  const normalizedUrl = normalizeTrailheadUrl(rawUrl);
  const primaryHandle = extractTrailblazerProfileId(normalizedUrl);
  const now = Date.now();
  const nowStr = new Date(now).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // 1. Check existing cache
  const cached = getCachedProfile(studentId);

  if (!forceRefresh && cached) {
    // If verified and within 10-minute TTL, return cached
    if (cached.syncStatus === 'VERIFIED' && cached.fetchedAt && now - cached.fetchedAt < CACHE_TTL_MS) {
      return {
        ...cached,
        source: 'cache',
        syncStatusLabel: `VERIFIED FROM TRAILBLAZER • ${cached.lastSyncedAt}`,
      };
    }

    // If failed/unavailable recently (within 45s cooldown), return cached negative result to avoid spamming
    if (cached.syncStatus !== 'VERIFIED' && cached.fetchedAt && now - cached.fetchedAt < ERROR_COOLDOWN_MS) {
      return cached;
    }
  }

  // 2. Handle missing or invalid profile URL immediately
  if (!rawUrl || !rawUrl.trim()) {
    const record: TrailblazerRecord = {
      success: false,
      studentId,
      points: 0,
      badges: 0,
      rank: 'N/A',
      trails: 0,
      superbadges: 0,
      certifications: 0,
      lastSyncedAt: nowStr,
      fetchedAt: now,
      syncStatus: 'NO_PROFILE',
      source: 'unavailable',
      syncStatusLabel: 'TRAILBLAZER PROFILE NOT PROVIDED',
    };
    setCachedProfile(studentId, record);
    return record;
  }

  if (!normalizedUrl || !primaryHandle) {
    const record: TrailblazerRecord = {
      success: false,
      studentId,
      trailblazerProfileId: primaryHandle || undefined,
      trailheadProfileUrl: rawUrl,
      points: 0,
      badges: 0,
      rank: 'N/A',
      trails: 0,
      superbadges: 0,
      certifications: 0,
      lastSyncedAt: nowStr,
      fetchedAt: now,
      syncStatus: 'INVALID_URL',
      source: 'unavailable',
      syncStatusLabel: 'INVALID PROFILE URL',
    };
    setCachedProfile(studentId, record);
    return record;
  }

  // 3. Request Deduplication: If a request for this student is already in flight, reuse the promise
  if (!forceRefresh && inFlightRequests.has(studentId)) {
    return inFlightRequests.get(studentId)!;
  }

  // Execute fetch wrapped in deduplicated promise
  const fetchPromise = (async (): Promise<TrailblazerRecord> => {
    try {
      // Handle candidates list
      const handleCandidates: string[] = [primaryHandle];
      if (primaryHandle === 'cnwag9jss8h8w8rzm') {
        handleCandidates.push('cnwagn9jss8h8w8rzm');
      }

      const graphqlQuery = `
        query GetTrailheadProfile($slug: String!) {
          profile(slug: $slug) {
            ... on PublicProfile {
              id
              trailheadStats {
                earnedPointsSum
                earnedBadgesCount
                completedTrailCount
                superbadgeCount
                rank {
                  title
                }
              }
            }
          }
        }
      `;

      for (const handle of handleCandidates) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // Strict 10s timeout

          const res = await fetch('https://profile.api.trailhead.com/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            body: JSON.stringify({
              query: graphqlQuery,
              variables: { slug: handle },
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const json = await res.json();
            const stats = json.data?.profile?.trailheadStats;

            if (stats && (stats.earnedPointsSum > 0 || stats.earnedBadgesCount > 0)) {
              const verifiedRecord: TrailblazerRecord = {
                success: true,
                studentId,
                trailblazerProfileId: handle,
                trailheadProfileUrl: normalizedUrl,
                points: parseNumericValue(stats.earnedPointsSum),
                badges: parseNumericValue(stats.earnedBadgesCount),
                rank: stats.rank?.title || deriveRankFromPoints(stats.earnedPointsSum),
                trails: parseNumericValue(stats.completedTrailCount),
                superbadges: parseNumericValue(stats.superbadgeCount),
                certifications: 0,
                lastSyncedAt: nowStr,
                fetchedAt: Date.now(),
                syncStatus: 'VERIFIED',
                source: 'trailblazer-public-rendered',
                syncStatusLabel: `VERIFIED FROM TRAILBLAZER • ${nowStr}`,
              };
              setCachedProfile(studentId, verifiedRecord);
              return verifiedRecord;
            }
          }
        } catch (err: any) {
          console.warn(`GraphQL sync attempt failed for ${handle} (${studentId}):`, err.message || err);
        }
      }

      // If previously verified record exists in cache, keep returning it as LAST VERIFIED
      const existingCached = getCachedProfile(studentId);
      if (existingCached && existingCached.syncStatus === 'VERIFIED') {
        const staleRecord: TrailblazerRecord = {
          ...existingCached,
          syncStatusLabel: `LAST VERIFIED • ${existingCached.lastSyncedAt}`,
        };
        return staleRecord;
      }

      const unavailableRecord: TrailblazerRecord = {
        success: false,
        studentId,
        trailblazerProfileId: primaryHandle,
        trailheadProfileUrl: normalizedUrl,
        points: 0,
        badges: 0,
        rank: 'N/A',
        trails: 0,
        superbadges: 0,
        certifications: 0,
        lastSyncedAt: nowStr,
        fetchedAt: Date.now(),
        syncStatus: 'UNAVAILABLE',
        source: 'unavailable',
        syncStatusLabel: 'TRAILBLAZER DATA UNAVAILABLE',
      };
      setCachedProfile(studentId, unavailableRecord);
      return unavailableRecord;
    } finally {
      inFlightRequests.delete(studentId);
    }
  })();

  inFlightRequests.set(studentId, fetchPromise);
  return fetchPromise;
}

