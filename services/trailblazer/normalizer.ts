import { extractTrailblazerProfileId, normalizeTrailheadUrl } from '@/lib/trailheadHelper';

export { extractTrailblazerProfileId, normalizeTrailheadUrl };

export function deriveRankFromPoints(points: number): string {
  const pts = typeof points === 'number' && !isNaN(points) ? points : 0;
  if (pts >= 100000) return 'All Star Ranger';
  if (pts >= 80000) return 'Five Star Ranger';
  if (pts >= 60000) return 'Four Star Ranger';
  if (pts >= 40000) return 'Triple Star Ranger';
  if (pts >= 30000) return 'Double Star Ranger';
  if (pts >= 20000) return 'Ranger';
  if (pts >= 18000) return 'Mountaineer';
  if (pts >= 10000) return 'Adventurer';
  if (pts >= 3000) return 'Explorer';
  if (pts >= 1000) return 'Hiker';
  if (pts >= 200) return 'Scout';
  return 'Greenhorn';
}
