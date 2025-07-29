import React from 'react';

import { AuthErrorBoundary } from '@/(auth)/_components';
import { setMeta } from '@/_libs';

import { AuthGuard } from './_components/AuthGuard';

export const metadata = setMeta({
  title: `보호막`,
  url: `/auth/guard`,
});

export default function AuthGuardPage() {
  return (
    <AuthErrorBoundary
      fallbackTitle='보안 인증 오류'
      fallbackMessage='패스코드 인증 중 오류가 발생했습니다.'
      resetButtonText='패스코드 다시 받기'
    >
      <AuthGuard />
    </AuthErrorBoundary>
  );
}
