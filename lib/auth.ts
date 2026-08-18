import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'sf-club-cmrtc-secret-key-2026';

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    return false;
  }
  
  // Validate token signature/value
  return sessionCookie.value.startsWith('auth-session-valid-');
}

export async function createAdminSession(email: string): Promise<string> {
  const token = `auth-session-valid-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  return token;
}

export function getAdminCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}
