import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { authMessage } from '@/_data';
import { JwtHelper } from '@/_libs/tools/jwt.tools';

export const config = {
  matcher: '/api/:path*',
};

export async function middleware(request: NextRequest) {
  const { pathname, } = request.nextUrl;

  // 인증이 필요 없는 API 경로 목록
  const publicApiRoutes = [
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/auth/admin/signup',
    '/api/auth/password/forgot',
    '/api/auth/password/reset',
    '/api/auth/session', // 세션 API는 자체적으로 토큰을 검증하므로 제외
  ];

  if (publicApiRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 쿠키에서 액세스 토큰 가져오기
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return new NextResponse(
      JSON.stringify({ message: authMessage.unauthorized, }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json', },
      }
    );
  }

  try {
    // 토큰 검증
    const decoded = await JwtHelper.verify(accessToken, 'access');

    if (!decoded || typeof decoded === 'string' || !decoded.id) {
      throw new Error('Invalid token payload');
    }

    // 요청 헤더에 사용자 정보 추가
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.id);
    requestHeaders.set('x-user-email', decoded.email);
    requestHeaders.set('x-user-role', decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  catch (error) {
    // 토큰 만료 또는 검증 실패
    return new NextResponse(
      JSON.stringify({ message: authMessage.sessionInvalid, }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json', },
      }
    );
  }
}
