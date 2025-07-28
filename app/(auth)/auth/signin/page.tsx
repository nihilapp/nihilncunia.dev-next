import React from 'react';

import { setMeta } from '@/_libs';
import { AuthErrorBoundary } from '@/(auth)/_components';

import { SignIn } from './_components/SignIn';

export const metadata = setMeta({
  title: `로그인`,
  url: `/auth/signin`,
});

export default function SignInPage() {
  return (
    <AuthErrorBoundary
      fallbackTitle='로그인 오류'
      fallbackMessage='로그인 처리 중 오류가 발생했습니다.'
      resetButtonText='다시 시도'
    >
      <SignIn />
    </AuthErrorBoundary>
  );
}
