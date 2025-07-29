'use server';

import { redirect } from 'next/navigation';

import type { SignUpData } from '@/_entities/auth/auth.types';
import { CookieHelper } from '@/_libs/tools/cookie.tools';
import { Logger } from '@/_libs/tools/logger.tools';

import { verifyOtpAndCreateUser } from './create-user-with-otp';
import { generateOtp } from './generate-otp';

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

    if (action === 'generate') {
      const { qrCodeUrl, secret, } = await generateOtp(signUpData.email);
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
          ...prevState,
          step: 3,
          message: 'OTP 코드와 시크릿이 필요합니다.',
        };
      }

      const result = await verifyOtpAndCreateUser(otpCode, secret, signUpData);

      if (!result.success) {
        return {
          ...prevState,
          step: 3,
          message: result.message,
        };
      }

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
      ...prevState,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}
