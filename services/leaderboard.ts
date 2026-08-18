import { Student } from '@/types';
import { getStudents } from '@/services/students';
import { parseNumericValue } from '@/lib/utils';

export interface LeaderboardEntry {
  rank: number;
  student: Student;
  metricValue: number;
}

export type LeaderboardMetric = 'score' | 'badges' | 'certifications' | 'club';

export async function getLeaderboardEntries(
  metric: LeaderboardMetric = 'score',
  branch = 'ALL',
  year = 'ALL'
): Promise<LeaderboardEntry[]> {
  let students = await getStudents();

  if (branch && branch !== 'ALL') {
    students = students.filter((s) => s.branch.toLowerCase() === branch.toLowerCase());
  }

  if (year && year !== 'ALL') {
    students = students.filter((s) => String(s.year) === String(year));
  }

  // Sort descending by metric
  const sorted = [...students].sort((a, b) => {
    switch (metric) {
      case 'badges':
        return parseNumericValue(b.totalTrailheadBadges) - parseNumericValue(a.totalTrailheadBadges);
      case 'certifications':
        return parseNumericValue(b.certificationsCount || b.certifications) - parseNumericValue(a.certificationsCount || a.certifications);
      case 'club':
        return parseNumericValue(b.clubPoints) - parseNumericValue(a.clubPoints);
      case 'score':
      default:
        return parseNumericValue(b.totalTrailheadScore) - parseNumericValue(a.totalTrailheadScore);
    }
  });

  // Calculate competition ranks for ties (#1, #1, #1, #4, #5)
  let currentRank = 1;
  const entries: LeaderboardEntry[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const s = sorted[i];
    let val = parseNumericValue(s.totalTrailheadScore);
    if (metric === 'badges') val = parseNumericValue(s.totalTrailheadBadges);
    else if (metric === 'certifications') val = parseNumericValue(s.certificationsCount || s.certifications);
    else if (metric === 'club') val = parseNumericValue(s.clubPoints);

    if (i > 0) {
      const prevEntry = entries[i - 1];
      if (val !== prevEntry.metricValue) {
        currentRank = i + 1;
      }
    }

    entries.push({
      rank: currentRank,
      student: s,
      metricValue: val,
    });
  }

  return entries;
}
