import React from 'react';

import { Admin } from '@/(admin)/_components';
import { setMeta } from '@/_libs';

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
