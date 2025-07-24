'use server';

import { redirect } from 'next/navigation';

import { CookieHelper } from '@/_libs/tools/cookie.tools';

type FormState = {
  success: boolean;
  message: string;
};

/**
 * 인증 완료 후 24시간 동안 재검증이 필요 없도록 쿠키를 설정하는 폼 액션입니다.
 *
 * 이 액션은 클라이언트 컴포넌트에서 폼 액션으로 호출됩니다.
 */
export async function setAuthCompleteAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // 인증 완료 쿠키 설정 (24시간 유효)
    await CookieHelper.set(
      'auth_completed',
      'true',
      '24h'
    );

    // 콜백 URL이 있으면 해당 URL로 리다이렉트
    const callback = formData.get('callback') as string;
    if (callback) {
      const decodedCallback = decodeURIComponent(callback);

      // 콜백이 /auth 경로인 경우 홈으로 리다이렉트 (무한 리다이렉트 방지)
      if (decodedCallback.startsWith('/auth')) {
        redirect('/');
      }

      redirect(decodedCallback);
    }

    return {
      success: true,
      message: '인증 완료 쿠키가 설정되었습니다.',
    };
  }
  catch (error) {
    console.error('인증 완료 쿠키 설정 실패:', error);

    return {
      success: false,
      message: '인증 완료 쿠키 설정에 실패했습니다.',
    };
  }
}
