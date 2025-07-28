'use server';

import { redirect } from 'next/navigation';

import { Logger } from '@/_libs/tools/logger.tools';
import { createActionClient } from '@/_libs/server/supabase';

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

    if (!email || !password) {
      return {
        step: 1,
        message: '이메일과 비밀번호를 입력해주세요.',
      };
    }

    const supabase = await createActionClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Logger.authError(`로그인 실패: ${error.message}`, { email, });
      return {
        step: 1,
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      };
    }

    if (data.user) {
      Logger.auth('이메일/비밀번호 인증 성공, OTP 인증 단계로 이동', { email, userId: data.user.id });
      redirect(`/auth/signin/otp?email=${encodeURIComponent(email)}`);
    }

    return {
      step: 2,
      message: 'OTP 인증이 필요합니다.',
    };
  }
  catch (error) {
    Logger.authError('로그인 처리 중 오류 발생', { error, });
    return {
      step: 1,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}