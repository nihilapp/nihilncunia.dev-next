import React from 'react';

import { DetectPath } from '@/(common)/_components';
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
    <main className='min-h-dvh w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center py-dvh-5 px-4'>
      <DetectPath isAuthGuard={true} />
      <AuthLayoutMain>{children}</AuthLayoutMain>
    </main>
  );
}
