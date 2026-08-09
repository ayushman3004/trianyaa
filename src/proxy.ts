// src/middleware.ts
import { NextResponse, NextRequest } from 'next/server';

export const SESSION_COOKIE_NAME = 'trianyaa_session';

// Edge-compatible JWT decode (no Node.js crypto needed)
function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // ── Admin routes ────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    const payload = decodeJwtPayload(token);
    const now = Math.floor(Date.now() / 1000);
    if (!payload || payload.exp < now || payload.role !== 'admin') {
      const res = NextResponse.redirect(
        new URL('/unauthorized', request.url)
      );
      res.cookies.delete(SESSION_COOKIE_NAME);
      return res;
    }
  }

  // ── Protected customer routes ────────────────────────────────
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/checkout')) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    const payload = decodeJwtPayload(token);
    const now = Math.floor(Date.now() / 1000);
    if (!payload || payload.exp < now) {
      const res = NextResponse.redirect(
        new URL('/auth/login', request.url)
      );
      res.cookies.delete(SESSION_COOKIE_NAME);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/checkout/:path*'],
};
