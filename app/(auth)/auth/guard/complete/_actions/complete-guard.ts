'use server';

import { CookieHelper } from '@/_libs/tools';

export async function completeGuard() {
  // 검증이 완료되었을 때 노출되는 페이지에서 돌아가기 버튼 클릭하면 도달.
  // 해당 로직에서는 한가지를 진행한다.
  // 인증 완료 쿠키를 설정한다. 해당 쿠키는 24시간 후면 만료된다.
  await CookieHelper
    .set(
      'guard_completed',
      'true',
      '24h'
    );

  return {
    success: true,
    message: '인증 완료',
  };
}
