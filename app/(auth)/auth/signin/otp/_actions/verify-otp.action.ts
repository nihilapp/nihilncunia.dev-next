'use server';

import { redirect } from 'next/navigation';
import { authenticator } from 'otplib';

import { createActionClient } from '@/_libs/server/supabase';
import { Logger } from '@/_libs/tools/logger.tools';
import { RateLimiter } from '@/_libs/tools/rate-limit.tools';

export type VerifyOtpFormState = {
  step: number;
  message: string;
};

export async function verifyOtpAction(
  prevState: VerifyOtpFormState,
  formData: FormData
): Promise<VerifyOtpFormState> {
  try {
    const email = formData.get('email') as string;
    const otpCode = formData.get('otpCode') as string;

    if (!email || !otpCode) {
      return {
        step: 1,
        message: '이메일과 OTP 코드를 입력해주세요.',
      };
    }

    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      return {
        step: 1,
        message: 'OTP 코드는 6자리 숫자여야 합니다.',
      };
    }

    // Rate limiting 확인
    const rateLimitResult = await RateLimiter.checkLimit(email, 'otp');

    if (!rateLimitResult.allowed) {
      Logger.authError('OTP 검증 rate limit 초과', { email, lockTimeLeft: rateLimitResult.lockTimeLeft, });
      return {
        step: 1,
        message: rateLimitResult.message,
      };
    }

    const supabase = await createActionClient();

    const { data: profile, error: profileError, } = await supabase
      .from('profiles')
      .select('otp_secret')
      .eq('email', email)
      .single();

    if (profileError || !profile || !profile.otp_secret) {
      Logger.authError('OTP 시크릿을 찾을 수 없음', { email, error: profileError, });
      return {
        step: 1,
        message: 'OTP 설정이 되어있지 않습니다.',
      };
    }

    const isValid = authenticator.check(otpCode, profile.otp_secret);

    // Rate limiting 기록
    await RateLimiter.recordAttempt(email, 'otp', isValid);

    if (!isValid) {
      Logger.authError('OTP 코드 검증 실패', { email, });

      // 실패 시 남은 시도 횟수 안내
      const warningMessage = rateLimitResult.attemptsLeft > 0
        ? `OTP 코드가 올바르지 않습니다. (남은 시도: ${rateLimitResult.attemptsLeft}회)`
        : 'OTP 코드가 올바르지 않습니다.';

      return {
        step: 1,
        message: warningMessage,
      };
    }

    const { data: { session, }, } = await supabase.auth.getSession();

    if (!session) {
      Logger.authError('세션을 찾을 수 없음', { email, });
      return {
        step: 1,
        message: '로그인 세션이 만료되었습니다. 다시 로그인해주세요.',
      };
    }

    Logger.auth('OTP 인증 및 로그인 완료', { email, userId: session.user.id, });
    redirect('/');
  }
  catch (error) {
    Logger.authError('OTP 인증 처리 중 오류 발생', { error, });
    return {
      step: 1,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}
