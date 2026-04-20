import { NextResponse } from 'next/server';

const locales = ['en', 'id', 'zh'];
const defaultLocale = 'en';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Skip API routes, _next/static, _next/image, favicon.ico and other assets
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Check if the pathname already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return;
  }

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Match all incoming requests except those with extensions (like .js, .css, etc), _next/static, _next/image
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
