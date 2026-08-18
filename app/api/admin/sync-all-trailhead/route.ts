import { NextResponse } from 'next/server';
import { getAdminStudents } from '@/services/students';
import { syncAllTrailheadProfiles } from '@/services/trailheadService';

export async function POST() {
  try {
    const students = await getAdminStudents();
    const summary = await syncAllTrailheadProfiles(students, true);

    return NextResponse.json({
      success: true,
      message: `Bulk Trailhead sync processed for ${summary.totalStudents} student profiles.`,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to complete bulk Trailhead sync.' },
      { status: 500 }
    );
  }
}
