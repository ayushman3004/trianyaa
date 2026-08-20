// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, getSessionCookieOptions } from '@/lib/auth';

function clearSession(res: NextResponse) {
  res.cookies.delete(SESSION_COOKIE_NAME);
  res.cookies.set(SESSION_COOKIE_NAME, '', {
    ...getSessionCookieOptions(),
    maxAge: 0,
    expires: new Date(0),
  });
  return res;
}

// GET /api/auth/logout — used for direct link navigation
export async function GET(req: NextRequest) {
  const url = new URL('/auth/login', req.url);
  const res = NextResponse.redirect(url);
  return clearSession(res);
}

// POST /api/auth/logout — used for fetch API calls
export async function POST() {
  const res = NextResponse.json({ success: true });
  return clearSession(res);
}
