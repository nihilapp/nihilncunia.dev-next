import { redirect } from 'next/navigation';

import { Logger } from '@/_libs/tools/logger.tools';

import { completeGuard } from './complete-guard';

export async function guardCompleteAction(_prevState: any, formData: FormData) {
  Logger.auth('가드 완료 액션 시작');
  try {
    // 인증 완료 쿠키 저장
    const res = await completeGuard();
    Logger.auth('가드 완료 쿠키 저장 시도', { success: res.success, });

    // 콜백 URL 추출
    const callbackUrl = formData.get('callback') as string | null;
    Logger.auth('콜백 URL 추출', { callbackUrl, });

    if (res.success) {
      let url = '/';
      if (callbackUrl && typeof callbackUrl === 'string') {
        try {
          const decoded = decodeURIComponent(callbackUrl);
          // /auth/guard로 시작하면 루프 방지
          if (!decoded.startsWith('/auth/guard')) {
            url = decoded;
            Logger.auth('리다이렉트 URL 설정 (콜백)', { url, });
          }
          else {
            Logger.security('가드 페이지 무한 루프 방지', {
              originalCallback: decoded,
              redirectedTo: url,
            });
          }
        }
        catch {
          Logger.warn('AUTH', '콜백 URL 디코딩 실패', { callbackUrl, });
          // fallback: /
        }
      }
      else {
        Logger.auth('리다이렉트 URL 설정 (기본값)', { url, });
      }
      redirect(url);
    }

    Logger.authError('가드 완료 처리 실패');
    return {
      success: false,
      message: '인증 완료 처리에 실패했습니다.',
    };
  }
  catch (error) {
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      Logger.auth('리다이렉트 발생');
    }
    else {
      Logger.authError('가드 완료 처리 중 예외 발생', { error, });
    }
    // redirect는 예외를 발생시키므로, 여기서 잡히더라도 정상 동작일 수 있습니다.
    // Next.js가 리다이렉트를 처리하도록 에러를 다시 던집니다.
    throw error;
  }
}
