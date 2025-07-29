import React from 'react';

import { AuthErrorBoundary } from '@/(auth)/_components';
import { setMeta } from '@/_libs';

import { SignUpOtp } from './_components/SignUpOtp';

export const metadata = setMeta({
  title: 'OTP 설정 - 계정 생성',
  url: '/auth/signup/otp',
});

export default function SignUpOtpPage() {
  return (
    <AuthErrorBoundary
      fallbackTitle='OTP 설정 오류'
      fallbackMessage='OTP 설정 중 오류가 발생했습니다. 처음부터 다시 시도해주세요.'
      resetButtonText='회원가입 다시 시작'
    >
      <SignUpOtp />
    </AuthErrorBoundary>
  );
}
