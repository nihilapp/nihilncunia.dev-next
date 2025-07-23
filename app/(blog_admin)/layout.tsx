import React from 'react';

import { setMeta } from '@/_libs';

interface Props {
  children: React.ReactNode;
}

export const metadata = setMeta({
  title: '블로그 관리자',
  url: '/blogs',
  robots: 'noindex, nofollow',
});

export default function BlogAdminLayout({ children, }: Props) {
  return (
    <>
      {children}
    </>
  );
}
