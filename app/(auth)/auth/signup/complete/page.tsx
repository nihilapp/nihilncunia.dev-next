import React from 'react';

import { setMeta } from '@/_libs';

import { SignUpComplete } from './_components/SignUpComplete';

export const metadata = setMeta({
  title: `계정 생성 완료`,
  url: `/auth/signup/complete`,
});

export default function SignUpCompletePage() {
  return <SignUpComplete />;
}
