import React from 'react';

import { setMeta } from '@/_libs';

interface Props {
  children: React.ReactNode;
}

export const metadata = setMeta({
  title: '관리자',
  url: '/admin',
  robots: 'noindex, nofollow',
});

export default function AdminLayout({ children, }: Props) {
  return (
    <>
      {children}
    </>
  );
}
