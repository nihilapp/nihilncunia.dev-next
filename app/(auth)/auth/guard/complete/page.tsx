import React from 'react';

import { setMeta } from '@/_libs';

import { GuardComplete } from './_components/GuardComplete';

interface Props {}

export const metadata = setMeta({
  title: `보호막 인증 완료`,
  url: `/auth/guard/complete`,
});

export default function GuardCompletePage() {
  return (
    <GuardComplete />
  );
}
