'use server';

import { redirect } from 'next/navigation';

import { Logger } from '@/_libs/tools';
import { CookieHelper } from '@/_libs/tools/cookie.tools';
import type { SignUpFormState, SignUpData } from '@/_entities/auth/auth.types';

export async function signUpAction(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const username = formData.get('username') as string;
    const role = formData.get('role') as string;

    if (!email || !password || !confirmPassword || !username) {
      return {
        step: 1,
        message: '모든 필드를 입력해주세요.',
      };
    }

    if (password !== confirmPassword) {
      return {
        step: 1,
        message: '비밀번호가 일치하지 않습니다.',
      };
    }

    if (password.length < 8) {
      return {
        step: 1,
        message: '비밀번호는 최소 8자 이상이어야 합니다.',
      };
    }

    const signUpData: SignUpData = {
      email,
      username,
      password,
      role,
    };

    await CookieHelper.set('signup_data', JSON.stringify(signUpData), '5m');

    Logger.auth('회원가입 정보 검증 완료, OTP 설정 단계로 이동', { email, username, });

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
