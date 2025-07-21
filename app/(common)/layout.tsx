import React from 'react';

import { CommonLayout } from './_layouts/CommonLayout';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children, }: Props) {
  return (
    <CommonLayout>
      {children}
    </CommonLayout>
  );
}
