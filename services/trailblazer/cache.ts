export type SyncStatus =
  | 'SYNCING'
  | 'VERIFIED'
  | 'PRIVATE'
  | 'NO_PROFILE'
  | 'INVALID_URL'
  | 'UNAVAILABLE'
  | 'FAILED'
  | 'LAST_VERIFIED'
  | 'CLUB_FORM_SNAPSHOT';

export interface TrailblazerRecord {
  success: boolean;
  studentId: string;
  trailblazerProfileId?: string;
  trailheadProfileUrl?: string;
  points: number;
  badges: number;
  rank: string;
  trails: number;
  superbadges: number;
  certifications: number;
  lastSyncedAt: string;
  syncStatus: SyncStatus;
  source: 'trailblazer-public-rendered' | 'cache' | 'sheet-snapshot' | 'unavailable';
  syncStatusLabel: string;
  error?: string;
}

const trailblazerCacheStore = new Map<string, TrailblazerRecord>();

export function getCachedProfile(studentId: string): TrailblazerRecord | undefined {
  return trailblazerCacheStore.get(studentId);
}

export function setCachedProfile(studentId: string, record: TrailblazerRecord): void {
  trailblazerCacheStore.set(studentId, record);
}

export function getAllCachedProfiles(): Record<string, TrailblazerRecord> {
  const result: Record<string, TrailblazerRecord> = {};
  trailblazerCacheStore.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function clearCache(): void {
  trailblazerCacheStore.clear();
}
