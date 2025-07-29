'use server';

import { createActionClient } from '@/_libs/server/supabase';

export async function signOut() {
  try {
    const supabase = await createActionClient();
    await supabase.auth.signOut();
    return { success: true, };
  }
  catch (error) {
    console.error('로그아웃 실패:', error);
    return { success: false, error: '로그아웃 중 오류가 발생했습니다.', };
  }
}
