import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Admin + admin-API auth. Left exactly as before, just extracted so the single
// middleware entry point can dispatch between auth and i18n by path.
async function adminAuth(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next();

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (request.nextUrl.pathname.startsWith('/api/admin/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin area keeps its Supabase auth gate and stays Czech-only.
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    return adminAuth(request);
  }

  // Everything else public runs through next-intl locale routing.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    // Public pages: everything except /api, /admin, /pay, Next internals,
    // and files with an extension (favicon.ico, sitemap.xml, …).
    '/((?!api|admin|pay|_next|_vercel|.*\\..*).*)',
  ],
};
