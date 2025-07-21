import { NextResponse, type NextRequest } from 'next/server';

// 미들웨어가 실행될 경로를 정의합니다.
// API 라우트, Next.js 내부 경로, 정적 파일, 로그인 페이지, 인덱스 페이지 등은 제외합니다.
export const config = {
  matcher: [
    /*
     * 아래 패턴들과 일치하는 경로를 제외한 모든 요청 경로에서 미들웨어를 실행합니다:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * - auth/signin (로그인 페이지)
     * - / (인덱스 페이지)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth/signin|$).*)',
  ],
};

export async function middleware(request: NextRequest) {
  console.log('--- 미들웨어 시작 ---');
  console.log('요청 경로:', request.nextUrl.pathname);

  // 1. 쿠키에서 리프레시 토큰 가져오기
  const refreshToken = request.cookies.get('refreshToken')?.value;
  console.log('쿠키 내 리프레시 토큰:', refreshToken ? '발견됨' : '찾을 수 없음');

  // 2. 리프레시 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!refreshToken) {
    console.log('리프레시 토큰 없음, 로그인 페이지로 리다이렉트합니다...');
    const signInUrl = new URL('/auth/signin', request.url);
    // 현재 경로를 쿼리 파라미터로 추가하여 로그인 후 리다이렉트할 수 있도록 함 (선택 사항)
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 3. 내부 API 라우트를 호출하여 토큰 갱신/검증 시도
  // 미들웨어는 자체 서버에서 실행되므로 절대 URL 사용
  const refreshUrl = new URL('/api/auth/refresh', request.url);
  console.log('토큰 갱신 API 호출:', refreshUrl.toString());

  try {
    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        // 현재 요청의 쿠키를 그대로 전달하여 리프레시 토큰을 API로 보냄
        Cookie: request.cookies.toString(),
        'Content-Type': 'application/json',
      },
      // refresh API가 본문을 요구하지 않더라도 명시적으로 빈 객체 또는 필요한 데이터 전송
      body: JSON.stringify({}),
    });

    console.log('토큰 갱신 API 상태:', response.status);

    // 4. API 응답 처리
    if (response.ok) {
      // 4.1. 갱신 성공: 다음 요청으로 진행하되, API가 설정한 쿠키를 포함
      console.log('토큰 갱신 성공, 요청 계속 진행...');
      const nextResponse = NextResponse.next(); // 다음 미들웨어/페이지로 진행

      // refresh API 응답의 Set-Cookie 헤더를 가져와서 nextResponse에 설정
      // (새 액세스 토큰과 리프레시 토큰이 쿠키로 설정됨)
      const setCookieHeaders = response.headers.getSetCookie();
      if (setCookieHeaders.length > 0) {
        console.log('갱신 API 응답의 쿠키를 설정합니다.');
        setCookieHeaders.forEach((cookie) => {
          nextResponse.headers.append('Set-Cookie', cookie);
        });
      } else {
        console.log('갱신 API 응답에 Set-Cookie 헤더가 없습니다.');
        // 만약 refresh API 가 쿠키를 항상 설정하지 않는다면 이 부분 수정 필요
        // 예를 들어, 토큰이 유효해서 갱신이 필요 없었을 수도 있음
        // 이 경우엔 그냥 next() 만 해도 됨
      }

      return nextResponse;
    } else {
      // 4.2. 갱신 실패 (예: 리프레시 토큰 만료 또는 무효): 로그인 페이지로 리다이렉트
      console.log('토큰 갱신 실패, 로그인 페이지로 리다이렉트합니다...');
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);

      // 실패 시 기존 쿠키 삭제 응답 생성
      const redirectResponse = NextResponse.redirect(signInUrl);
      console.log('유효하지 않을 수 있는 쿠키를 삭제합니다.');
      redirectResponse.cookies.delete('refreshToken');
      redirectResponse.cookies.delete('accessToken'); // accessToken 쿠키도 함께 삭제

      // refresh API 응답에 쿠키 삭제 헤더가 있을 수 있으므로, 그것도 반영
      const setCookieHeaders = response.headers.getSetCookie();
      if (setCookieHeaders.length > 0) {
        setCookieHeaders.forEach((cookie) => {
          redirectResponse.headers.append('Set-Cookie', cookie);
        });
      }

      return redirectResponse;
    }
  } catch (error) {
    // 5. fetch 중 네트워크 오류 등 발생 시 처리
    console.error('토큰 갱신 API 호출 중 오류 발생:', error);
    // 오류 발생 시 안전하게 로그인 페이지로 보내거나 오류 페이지 표시
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('error', 'middleware_fetch_error');
    return NextResponse.redirect(signInUrl);
  } finally {
    console.log('--- 미들웨어 종료 ---');
  }
}
