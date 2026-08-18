import { NextResponse } from 'next/server';
import { syncSingleTrailheadProfile } from '@/services/trailheadService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, profileUrl, submittedPoints, submittedBadges, forceRefresh } = body;

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'studentId parameter is required.' },
        { status: 400 }
      );
    }

    const shouldForce = forceRefresh !== undefined ? Boolean(forceRefresh) : true;

    const record = await syncSingleTrailheadProfile(
      studentId,
      profileUrl,
      submittedPoints || 0,
      submittedBadges || 0,
      shouldForce
    );

    return NextResponse.json({
      success: true,
      message: 'Trailhead data refreshed successfully.',
      trailhead: record,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync Trailhead profile.' },
      { status: 500 }
    );
  }
}
