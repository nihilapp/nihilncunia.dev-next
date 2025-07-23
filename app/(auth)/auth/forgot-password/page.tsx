import React from 'react';

import { ForgotPassword } from '@/(auth)/_components';
import { setMeta } from '@/_libs';

export const metadata = setMeta({
  title: '비밀번호 찾기',
  url: '/auth/forgot-password',
});

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
