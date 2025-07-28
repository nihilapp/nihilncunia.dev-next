import { NextResponse, type NextRequest } from 'next/server';

import { Logger } from '@/_libs/tools/logger.tools';

const PROTECTED_ROUTES = [
  '/admin',
  '/blogs',
];

function isProtectedRoute(pathname: string): boolean {
  // `/auth/` 경로는 보호하지만, `/auth/guard`와 `/auth/guard/complete`는 제외
  if (pathname.startsWith('/auth/') && !pathname.startsWith('/auth/guard')) {
    return true;
  }
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

export default function middleware(request: NextRequest) {
  const { pathname, } = request.nextUrl;
  const guardCompleted = request.cookies.get('guard_completed')?.value === 'true';

  Logger.auth('미들웨어 실행', { pathname, guardCompleted, });

  if (isProtectedRoute(pathname)) {
    if (!guardCompleted) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/guard';
      url.searchParams.set('callback', request.nextUrl.pathname);

      Logger.security('보호된 경로 접근 시도 (미인증)', {
        originalPath: pathname,
        redirectingTo: url.pathname,
      });

      return NextResponse.redirect(url);
    }

    Logger.auth('보호된 경로 접근 허용 (인증됨)', { pathname, });
  }

  return NextResponse.next();
}

export const config = { matcher: [ '/((?!api|_next/static|_next/image|favicon.ico).*)', ], };
