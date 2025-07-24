'use server';

import { CookieHelper } from '@/_libs/tools/cookie.tools';

/**
 * 인증 완료 후 24시간 동안 재검증이 필요 없도록 쿠키를 설정합니다.
 *
 * 이 쿠키는 DetectPath에서 보호된 경로 접근 시 인증 여부를 확인하는 데 사용됩니다.
 */
export async function setAuthComplete() {
  try {
    // 인증 완료 쿠키 설정 (24시간 유효)
    await CookieHelper.set(
      'auth_completed',
      'true',
      '24h'
    );

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
