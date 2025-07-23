import React from 'react';

import { setMeta } from '@/_libs';

import { Admin } from './_components/Admin';

interface Props {}

export const metadata = setMeta({
  title: `관리자 대시보드`,
  url: `/admin`,
});

export default function AdminPage() {
  return (
    <Admin />
  );
}
