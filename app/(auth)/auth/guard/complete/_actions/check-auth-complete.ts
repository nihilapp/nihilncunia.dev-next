'use server';

import { CookieHelper } from '@/_libs/tools/cookie.tools';

/**
 * 인증 완료 쿠키를 확인하여 인증이 완료되었는지 확인합니다.
 *
 * @returns 인증 완료 여부
 */
export async function checkAuthComplete() {
  try {
    // 인증 완료 쿠키 확인
    const authCompleted = await CookieHelper.get<string>('auth_completed');

    return {
      isCompleted: authCompleted === 'true',
      message: authCompleted === 'true'
        ? '인증이 완료되었습니다.'
        : '인증이 필요합니다.',
    };
  }
  catch (error) {
    console.error('인증 완료 확인 실패:', error);

    return {
      isCompleted: false,
      message: '인증 완료 확인에 실패했습니다.',
    };
  }
}
