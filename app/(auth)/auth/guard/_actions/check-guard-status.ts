'use server';

import { CookieHelper } from '@/_libs/tools';
import { Logger } from '@/_libs/tools/logger.tools';

/**
 * 'guard_completed' 쿠키를 확인하여 보호막 인증이 완료되었는지 확인합니다.
 *
 * @returns 인증 완료 여부 (isCompleted)
 */
export async function checkGuardStatus() {
  try {
    const guardCompleted = await CookieHelper.get<string>('guard_completed');
    const isCompleted = guardCompleted === 'true';

    Logger.auth('가드 상태 확인', { isCompleted, });

    return { isCompleted, };
  }
  catch (error) {
    Logger.authError('가드 상태 확인 실패', { error, });
    return { isCompleted: false, };
  }
}
