'use server';

import { redirect } from 'next/navigation';

import { Logger } from '@/_libs/tools/logger.tools';

import { sendCode } from './send-code';
import { verifyCode } from './verify-code';

type FormState = {
  step: number;
  message: string;
};

export async function passCodeAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const action = formData.get('_action');
  Logger.auth('패스코드 액션 시작', { action, });

  if (action === 'send') {
    Logger.auth('패스코드 전송 시작');
    const result = await sendCode();
    Logger.auth('패스코드 전송 완료', { result, });
    return result;
  }

  if (action === 'verify') {
    const passCode = formData.get('passCode') as string;
    const callback = formData.get('callback') as string;
    Logger.auth('패스코드 검증 시작', { callback, });

    const result = await verifyCode(passCode);
    Logger.auth('패스코드 검증 완료', { result, });

    // 패스코드 검증 성공 시 콜백 URL과 함께 리다이렉트
    if (result.step === 3) {
      const redirectUrl = callback
        ? `/auth/guard/complete?callback=${encodeURIComponent(callback)}`
        : '/auth/guard/complete';

      Logger.auth('패스코드 검증 성공, 완료 페이지로 리다이렉트', { redirectUrl, });
      redirect(redirectUrl);
    }

    return result;
  }

  // 알 수 없는 액션인 경우
  Logger.warn('AUTH', '알 수 없는 패스코드 액션', { action, });
  return {
    step: 1,
    message: '잘못된 요청입니다.',
  };
}
