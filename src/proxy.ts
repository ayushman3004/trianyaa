// src/proxy.ts
import { NextResponse, NextRequest } from 'next/server';

export const SESSION_COOKIE_NAME = 'trianyaa_session';

// Safe JWT decode supporting Node.js Buffer and Edge TextDecoder
function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    if (typeof Buffer !== 'undefined') {
      const json = Buffer.from(base64, 'base64').toString('utf8');
      return JSON.parse(json);
    }
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  function createLoginRedirect(targetPath: string) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', targetPath);
    return url;
  }

  // ── Admin routes ────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(createLoginRedirect(pathname));
    }
    const payload = decodeJwtPayload(token);
    const now = Math.floor(Date.now() / 1000);
    if (!payload || (payload.exp && payload.exp < now) || payload.role !== 'admin') {
      const unauthUrl = request.nextUrl.clone();
      unauthUrl.pathname = '/unauthorized';
      unauthUrl.search = '';
      const res = NextResponse.redirect(unauthUrl);
      if (!payload || (payload.exp && payload.exp < now)) {
        res.cookies.delete(SESSION_COOKIE_NAME);
      }
      return res;
    }
  }

  // ── Protected customer routes ────────────────────────────────
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/checkout')) {
    if (!token) {
      return NextResponse.redirect(createLoginRedirect(pathname));
    }
    const payload = decodeJwtPayload(token);
    const now = Math.floor(Date.now() / 1000);
    if (!payload || (payload.exp && payload.exp < now)) {
      const res = NextResponse.redirect(createLoginRedirect(pathname));
      res.cookies.delete(SESSION_COOKIE_NAME);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/checkout/:path*'],
};
