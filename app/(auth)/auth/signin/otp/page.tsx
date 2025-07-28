import React from 'react';

import { setMeta } from '@/_libs';
import { AuthErrorBoundary } from '@/(auth)/_components';

import { SignInOtp } from './_components/SignInOtp';

export const metadata = setMeta({
  title: 'OTP 인증 - 로그인',
  url: '/auth/signin/otp',
});

export default function SignInOtpPage() {
  return (
    <AuthErrorBoundary
      fallbackTitle='OTP 인증 오류'
      fallbackMessage='OTP 인증 중 오류가 발생했습니다.'
      resetButtonText='로그인 다시 시작'
    >
      <SignInOtp />
    </AuthErrorBoundary>
  );
}