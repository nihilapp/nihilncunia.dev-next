'use server';

import { signInSchema } from '@/_entities/auth';
import { createActionClient } from '@/_libs/server/supabase';
import { Logger } from '@/_libs/tools/logger.tools';

export async function authenticateWithPassword(email: string, password?: string) {
  const validationResult = signInSchema.safeParse({ email, password, });

  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues[0]?.message || '입력값이 올바르지 않습니다.';
    return {
      success: false,
      message: errorMessage,
    };
  }

  const { email: validatedEmail, password: validatedPassword, } = validationResult.data;

  const supabase = await createActionClient();
  const { data, error, } = await supabase.auth.signInWithPassword({
    email: validatedEmail,
    password: validatedPassword,
  });

  if (error) {
    Logger.authError(`로그인 실패: ${error.message}`, { email: validatedEmail, });
    return {
      success: false,
      message: '이메일 또는 비밀번호가 올바르지 않습니다.',
    };
  }

  if (data.user) {
    Logger.auth('이메일/비밀번호 인증 성공', { email: validatedEmail, userId: data.user.id, });
    return {
      success: true,
      message: 'OTP 인증이 필요합니다.',
    };
  }

  return {
    success: false,
    message: '알 수 없는 오류가 발생했습니다.',
  };
}
