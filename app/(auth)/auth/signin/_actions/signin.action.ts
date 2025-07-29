'use server';

import { redirect } from 'next/navigation';

import { Logger } from '@/_libs/tools/logger.tools';

import { authenticateWithPassword } from './authenticate';

export type SignInFormState = {
  step: number;
  message: string;
};

export async function signInAction(
  prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await authenticateWithPassword(email, password);

    if (!result.success) {
      return {
        step: 1,
        message: result.message,
      };
    }

    redirect(`/auth/signin/otp?email=${encodeURIComponent(email)}`);
  }
  catch (error) {
    Logger.authError('로그인 처리 중 오류 발생', { error, });
    return {
      step: 1,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}
