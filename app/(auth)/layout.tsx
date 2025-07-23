import React from 'react';

import { DetectPath } from '@/(common)/_components';
import { Card } from '@/(common)/_components/ui/card';
import { setMeta } from '@/_libs';

import { AuthLayoutMain } from './_components/AuthLayoutMain';

interface Props {
  children: React.ReactNode;
}

export const metadata = setMeta({
  title: '인증',
  url: '/auth',
  robots: 'noindex, nofollow',
});

export default function AuthLayout({ children, }: Props) {
  return (
    <>
      <DetectPath isAuthGuard={false} />
      <AuthLayoutMain>
        {children}
      </AuthLayoutMain>
    </>
  );
}
