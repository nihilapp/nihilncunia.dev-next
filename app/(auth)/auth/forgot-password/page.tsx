import React from 'react';

import { setMeta } from '@/_libs';

import { ForgotPassword } from './_components/ForgotPassword';

export const metadata = setMeta({
  title: '비밀번호 찾기',
  url: '/auth/forgot-password',
});

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
