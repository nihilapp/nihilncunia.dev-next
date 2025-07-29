'use server';

import { redirect } from 'next/navigation';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';

import type { SignUpData } from '@/_entities/auth/auth.types';
import { createActionClient } from '@/_libs/server/supabase';
import { CookieHelper } from '@/_libs/tools/cookie.tools';
import { Logger } from '@/_libs/tools/logger.tools';
import { RateLimiter } from '@/_libs/tools/rate-limit.tools';

export type SetupOtpFormState = {
  step: number;
  message: string;
  qrCodeUrl?: string;
  otpSecret?: string;
};

export async function setupOtpAction(
  prevState: SetupOtpFormState,
  formData: FormData
): Promise<SetupOtpFormState> {
  try {
    const action = formData.get('_action') as string;

    const signUpDataCookie = await CookieHelper.get<string>('signup_data');
    if (!signUpDataCookie) {
      return {
        step: 1,
        message: '회원가입 정보가 만료되었습니다. 다시 시작해주세요.',
      };
    }

    const signUpData: SignUpData = JSON.parse(signUpDataCookie);
    const { email, username, password, role, } = signUpData;

    if (action === 'generate') {
      const secret = authenticator.generateSecret();
      const serviceName = 'nihilncunia.dev';
      const otpAuthUrl = authenticator.keyuri(email, serviceName, secret);

      const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);

      Logger.auth('OTP 시크릿 생성 완료', { email, username, });

      return {
        step: 2,
        message: 'QR 코드가 생성되었습니다.',
        qrCodeUrl,
        otpSecret: secret,
      };
    }

    if (action === 'verify') {
      return {
        step: 3,
        message: 'OTP 코드를 입력해주세요.',
        qrCodeUrl: prevState.qrCodeUrl,
        otpSecret: prevState.otpSecret,
      };
    }

    if (action === 'complete') {
      const otpCode = formData.get('otpCode') as string;
      const secret = prevState.otpSecret;

      if (!otpCode || !secret) {
        return {
          step: 3,
          message: 'OTP 코드와 시크릿이 필요합니다.',
          qrCodeUrl: prevState.qrCodeUrl,
          otpSecret: secret,
        };
      }

      if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
        return {
          step: 3,
          message: 'OTP 코드는 6자리 숫자여야 합니다.',
          qrCodeUrl: prevState.qrCodeUrl,
          otpSecret: secret,
        };
      }

      // Rate limiting 확인 (회원가입 OTP는 이메일 기반)
      const rateLimitResult = await RateLimiter.checkLimit(email, 'otp');

      if (!rateLimitResult.allowed) {
        Logger.authError('회원가입 OTP 검증 rate limit 초과', { email, lockTimeLeft: rateLimitResult.lockTimeLeft, });
        return {
          step: 3,
          message: rateLimitResult.message,
          qrCodeUrl: prevState.qrCodeUrl,
          otpSecret: secret,
        };
      }

      const isValid = authenticator.check(otpCode, secret);

      // Rate limiting 기록
      await RateLimiter.recordAttempt(email, 'otp', isValid);

      if (!isValid) {
        // 실패 시 남은 시도 횟수 안내
        const warningMessage = rateLimitResult.attemptsLeft > 0
          ? `OTP 코드가 올바르지 않습니다. (남은 시도: ${rateLimitResult.attemptsLeft}회)`
          : 'OTP 코드가 올바르지 않습니다.';

        return {
          step: 3,
          message: warningMessage,
          qrCodeUrl: prevState.qrCodeUrl,
          otpSecret: secret,
        };
      }

      const supabase = await createActionClient();

      const { data: signUpData, error: signUpError, } = await supabase.auth.signUp({
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
          step: 3,
          message: '회원가입에 실패했습니다.',
          qrCodeUrl: prevState.qrCodeUrl,
          otpSecret: secret,
        };
      }

      await CookieHelper.remove('signup_data');

      Logger.auth(`회원가입 및 OTP 설정 완료: ${email}`, { userId: signUpData.user?.id, });
      redirect('/auth/signup/complete');
    }

    return {
      step: 1,
      message: '알 수 없는 액션입니다.',
    };
  }
  catch (error) {
    Logger.authError('OTP 설정 중 오류 발생', { error, });
    return {
      step: prevState.step,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
      qrCodeUrl: prevState.qrCodeUrl,
      otpSecret: prevState.otpSecret,
    };
  }
}
