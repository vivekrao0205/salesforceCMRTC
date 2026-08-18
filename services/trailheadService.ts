import { Student } from '@/types';
import { getStudents } from '@/services/students';
import {
  getPublicTrailblazerProfile,
  TrailblazerRecord,
  SyncStatus,
  getAllCachedProfiles,
} from '@/services/trailblazer';

export type { SyncStatus, TrailblazerRecord };
export type TrailheadRecord = TrailblazerRecord;
export { getAllCachedProfiles, getAllCachedProfiles as getAllCachedTrailheadRecords };

export interface BulkSyncSummary {
  totalStudents: number;
  profilesFound: number;
  synced: number;
  private: number;
  unavailable: number;
  failed: number;
  noProfile: number;
  timestamp: string;
  records: Record<string, TrailblazerRecord>;
}

/**
 * Retrieves or synchronizes an individual student's Trailblazer profile using rendered adapter.
 */
export async function syncSingleTrailblazerProfile(
  studentId: string,
  rawUrl: string | undefined | null,
  submittedPoints = 0,
  submittedBadges = 0,
  forceRefresh = false
): Promise<TrailblazerRecord> {
  return getPublicTrailblazerProfile(studentId, rawUrl, submittedPoints, submittedBadges, forceRefresh);
}

export const syncSingleTrailheadProfile = syncSingleTrailblazerProfile;

/**
 * Controlled Batch Bulk Synchronization across ALL registered students.
 * Processes in small concurrent batches of 5. If one fails, execution seamlessly continues.
 */
export async function syncAllTrailblazerProfiles(
  studentsOrForceRefresh?: Student[] | boolean,
  forceRefreshOrProgress?: boolean | ((syncedCount: number, totalCount: number, currentStudent?: Student) => void),
  onProgress?: (syncedCount: number, totalCount: number, currentStudent?: Student) => void
): Promise<BulkSyncSummary> {
  let students: Student[];
  let shouldForceRefresh = true;
  let progressCb: ((syncedCount: number, totalCount: number, currentStudent?: Student) => void) | undefined = onProgress;

  if (Array.isArray(studentsOrForceRefresh)) {
    students = studentsOrForceRefresh;
    if (typeof forceRefreshOrProgress === 'boolean') {
      shouldForceRefresh = forceRefreshOrProgress;
    }
  } else {
    if (typeof studentsOrForceRefresh === 'boolean') {
      shouldForceRefresh = studentsOrForceRefresh;
    }
    if (typeof forceRefreshOrProgress === 'function') {
      progressCb = forceRefreshOrProgress;
    }
    students = await getStudents(true);
  }

  const total = students.length;

  let profilesFound = 0;
  let synced = 0;
  let privateCount = 0;
  let unavailableCount = 0;
  let failedCount = 0;
  let noProfileCount = 0;

  const BATCH_SIZE = 5;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = students.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (student) => {
        try {
          const record = await getPublicTrailblazerProfile(
            student.id,
            student.trailheadProfileLink,
            student.totalTrailheadScore,
            student.totalTrailheadBadges,
            shouldForceRefresh
          );

          if (record.trailheadProfileUrl && record.syncStatus !== 'NO_PROFILE') {
            profilesFound++;
          }

          switch (record.syncStatus) {
            case 'VERIFIED':
              synced++;
              break;
            case 'PRIVATE':
              privateCount++;
              break;
            case 'NO_PROFILE':
              noProfileCount++;
              break;
            case 'INVALID_URL':
            case 'UNAVAILABLE':
            case 'CLUB_FORM_SNAPSHOT':
              unavailableCount++;
              break;
            case 'FAILED':
            default:
              failedCount++;
              break;
          }
        } catch (err) {
          failedCount++;
        }
      })
    );

    const processedSoFar = Math.min(i + BATCH_SIZE, total);
    if (progressCb) {
      progressCb(processedSoFar, total, students[processedSoFar - 1]);
    }
  }

  const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return {
    totalStudents: total,
    profilesFound,
    synced,
    private: privateCount,
    unavailable: unavailableCount,
    failed: failedCount,
    noProfile: noProfileCount,
    timestamp: nowStr,
    records: getAllCachedProfiles(),
  };
}

export const syncAllTrailheadProfiles = syncAllTrailblazerProfiles;
