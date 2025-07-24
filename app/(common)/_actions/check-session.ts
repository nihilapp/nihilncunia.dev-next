'use server';

import { createActionClient } from '@/_libs/server/supabase';

/**
 * 서버 액션에서 Supabase 세션을 확인합니다.
 *
 * @returns 세션 존재 여부
 */
export async function checkSession() {
  try {
    const supabase = await createActionClient();
    const { data: { session, }, error, } = await supabase.auth.getSession();

    if (error) {
      console.error('세션 확인 실패:', error);
      return { hasSession: false, };
    }

    return { hasSession: !!session, };
  }
  catch (error) {
    console.error('세션 확인 중 오류 발생:', error);
    return { hasSession: false, };
  }
}
