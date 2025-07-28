/**
 * URL이 내부 리다이렉션에 안전한지 확인합니다.
 * - 상대 경로 (`/path/to/page`)는 허용합니다.
 * - 절대 경로의 경우, 사이트의 원본(origin)과 일치해야 합니다.
 * - 프로토콜 상대 URL (`//evil.com`)과 같은 잠재적 위협은 차단합니다.
 *
 * @param url 검증할 URL 문자열
 * @returns 안전한 경우 true, 그렇지 않은 경우 false
 */
export function isSafeRedirectUrl(url: string | null | undefined): boolean {
  if (!url) {
    return false;
  }

  try {
    // 1. URL이 '/'로 시작하는지 확인 (상대 경로)
    if (url.startsWith('/')) {
      // '//'로 시작하는 프로토콜 상대 URL을 방지
      return !url.startsWith('//');
    }

    // 2. 절대 URL인 경우, 우리 사이트의 origin과 일치하는지 확인
    const siteOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL!).origin;
    const redirectOrigin = new URL(url).origin;

    return redirectOrigin === siteOrigin;
  }
  catch (error) {
    // URL 파싱에 실패하면 안전하지 않은 것으로 간주
    console.error('Invalid URL for redirection:', url, error);
    return false;
  }
}
