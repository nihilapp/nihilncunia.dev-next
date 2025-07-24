'use server';

import { redirect } from 'next/navigation';

import { sendCode } from '@/(auth)/auth/guard/_actions/send-code';
import { verifyCode } from '@/(auth)/auth/guard/_actions/verify-code';

type FormState = {
  step: number;
  message: string;
};

export async function passCodeAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const action = formData.get('_action');

  if (action === 'send') {
    return await sendCode();
  }

  if (action === 'verify') {
    const passCode = formData.get('passCode') as string;
    const callback = formData.get('callback') as string;
    const result = await verifyCode(passCode);

    // 패스코드 검증 성공 시 콜백 URL과 함께 리다이렉트
    if (result.step === 3) {
      const redirectUrl = callback
        ? `/auth/guard/complete?callback=${encodeURIComponent(callback)}`
        : '/auth/guard/complete';
      redirect(redirectUrl);
    }

    return result;
  }

  // 알 수 없는 액션인 경우
  return {
    step: 1,
    message: '잘못된 요청입니다.',
  };
}
