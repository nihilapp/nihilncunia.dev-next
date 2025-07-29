'use server';

import { redirect } from 'next/navigation';

import { Logger } from '@/_libs/tools/logger.tools';

import { verifyLoginOtp } from './verify-login';

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

    const result = await verifyLoginOtp(email, otpCode);

    if (!result.success) {
      return {
        step: 1,
        message: result.message,
      };
    }

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
