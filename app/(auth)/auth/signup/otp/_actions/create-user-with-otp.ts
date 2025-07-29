'use server';

import { authenticator } from 'otplib';

import { otpSchema } from '@/_entities/auth';
import type { SignUpData } from '@/_entities/auth/auth.types';
import { createActionClient } from '@/_libs/server/supabase';
import { CookieHelper } from '@/_libs/tools/cookie.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import { RateLimiter } from '@/_libs/tools/rate-limit.tools';

export async function verifyOtpAndCreateUser(
  otpCode: string,
  secret: string,
  signUpData: SignUpData
) {
  const { email, username, password, role, } = signUpData;

  const validationResult = otpSchema.safeParse({ email, otpCode, });

  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues[0]?.message || '입력값이 올바르지 않습니다.';
    return {
      success: false,
      message: errorMessage,
    };
  }

  const { otpCode: validatedOtpCode, } = validationResult.data;

  const rateLimitResult = await RateLimiter.checkLimit(email, 'otp');
  if (!rateLimitResult.allowed) {
    Logger.authError('회원가입 OTP 검증 rate limit 초과', { email, lockTimeLeft: rateLimitResult.lockTimeLeft, });
    return {
      success: false,
      message: rateLimitResult.message,
    };
  }

  const isValid = authenticator.check(validatedOtpCode, secret);
  await RateLimiter.recordAttempt(email, 'otp', isValid);

  if (!isValid) {
    const warningMessage = rateLimitResult.attemptsLeft > 0
      ? `OTP 코드가 올바르지 않습니다. (남은 시도: ${rateLimitResult.attemptsLeft}회)`
      : 'OTP 코드가 올바르지 않습니다.';
    return {
      success: false,
      message: warningMessage,
    };
  }

  const supabase = await createActionClient();
  const { data: newUserData, error: signUpError, } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        role,
        otp_secret: secret,
      },
    },
  });

  if (signUpError) {
    Logger.authError(`회원가입 실패: ${signUpError.message}`, { email, username, });
    return {
      success: false,
      message: '회원가입에 실패했습니다.',
    };
  }

  await CookieHelper.remove('signup_data');
  Logger.auth(`회원가입 및 OTP 설정 완료: ${email}`, { userId: newUserData.user?.id, });

  return {
    success: true,
    message: '회원가입 성공',
  };
}
