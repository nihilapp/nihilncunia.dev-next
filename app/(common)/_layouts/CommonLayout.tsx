'use client';

import React from 'react';
import { CommonHeader } from '@/(common)/_layouts/CommonHeader';
import { CommonNav } from '@/(common)/_layouts/CommonNav';
import { CommonContent } from '@/(common)/_layouts/CommonContent';
import { CommonFooter } from '@/(common)/_layouts/CommonFooter';

interface Props {
  children: React.ReactNode;
}

export function CommonLayout({ children, }: Props) {
  return (
    <>
      <CommonHeader />
      <CommonNav />
      <CommonContent>
        {children}
      </CommonContent>
      <CommonFooter />
    </>
  );
}
