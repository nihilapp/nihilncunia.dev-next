'use server';

import { redirect } from 'next/navigation';

import type { SignUpFormState } from '@/_entities/auth/auth.types';
import { Logger } from '@/_libs/tools';

import { validateAndStoreSignUpData } from './validate-signup';

export async function signUpAction(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  try {
    const validationResult = await validateAndStoreSignUpData(formData);

    if (!validationResult.success) {
      return {
        step: 1,
        message: validationResult.message,
      };
    }

    redirect('/auth/signup/otp');
  }
  catch (error) {
    Logger.authError('회원가입 처리 중 오류 발생', { error, });
    return {
      step: 1,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}
