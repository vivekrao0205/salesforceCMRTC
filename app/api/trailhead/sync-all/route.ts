import { NextResponse } from 'next/server';
import { getStudents } from '@/services/students';
import { syncAllTrailheadProfiles, getAllCachedTrailheadRecords } from '@/services/trailheadService';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const forceRefresh = Boolean(body.forceRefresh);

    const students = await getStudents(forceRefresh);
    const summary = await syncAllTrailheadProfiles(students, forceRefresh);

    return NextResponse.json({
      success: true,
      message: 'Trailblazer profiles synchronized successfully.',
      records: summary.records,
      totalStudents: summary.totalStudents,
      synced: summary.synced,
      unavailable: summary.unavailable,
    });
  } catch (error: any) {
    console.error('Error in /api/trailhead/sync-all:', error);
    return NextResponse.json({
      success: false,
      records: getAllCachedTrailheadRecords(),
      error: error.message || 'Failed to sync profiles.',
    });
  }
}

export async function GET() {
  try {
    const students = await getStudents(false);
    const summary = await syncAllTrailheadProfiles(students, false);

    return NextResponse.json({
      success: true,
      records: summary.records,
      totalStudents: summary.totalStudents,
      synced: summary.synced,
      unavailable: summary.unavailable,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      records: getAllCachedTrailheadRecords(),
      error: error.message || 'Failed to sync profiles.',
    });
  }
}
