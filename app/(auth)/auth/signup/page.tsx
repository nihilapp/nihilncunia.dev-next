import React from 'react';

import { setMeta } from '@/_libs';
import { AuthErrorBoundary } from '@/(auth)/_components';

import { SignUp } from './_components/SignUp';

export const metadata = setMeta({
  title: `계정 생성`,
  url: `/auth/signup`,
});

export default function SignUpPage() {
  return (
    <AuthErrorBoundary
      fallbackTitle='회원가입 오류'
      fallbackMessage='회원가입 처리 중 오류가 발생했습니다.'
      resetButtonText='다시 시도'
    >
      <SignUp />
    </AuthErrorBoundary>
  );
}
