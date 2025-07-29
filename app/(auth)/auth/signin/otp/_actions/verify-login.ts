'use server';

import { authenticator } from 'otplib';

import { otpSchema } from '@/_entities/auth';
import { createActionClient } from '@/_libs/server/supabase';
import { Logger } from '@/_libs/tools/logger.tools';
import { RateLimiter } from '@/_libs/tools/rate-limit.tools';

export async function verifyLoginOtp(email: string, otpCode: string) {
  const validationResult = otpSchema.safeParse({ email, otpCode, });

  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues[0]?.message || '입력값이 올바르지 않습니다.';
    return {
      success: false,
      message: errorMessage,
    };
  }

  const { email: validatedEmail, otpCode: validatedOtpCode, } = validationResult.data;

  const rateLimitResult = await RateLimiter.checkLimit(validatedEmail, 'otp');
  if (!rateLimitResult.allowed) {
    Logger.authError('OTP 검증 rate limit 초과', { email: validatedEmail, lockTimeLeft: rateLimitResult.lockTimeLeft, });
    return {
      success: false,
      message: rateLimitResult.message,
    };
  }

  const supabase = await createActionClient();
  const { data: profile, error: profileError, } = await supabase
    .from('profiles')
    .select('otp_secret')
    .eq('email', validatedEmail)
    .single();

  if (profileError || !profile || !profile.otp_secret) {
    Logger.authError('OTP 시크릿을 찾을 수 없음', { email: validatedEmail, error: profileError, });
    return {
      success: false,
      message: 'OTP 설정이 되어있지 않습니다.',
    };
  }

  const isValid = authenticator.check(validatedOtpCode, profile.otp_secret);
  await RateLimiter.recordAttempt(validatedEmail, 'otp', isValid);

  if (!isValid) {
    const warningMessage = rateLimitResult.attemptsLeft > 0
      ? `OTP 코드가 올바르지 않습니다. (남은 시도: ${rateLimitResult.attemptsLeft}회)`
      : 'OTP 코드가 올바르지 않습니다.';
    return {
      success: false,
      message: warningMessage,
    };
  }

  const { data: { session, }, } = await supabase.auth.getSession();
  if (!session) {
    Logger.authError('세션을 찾을 수 없음', { email: validatedEmail, });
    return {
      success: false,
      message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
    };
  }

  Logger.auth('OTP 인증 및 로그인 완료', { email: validatedEmail, userId: session.user.id, });
  return {
    success: true,
    message: '로그인 성공',
  };
}
