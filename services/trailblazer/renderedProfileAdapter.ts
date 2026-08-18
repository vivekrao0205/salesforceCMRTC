import { TrailblazerRecord, getCachedProfile, setCachedProfile } from './cache';
import { extractTrailblazerProfileId, normalizeTrailheadUrl, deriveRankFromPoints } from './normalizer';
import { parseNumericValue } from '@/lib/utils';

export async function getPublicTrailblazerProfile(
  studentId: string,
  rawUrl: string | undefined | null,
  submittedPoints = 0,
  submittedBadges = 0,
  forceRefresh = false
): Promise<TrailblazerRecord> {
  const normalizedUrl = normalizeTrailheadUrl(rawUrl);
  const primaryHandle = extractTrailblazerProfileId(normalizedUrl);
  const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // 1. Return cache if available and verified
  if (!forceRefresh) {
    const cached = getCachedProfile(studentId);
    if (cached && cached.syncStatus === 'VERIFIED') {
      return {
        ...cached,
        source: 'cache',
        syncStatusLabel: `VERIFIED FROM TRAILBLAZER • ${cached.lastSyncedAt}`,
      };
    }
  }

  // 2. Handle missing or invalid profile URL
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
      syncStatus: 'INVALID_URL',
      source: 'unavailable',
      syncStatusLabel: 'INVALID PROFILE URL',
    };
    setCachedProfile(studentId, record);
    return record;
  }

  // Fallback snapshot record (accurately labeled as CLUB FORM SNAPSHOT)
  const sheetSnapshotRecord: TrailblazerRecord = {
    success: false,
    studentId,
    trailblazerProfileId: primaryHandle,
    trailheadProfileUrl: normalizedUrl,
    points: parseNumericValue(submittedPoints),
    badges: parseNumericValue(submittedBadges),
    rank: deriveRankFromPoints(submittedPoints),
    trails: 0,
    superbadges: 0,
    certifications: 0,
    lastSyncedAt: nowStr,
    syncStatus: 'CLUB_FORM_SNAPSHOT',
    source: 'sheet-snapshot',
    syncStatusLabel: 'CLUB FORM SNAPSHOT',
  };

  // Build candidate handle list (e.g. cnwag9jss8h8w8rzm -> cnwagn9jss8h8w8rzm candidate)
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

  // 3. Query Public Trailblazer Profile via Salesforce GraphQL API
  for (const handle of handleCandidates) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

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
            syncStatus: 'VERIFIED',
            source: 'trailblazer-public-rendered',
            syncStatusLabel: `VERIFIED FROM TRAILBLAZER • ${nowStr}`,
          };
          setCachedProfile(studentId, verifiedRecord);
          return verifiedRecord;
        }
      }
    } catch (err: any) {
      console.warn(`GraphQL sync attempt failed for ${handle}:`, err.message || err);
    }
  }

  // 4. Return snapshot fallback if live sync is unexposed or failed
  setCachedProfile(studentId, sheetSnapshotRecord);
  return sheetSnapshotRecord;
}
