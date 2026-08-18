import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminSession, getAdminCookieOptions } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'salesforceclub@cmrtc.ac.in';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedPass = String(password).trim();

    const expectedEmail = ADMIN_EMAIL.trim().toLowerCase();

    // Constant-time style comparison logic (server-side only)
    if (trimmedEmail !== expectedEmail || trimmedPass !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createAdminSession(trimmedEmail);
    const cookieOpts = getAdminCookieOptions();

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
    });

    response.cookies.set({
      name: cookieOpts.name,
      value: token,
      httpOnly: cookieOpts.httpOnly,
      secure: cookieOpts.secure,
      sameSite: cookieOpts.sameSite,
      path: cookieOpts.path,
      maxAge: cookieOpts.maxAge,
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Invalid admin credentials.' },
      { status: 500 }
    );
  }
}
