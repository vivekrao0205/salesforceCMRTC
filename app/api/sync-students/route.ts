import { NextResponse } from 'next/server';
import { createOrUpdateStudent } from '@/services/students';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate minimum required fields
    if (!body.name || !body.rollNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name and rollNumber are required.' },
        { status: 400 }
      );
    }

    // Process ingestion
    const student = await createOrUpdateStudent({
      name: String(body.name).trim(),
      rollNumber: String(body.rollNumber).trim().toUpperCase(),
      email: body.email ? String(body.email).trim() : undefined,
      department: body.department || 'CSE',
      year: body.year || '1',
      section: body.section || '',
      profilePhoto: body.profilePhoto || '',
      trailheadUrl: body.trailheadUrl || '',
      salesforceUsername: body.salesforceUsername || '',
      trailheadPoints: Number(body.trailheadPoints) || 0,
      badges: Number(body.badges) || 0,
      superbadges: Number(body.superbadges) || 0,
      certifications: Number(body.certifications) || 0,
      clubPoints: Number(body.clubPoints) || 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Student profile ingested successfully.',
      student,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal ingestion error.' },
      { status: 500 }
    );
  }
}
