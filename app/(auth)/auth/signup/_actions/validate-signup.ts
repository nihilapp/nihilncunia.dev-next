'use server';

import { signUpSchema } from '@/_entities/auth';
import type { SignUpData } from '@/_entities/auth/auth.types';
import { CookieHelper } from '@/_libs/tools/cookie.tools';
import { Logger } from '@/_libs/tools/logger.tools';

export async function validateAndStoreSignUpData(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const username = formData.get('username') as string;
  const role = formData.get('role') as string;

  const validationResult = signUpSchema.safeParse({
    email,
    password,
    confirmPassword,
    username,
    role,
  });

  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues[0]?.message || '입력값이 올바르지 않습니다.';
    return {
      success: false,
      message: errorMessage,
    };
  }

  const { email: validatedEmail, password: validatedPassword, username: validatedUsername, role: validatedRole, } = validationResult.data;

  const signUpData: SignUpData = {
    email: validatedEmail,
    username: validatedUsername,
    password: validatedPassword,
    role: validatedRole || 'USER',
  };

  await CookieHelper.set('signup_data', JSON.stringify(signUpData), '5m');

  Logger.auth('회원가입 정보 검증 및 쿠키 저장 완료', { email: validatedEmail, username: validatedUsername, });

  return {
    success: true,
    message: '검증 성공',
  };
}
